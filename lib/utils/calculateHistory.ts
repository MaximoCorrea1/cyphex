import {BalanceSnapshot, Transaction} from "../types";
import {yoctoToDecimal} from "./toDecimal"

export function calculateBalanceSnapshots(
 transactions: Transaction[],
 accountId: string,
 accountCreationTime: number,
 currentTime: number,
 numSnapshots: number = 100
): BalanceSnapshot[]{
 
    //sort txs by age, oldest to youngest
    const sortedTxs = transactions.sort((a, b) => 
        a.blockTimeStamp - b.blockTimeStamp
    );

    const age = currentTime - accountCreationTime;
    

    const interval = age / (numSnapshots -1);
    
    const snapshotTimes: number[] = [];
    for (let i = 0; i < numSnapshots; i++){
        snapshotTimes.push(accountCreationTime + (interval * i));
    }

    const snapshots: BalanceSnapshot[] = [];
    let balance = 0;
    let txIndex = 0;

    for(const snapshotTime of snapshotTimes){
        
        //process all txs up to to each snapshotTime
        while(txIndex < sortedTxs.length && sortedTxs[txIndex].blockTimeStamp <= snapshotTime){
         const tx = sortedTxs[txIndex];

         if(tx.receiverId == accountId){
            balance += yoctoToDecimal(tx.amount);
         }else{
            balance -= yoctoToDecimal(tx.amount);
         }
         txIndex++;
        }

        snapshots.push({
            timestamp: snapshotTime,
            balance: balance.toString(),
        })
    }

    return snapshots;
}