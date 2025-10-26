import {calculateBalanceSnapshots} from "@/lib/utils/calculateHistory";
import{NearTransaction, HistoricalData, NearBlocksReceipt} from "@/lib/types";


export async function POST(request: Request){
  
  try{

     const req = await request.json();
     const {accountId} = req;
     console.log(req);

     //validate account
     const accountData = await fetch("https://rpc.mainnet.near.org",{
      method: "POST",
      headers: {
        "Content-Type": "applications/json"
      },
      body: JSON.stringify({
        jsonrpc:"2.0",
        id: "dontcare",
        method: "query",
        params: {
            request_type:"view_account",
            account_id: accountId,
            finality: "final"
        }
      })
     });
 
     const accountDataJson = await accountData.json();

     if(!accountData.ok || accountDataJson.error) return Response.json(
        {success: false, error: "Account not found or invalid."},
        {status: 404}
     );

     console.log("Account validated: ", accountId);


     //fetch all txs
     let page =1;
     const allReceipts: NearBlocksReceipt[] = [];
     const PER_PAGE = 250;  

     console.log("fetching txs for user: ", accountId);

     while(true){
        const response = await fetch (
             `https://api.nearblocks.io/v1/account/${accountId}/receipts?page=${page}&per_page=${PER_PAGE}`,
             {
                headers:{
                    "Authorization": `Bearer ${process.env.NEARBLOCKS_API_KEY}`
                }
             }
        );

        if(!response.ok){
            throw new Error(`NearBlocks API ERROR: ${response.status}`);
        }

        const data = await response.json();
        const receipts = data.txns || [];

        if(receipts.length === 0){
            console.log("no more NEAR receipts");
            break;
        }

        //filter for NEAR transfers only (skip other tokens for now, after mvp we add them)
        const nearTransfers = receipts.filter(
            (receipt: NearBlocksReceipt) =>{
                const isTransfer = receipt.actions?.[0].action === "TRANSFER";
                const succeded = receipt.receipt_outcome?.status === true;
                return isTransfer && succeded;
            }
        );

        allReceipts.push(...nearTransfers);
        console.log(`   Page ${page}: ${nearTransfers.length}/${receipts.length} NEAR transfers (total: ${allReceipts.length})`);


        if(receipts.length < PER_PAGE){
            console.log("last page reached");
            break;
        }

        page++;
 

        //remove on production!!!
        if(page > 2){
            console.warn("hit safety limit of 100 pages (10000 txs)");
            break;
        }

     }
     console.log("total transactions fetched: ", allReceipts);

     //transfrom receipts to NearTransaction format
     const transformed: NearTransaction[] = allReceipts.map(receipt => ({
        hash: receipt.receipt_id,
        signerId: receipt.predecessor_account_id,
        receiverId: receipt.receiver_account_id,
        blockTimeStamp: Math.floor(receipt.receipt_block.block_timestamp / 1_000_000_000),//nanoseconds to seconds
        amount: receipt.actions[0].deposit.toString(),
        actions: [{kind: receipt.actions[0].action, args: receipt.actions[0].deposit }]
     }));

     //get account creation time (earliest receipt)
     const accountCreationTime = transformed.length>0 ? transformed[0].blockTimeStamp : Math.floor(Date.now() / 1000);
     
     const snapshots = calculateBalanceSnapshots(
        transformed,
        accountId,
        accountCreationTime,
        Math.floor(Date.now()/1000), 
        100
     );

     console.log("total snapshots calculated: ", snapshots.length);

     return Response.json({
        success: true,
        txs: allReceipts,
        data: {
            accountId,
            snapshots,
            calculatedAt: Date.now(),
            fromBlock: transformed.length > 0 ? transformed[0].blockTimeStamp : 0,
            toBlock: Math.floor(Date.now() / 1000)
        }
     });




    }catch(error){
        console.log(error);
        return Response.json({
            success: false, error: (error as Error).message
        }, {status: 500});
    }



}