'use client';

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {WagmiProvider} from 'wagmi';
import {RainbowKitProvider, darkTheme} from '@rainbow-me/rainbowkit';
import {useState, type ReactNode} from "react";
import {config } from "@/lib/wagmi";

import '@rainbow-me/rainbowkit/styles.css';

export function Providers({children}: {children: ReactNode}){
    const [queryClient] = useState(() => new QueryClient());

    return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#00FF41',
            borderRadius: 'none',
          })}
        >
          {children}
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}