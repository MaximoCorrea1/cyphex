import { http} from 'wagmi';
import {mainnet,} from 'wagmi/chains';
import {getDefaultConfig} from '@rainbow-me/rainbowkit';

export const config = getDefaultConfig({
   appName: 'Cyphex',
   projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? 'development',
   chains: [mainnet],
   transports: {
      [mainnet.id]: http(
         process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
           ? `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
           : undefined
      ),
   },
   ssr: true
});