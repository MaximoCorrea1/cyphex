'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { useState, type ReactNode } from 'react';
import { config } from '@/lib/wagmi';

// RainbowKit styles - required for the modal to render correctly
import '@rainbow-me/rainbowkit/styles.css';

/**
 * PROVIDERS COMPONENT
 * 
 * This wraps our app with three nested providers:
 * 
 * 1. QueryClientProvider (React Query)
 *    - Manages server state (caching, refetching, deduplication)
 *    - wagmi uses this internally for all blockchain queries
 * 
 * 2. WagmiProvider
 *    - Provides wallet connection state to all components
 *    - Manages the connection lifecycle
 * 
 * 3. RainbowKitProvider
 *    - Provides the connect modal UI
 *    - Handles wallet discovery and icons
 * 
 * ORDER MATTERS: Query > Wagmi > RainbowKit
 * RainbowKit depends on Wagmi, Wagmi depends on React Query.
 */

/**
 * WHY useState FOR QueryClient?
 * 
 * In Next.js App Router with 'use client':
 * - Module-level variables are shared across all users (bad for QueryClient)
 * - useState ensures each user gets their own QueryClient instance
 * - This prevents cache pollution between users
 */

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Create QueryClient inside component to ensure one per user session
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Don't refetch on window focus for blockchain data
            // (we'll manually control refetch intervals)
            refetchOnWindowFocus: false,
            // Retry failed requests twice
            retry: 2,
            // Consider data stale after 30 seconds
            staleTime: 30 * 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <RainbowKitProvider
          theme={darkTheme({
            // Cyberpunk color customization
            accentColor: '#00FF41', // Neon green
            accentColorForeground: '#000000',
            borderRadius: 'none', // Sharp corners
            fontStack: 'system',
          })}
          // Show balance in connect button
          showRecentTransactions={false}
          // Compact mode for cleaner UI
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}