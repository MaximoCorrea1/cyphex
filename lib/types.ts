//snapshot, single point in time. REPRESENTS BALANCE AT ONE MOMENT
export interface BalanceSnapshot{
    timestamp: number; //unix timestamp
    balance: string; 
    blockHeight?: number;
}

//historical data. Full timeline
export interface HistoricalData{
    accountId: string;
    snapshots: BalanceSnapshot[]; //array of 100 points (for now **in the future paid users can update this)
    calculatedAt: number; 
    fromBlock: number;
    toBlock: number;
}

//cached data
export interface CachedHistory{
    [accountId: string]: {
        data: HistoricalData;
        cachedAt: number;
    };
}

//NEAR tx from RPC
export interface NearTransaction{
    hash: string;
    signerId: string;
    receiverId: string;
    blockTimeStamp: number; //nanoseconds!!!
    amount: string;
    actions: Array<{kind: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        args: any;
    }>
}

//NEAR receipt from NEARBLOCKS API
export interface NearBlocksReceipt {
  receipt_id: string;
  predecessor_account_id: string;
  receiver_account_id: string;
  receipt_block: {
    block_timestamp: number;
  };
  actions: Array<{
    action: string;
    deposit: number;
  }>;
  receipt_outcome: {
    status: boolean;
  };
}
