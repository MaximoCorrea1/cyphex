'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useEthBalance } from '@/hooks/useEthBalance';

/**
 * HOME PAGE
 * 
 * MVP states:
 * - Disconnected: Show connect prompt
 * - Connecting: Show loading state
 * - Connected: Show address + ETH balance
 */
export default function Home() {
  const { address, isConnected, isConnecting } = useAccount();

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl tracking-tight">
          <span className="text-[#00FF41]">CYPHEX</span>
        </h1>
        <ConnectButton 
          showBalance={false}
          chainStatus="icon"
          accountStatus="address"
        />
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        {isConnecting ? (
          <LoadingState />
        ) : isConnected && address ? (
          <ConnectedState address={address} />
        ) : (
          <DisconnectedState />
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-4 text-center text-white/40 text-sm">
        Zero-knowledge portfolio tracking. Your keys, your data.
      </footer>
    </main>
  );
}

/**
 * DISCONNECTED STATE
 */
function DisconnectedState() {
  return (
    <div className="text-center space-y-6 max-w-md">
      <div className="text-6xl mb-4">◈</div>
      <h2 className="text-2xl">Connect Your Wallet</h2>
      <p className="text-white/60 leading-relaxed">
        Cyphex runs entirely in your browser. We never see your address, 
        your balances, or your transactions. Connect to begin.
      </p>
      <div className="pt-4">
        <ConnectButton />
      </div>
    </div>
  );
}

/**
 * CONNECTED STATE
 * 
 * Displays address and fetches ETH balance.
 */
function ConnectedState({ address }: { address: string }) {
  const { balance, isLoading, isError } = useEthBalance(address);

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Address Display */}
      <div className="text-center">
        <div className="text-[#00FF41] text-xs tracking-widest mb-2">
          CONNECTED
        </div>
        <div className="font-mono text-sm bg-white/5 px-4 py-2 border border-white/10 inline-block">
          {formatAddress(address)}
        </div>
      </div>

      {/* Balance Card */}
      <div className="border border-white/10 bg-white/[0.02]">
        {/* Card Header */}
        <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center">
          <span className="text-white/40 text-xs tracking-widest">
            NATIVE BALANCE
          </span>
          <span className="text-white/40 text-xs">
            ETHEREUM
          </span>
        </div>

        {/* Card Content */}
        <div className="px-4 py-6">
          {isLoading ? (
            <BalanceSkeleton />
          ) : isError ? (
            <BalanceError />
          ) : balance ? (
            <BalanceDisplay 
              amount={balance.balance} 
              symbol={balance.token.symbol}
              rawAmount={balance.rawBalance}
            />
          ) : null}
        </div>
      </div>

      {/* Debug: Raw Value (remove in production) */}
      {balance && (
        <div className="text-white/20 text-xs font-mono text-center">
          RAW: {balance.rawBalance} wei
        </div>
      )}
    </div>
  );
}

/**
 * BALANCE DISPLAY
 * 
 * Shows the formatted balance with symbol.
 * Amount is right-aligned for that Bloomberg terminal aesthetic.
 */
function BalanceDisplay({ 
  amount, 
  symbol,
  rawAmount,
}: { 
  amount: string; 
  symbol: string;
  rawAmount: string;
}) {
  // Format with reasonable decimal places for display
  // Full precision available in rawAmount if needed
  const displayAmount = formatBalance(amount);

  return (
    <div className="flex items-baseline justify-between">
      <span className="text-white/60 text-sm">{symbol}</span>
      <span className="text-3xl font-light tracking-tight">
        {displayAmount}
      </span>
    </div>
  );
}

/**
 * BALANCE SKELETON
 * 
 * Loading state with terminal cursor aesthetic.
 */
function BalanceSkeleton() {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-white/60 text-sm">ETH</span>
      <span className="text-3xl text-white/20">
        -.----<span className="animate-blink">█</span>
      </span>
    </div>
  );
}

/**
 * BALANCE ERROR
 */
function BalanceError() {
  return (
    <div className="text-center text-[#FF0080] text-sm">
      Failed to fetch balance. Check your connection.
    </div>
  );
}

/**
 * LOADING STATE (connection)
 */
function LoadingState() {
  return (
    <div className="text-center">
      <span className="text-white/60">
        CONNECTING<span className="animate-blink">█</span>
      </span>
    </div>
  );
}

/**
 * FORMAT ADDRESS
 * 
 * Truncates: 0x1234567890abcdef... → 0x1234...cdef
 */
function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * FORMAT BALANCE
 * 
 * Formats balance string for display:
 * - Shows up to 6 decimal places
 * - Removes trailing zeros
 * - Handles edge cases (0, very small amounts)
 */
function formatBalance(balance: string): string {
  const num = parseFloat(balance);
  
  // Handle zero
  if (num === 0) return '0.00';
  
  // Handle very small amounts (show scientific notation threshold)
  if (num < 0.000001 && num > 0) return '<0.000001';
  
  // Format with up to 6 decimals, remove trailing zeros
  const formatted = num.toFixed(6);
  
  // Remove trailing zeros but keep at least 2 decimal places
  const trimmed = formatted.replace(/\.?0+$/, '');
  
  // Ensure at least 2 decimal places for consistency
  if (!trimmed.includes('.')) return trimmed + '.00';
  
  const decimals = trimmed.split('.')[1]?.length || 0;
  if (decimals < 2) return trimmed + '0'.repeat(2 - decimals);
  
  return trimmed;
}