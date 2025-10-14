//chyphex/hooks/
import {useState, useEffect} from 'react'
import {yoctoToDecimal} from "@/lib/utils/yoctoToDecimal"

export default function useNearBalance(accountId: string | null){
 const [loading, setLoading] = useState<boolean>(false);
 const [error, setError] = useState<Error | null>(null);

 const [balance, setBalance] = useState<number>(0);
 const [yoctoBalance, setYoctoBalance] = useState<string>("0");

 useEffect(()=>{
  if(!accountId) return;

  async function fetchBalance(){
    setLoading(true);
    setError(null);

    try{
       
      const response = await fetch("/api/near-rpc",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            jsonrpc: "2.0",
            id: "dontcare",
            method: "query",
            params: {
                request_type: "view_account",
                account_id: accountId,
                finality: "final"
            }
        })
      });

      const data = await response.json();
      console.log("RPC RESPONSE: ",data);

      const amount =  data.result.amount;
      const balance = yoctoToDecimal(amount);

      setYoctoBalance(amount);
      setBalance(balance);

      console.log(amount, balance);

      

    }catch(err){
        setError(err as Error);
        setBalance(0);
        setYoctoBalance("0");

    }finally{
        setLoading(false);
    }

 }

 fetchBalance();

 }, [accountId]);

 

 return {balance, yoctoBalance, loading, error};

};