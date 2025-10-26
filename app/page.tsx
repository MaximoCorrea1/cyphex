
'use client';
import {useState, useEffect} from 'react';
import {initWalletSelector} from '@/lib/near';
import type {
 WalletSelector
} from '@near-wallet-selector/core/src/lib/wallet-selector.types.ts'
import type {
  WalletSelectorModal
} from '@near-wallet-selector/modal-ui/src/lib/modal.types.ts'
import type{
  WalletSelectorState
} from '@near-wallet-selector/core/src/lib/store.types.ts'

import useNearBalance from "../hooks/useNearBalance"




export default function Home() {

 //tracking connection
 const [accountId, setAccountId] = useState<string | null>(null);

 const [selector, setSelector] = useState<WalletSelector | null>(null);

 const [modal, setModal] = useState<WalletSelectorModal | null>(null);

 const [loading, setLoading] = useState(true);
 
 const data: {
    balance: number;
    yoctoBalance: string;
    loading: boolean;
    error: Error | null;
}
 = useNearBalance(accountId); 

 useEffect(()=>{
 async function testAPI(){
  const response = await fetch("/api/near-history",{
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({accountId: "maxoc.near"})
  })
  const data = await response.json();
  console.log(data);
 }

 testAPI();

}, []);


 useEffect(() => {
  
   const setupWallet = async () =>{

     try{

      const {selector: _selector, modal:_modal} = await initWalletSelector();
      
      setSelector(_selector);
      setModal(_modal);
      
      //check if user is already connected
      const state = _selector.store.getState();
      if(state.accounts.length > 0){
        setAccountId(state.accounts[0].accountId);
      }

      setLoading(false);



     }catch(error){

      console.error("FAILED TO INITIALIZE WALLET:", error);
      setLoading(false);

     }
   };

   setupWallet();

   

 }, []);


//listen for wallet state changes
 useEffect(()=>{
  if(!selector) return;
  
  const subscription = selector.store.observable.subscribe((state: WalletSelectorState)=>{
   //when state changes check if there are connected accounts
   if(state.accounts.length > 0){
    setAccountId(state.accounts[0].accountId);
   }else{
    setAccountId(null);
   }

  })

  return () => subscription.unsubscribe();



 }, [selector]);

 const handleConnect = () =>{
  if(modal){
    modal.show();
  }
 };

 const handleDisconnect = async ()=>{
  if(!selector) return;

  const wallet = await selector.wallet();
  await wallet.signOut();
  setAccountId(null);

 };

 if(loading){
  return(
    <main className="p-5">
      <h1>Cyphex</h1>
      <p>Initialazing wallet connection...</p>
    </main>
  );
 }

  return (
    <div >
      <main className="min-h-screen p-2 m-auto ">
        <h1>Cyphex</h1>

        { !accountId ? 
          (<div>
            <p className="m-2">Connect your NEAR wallet to continue</p>
            <button className="m-1 bg-amber-400"
            onClick={handleConnect}>Connect Wallet</button>
          </div>) : 
          (
            <div>
              <p className="m-2">Connected as: <strong>{accountId}</strong></p>

             

              <div className="m-2 p-2 bg-amber-400">
                
                {data.loading ? 
                (<h2>loading balance...</h2>) : data.error ? (<p>ERROR: {data.error.message}</p>) :
               
               (<h2>{ data.balance + " Ⓝ"}</h2>)}
                 
              </div>
              
              <button className="m-1 border-amber-50 bg-amber-50"
              onClick={handleDisconnect}>Disconnect</button>
              
            </div>
          )
        }


       
      
      </main>
    </div>
  );
}
