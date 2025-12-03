/**
 * chain-agnostic types, these types are designed to work on any blockchain. Chain-specific adapters will transform raw data into these formats
 */


// ----CORE TYPES-----

//this will expand with time
export type ChainId = 'ethereum' | 'polygon' | 'arbitrum' | 'optimism' | 'base';

export interface Address{
  value: string; //format varies
  chain: ChainId;
}

//any token, native or ERC-20, etc
export interface Token{
  symbol: string;
  name: string;
  decimals: number; // 18 for ETH, 24 for NEAR, etc
  contractAddress?: string; //undefined for native tokens
  chain: ChainId;
  logoUrl?: string;
}


export interface TokenBalance{
  token: Token;
  rawBalance: string;
  balance: number;
  usdValue?: number;
}

// ---TRANSACTION TYPES----

export type TransferDirection = 'in' | 'out';

//a single token transfer (simplified). One tx can have multiple transfers

export interface Transfer {
  hash: string;
  from: string;
  to: string;
  token: Token;
  rawAmount: string; //smallest units
  timestamp: number; //unix seconds
  blockNumber: number;
  direction: TransferDirection; //relative to the account tracked
  chain: ChainId;

}

//raw tx data, chain-specific
export interface Transaction{
 hash: string;
 from: string;
 to: string | null; //null for contract creation 
 value: string;
 timestamp: number;
 blockNumber: number;
 gasUsed?:string;
 gasPrice?: string;
 status: 'success' | 'failed'  | 'pending';
 chain: ChainId;
 //chain specific data can be added via extension
}

//----PORTFOLIO TYPES-----

//single point in time balance spanshot. this builds the historical chart
export interface BalanceSnapshot{
  timestamp: number; //unix
  balance: number; //human readable
  usdValue?: number;
  blockNumer?: number;
}

//historical balance by token
export interface BalanceHistory{
  address: Address;
  token: Token;
  snapshots: BalanceSnapshot[];
  fromTimestamp: number;
  toTimestamp: number;
  calculatedAt: number; //when it was computed

  
}

//complete portfolio for a single address
export interface AddressPortfolio{
  address: Address;
  nativeBalance: TokenBalance;
  tokenBalances: TokenBalance[];
  totalUsdValue?: number;
  lastUpdated: number;

}

/**
 * Aggregated portfolio across multiple addresses/chains
 */
export interface Portfolio {
  addresses: Address[];
  portfolios: AddressPortfolio[];
  totalUsdValue?: number;
  lastUpdated: number;
}

// ============================================
// API RESPONSE TYPES
// ============================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

// ============================================
// CACHE TYPES
// ============================================

/**
 * Cached data wrapper with expiration
 */
export interface CachedData<T> {
  data: T;
  cachedAt: number;
  expiresAt: number;
}

/**
 * Cache keys for localStorage/IndexedDB
 */
export const CACHE_KEYS = {
  PORTFOLIO: (address: string, chain: ChainId) => 
    `cyphex:portfolio:${chain}:${address}`,
  HISTORY: (address: string, chain: ChainId, token: string) => 
    `cyphex:history:${chain}:${address}:${token}`,
  PRICES: (symbol: string) => 
    `cyphex:price:${symbol}`,
} as const;

// Cache duration in milliseconds
export const CACHE_DURATION = {
  PORTFOLIO: 60 * 1000,        // 1 minute
  HISTORY: 5 * 60 * 1000,      // 5 minutes  
  PRICES: 30 * 1000,           // 30 seconds
} as const;