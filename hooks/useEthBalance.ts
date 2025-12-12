import {useBalance} from "wagmi";
import { type Address as ViemAddress } from "viem";
import { type TokenBalance, type Token} from "@/lib/types";
import {toDecimal} from "@/lib/utils/toDecimal";

//fetch native ETH balance for an address, uses wagmis useBalance hook

export function useEthBalance(address: string | undefined){
    const{
        data,
        isLoading,
        isError,
        error,
        refetch
    } = useBalance({
        address: address as ViemAddress | undefined,
        query:{
            enabled: !!address
        }
    });

    //cast data to TokenBalance type
    const balance: TokenBalance | null = data ? {
        token: ETH_TOKEN,
        rawBalance: data.value.toString(),
        balance: toDecimal(data.value.toString(), ETH_TOKEN.decimals)

    } : null;

    return {
        balance,
        isLoading,
        isError,
        error,
        refetch,
        raw : data
    };
}

const ETH_TOKEN: Token = {
    symbol: 'ETH',
    name: 'ethereum',
    decimals: 18,
    contractAddress: undefined,
    chain: 'ethereum',
    logoUrl: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',

};