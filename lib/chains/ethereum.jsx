import {createPublicClient} from 'viem';
import {mainnet} from 'viem/chains';

const publicClient = createPublicClient({
    batch: {
        multicall: true
    },
    chain: mainnet
   
});

export async function getBlockNumber() {

    const blockNumber = await publicClient.getBlockNumber();
    return blockNumber;
}




