import {setupWalletSelector} from "@near-wallet-selector/core";
import {setupModal} from "@near-wallet-selector/modal-ui";
import {setupMyNearWallet} from "@near-wallet-selector/my-near-wallet";
import "@near-wallet-selector/modal-ui/styles.css";


//what network we are using
const NETWORK_ID = "testnet";

//manages init wallet selector returns borh wallet state and popup ui
export async function initWalletSelector(){
  
    const selector = await setupWalletSelector({
        network: NETWORK_ID,
        modules: [
            //adds MyNearWallet as an option (can add more providers later)
            setupMyNearWallet()]
    });

    const modal = setupModal(selector, {
        contractId: "", 
        description: "Connect your NEAR wallet to Cyphex"
    });

    return {selector, modal};


}