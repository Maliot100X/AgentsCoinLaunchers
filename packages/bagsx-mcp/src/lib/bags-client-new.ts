import { CONFIG } from '../config';

// ==================== RESPONSE TYPES ====================

interface BagsResponse<T> {
  success: boolean;
  response?: T;
  error?: string;
}

interface QuoteResponse {
  requestId: string;
  contextSlot: number;
  inAmount: string;
  inputMint: string;
  outAmount: string;
  outputMint: string;
  minOutAmount: string;
  otherAmountThreshold: string;
  priceImpactPct: string;
  slippageBps: number;
  routePlan: {
    venue: string;
    inAmount: string;
    outAmount: string;
    inputMint: string;
    outputMint: string;
    inputMintDecimals: number;
    outputMintDecimals: number;
    marketKey: string;
    data: string;
  }[];
  platformFee?: {
    amount: string;
    feeBps: number;
    feeAccount: string;
  };
  simulatedComputeUnits: number;
}

interface SwapResponse {
  swapTransaction: string;
  computeUnitLimit: number;
  lastValidBlockHeight: number;
  prioritizationFeeLamports: number;
}

interface TokenInfoResponse {
  tokenMint: string;
  tokenMetadata: string;
  tokenLaunch: {
    name: string;
    symbol: string;
    description: string;
    image: string;
    tokenMint: string;
    status: string;
    createdAt: string;
    uri: string;
  };
}

interface CreatorInfo {
  username: string;
  pfp: string;
  royaltyBps: number;
  isCreator: boolean;
  wallet: string;
  provider: string;
  providerUsername: string;
  isAdmin: boolean;
}

interface ClaimStat extends CreatorInfo {
  totalClaimed: string;
}

interface ClaimEvent {
  wallet: string;
  isCreator: boolean;
  amount: string;
  signature: string;
  timestamp: string;
}

interface ClaimablePosition {
  baseMint: string;
  isMigrated: boolean;
  totalClaimableLamportsUserShare: number;
  claimableDisplayAmount: number;
  user: string;
  userBps: number;
}

interface PoolInfo {
  tokenMint: string;
  dbcConfigKey: string;
  dbcPoolKey: string;
  dammV2PoolKey: string;
}

interface FeeWalletResponse {
  provider: string;
  platformData: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string;
  };
  wallet: string;
}

interface FeeConfigResponse {
  needsCreation: boolean;
  feeShareAuthority: string;
  meteoraConfigKey: string;
  transactions: {
    blockhash: { blockhash: string; lastValidBlockHeight: number };
    transaction: string;
  }[];
}

interface TransactionBundle {
  blockhash: { blockhash: string; lastValidBlockHeight: number };
  transaction: string;
}

interface PartnerStats {
  claimedFees: string;
  unclaimedFees: string;
}

// ==================== CLIENT CLASS ====================

class BagsClient {
  private apiKey: string;
  private baseUrl: string;

  // Quote cache for swap execution
  private quoteCache: Map<string, QuoteResponse> = new Map();

  constructor() {
    this.apiKey = CONFIG.BAGS_API_KEY;
    this.baseUrl = CONFIG.BAGS_API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<BagsResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey,
      ...(options.headers as Record<string, string>),
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json() as BagsResponse<T> & { error?: string };

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return data as BagsResponse<T>;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // ==================== TRADING ====================

  async getQuote(params: {
    inputMint: string;
    outputMint: string;
    amount: number;
    slippageMode?: 'auto' | 'manual';
    slippageBps?: number;
  }): Promise<BagsResponse<QuoteResponse>> {
    const queryParams = new URLSearchParams({
      inputMint: params.inputMint,
      outputMint: params.outputMint,
      amount: params.amount.toString(),
      slippageMode: params.slippageMode || 'auto',
    });

    if (params.slippageMode === 'manual' && params.slippageBps !== undefined) {
      queryParams.set('slippageBps', params.slippageBps.toString());
    }

    const result = await this.request<QuoteResponse>(
      `/trade/quote?${queryParams.toString()}`,
      { method: 'GET' }
    );

    // Cache quote for swap execution
    if (result.success && result.response) {
      this.quoteCache.set(result.response.requestId, result.response);
    }

    return result;
  }

  async createSwap(params: {
    quoteRequestId: string;
    wallet: string;
  }): Promise<BagsResponse<SwapResponse>> {
    const quote = this.quoteCache.get(params.quoteRequestId);
    if (!quote) {
      return {
        success: false,
        error: 'Quote not found. Please get a new quote first using bags_quote.',
      };
    }

    return this.request<SwapResponse>('/trade/swap', {
      method: 'POST',
      body: JSON.stringify({
        quoteResponse: quote,
        userPublicKey: params.wallet,
      }),
    });
  }

  // ==================== TOKEN LAUNCH ====================

  async createTokenInfo(params: {
    name: string;
    symbol: string;
    description: string;
    imageUrl?: string;
    twitter?: string;
    telegram?: string;
    website?: string;
  }): Promise<BagsResponse<TokenInfoResponse>> {
    const formData = new FormData();
    formData.append('name', params.name);
    formData.append('symbol', params.symbol);
    formData.append('description', params.description);

    if (params.imageUrl) formData.append('imageUrl', params.imageUrl);
    if (params.twitter) formData.append('twitter', params.twitter);
    if (params.telegram) formData.append('telegram', params.telegram);
    if (params.website) formData.append('website', params.website);

    const url = `${this.baseUrl}/token-launch/create-token-info`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKey,
      },
      body: formData,
    });

    return response.json() as Promise<BagsResponse<TokenInfoResponse>>;
  }

  async createLaunchTransaction(params: {
    ipfs: string;
    tokenMint: string;
    wallet: string;
    configKey: string;
    initialBuyLamports?: number;
  }): Promise<BagsResponse<string>> {
    return this.request<string>('/token-launch/create-launch-transaction', {
      method: 'POST',
      body: JSON.stringify({
        ipfs: params.ipfs,
        tokenMint: params.tokenMint,
        wallet: params.wallet,
        configKey: params.configKey,
        initialBuyLamports: params.initialBuyLamports || 0,
      }),
    });
  }

  // ==================== ANALYTICS ====================

  async getCreators(tokenMint: string): Promise<BagsResponse<CreatorInfo[]>> {
    return this.request<CreatorInfo[]>(
      `/token-launch/creator/v3?tokenMint=${tokenMint}`,
      { method: 'GET' }
    );
  }

  async getLifetimeFees(tokenMint: string): Promise<BagsResponse<string>> {
    return this.request<string>(
      `/token-launch/lifetime-fees?tokenMint=${tokenMint}`,
      { method: 'GET' }
    );
  }

  async getClaimStats(tokenMint: string): Promise<BagsResponse<ClaimStat[]>> {
    return this.request<ClaimStat[]>(
      `/token-launch/claim-stats?tokenMint=${tokenMint}`,
      { method: 'GET' }
    );
  }

  async getClaimEvents(params: {
    tokenMint: string;
    mode?: 'offset' | 'time';
    limit?: number;
    offset?: number;
    from?: number;
    to?: number;
  }): Promise<BagsResponse<{ events: ClaimEvent[] }>> {
    const queryParams = new URLSearchParams({
      tokenMint: params.tokenMint,
      mode: params.mode || 'offset',
    });

    if (params.mode === 'offset' || !params.mode) {
      queryParams.set('limit', (params.limit || 100).toString());
      queryParams.set('offset', (params.offset || 0).toString());
    } else {
      if (params.from !== undefined) queryParams.set('from', params.from.toString());
      if (params.to !== undefined) queryParams.set('to', params.to.toString());
    }

    return this.request<{ events: ClaimEvent[] }>(
      `/fee-share/token/claim-events?${queryParams.toString()}`,
      { method: 'GET' }
    );
  }

  // ==================== FEE CLAIMING ====================

  async getClaimablePositions(wallet: string): Promise<BagsResponse<ClaimablePosition[]>> {
    return this.request<ClaimablePosition[]>(
      `/token-launch/claimable-positions?wallet=${wallet}`,
      { method: 'GET' }
    );
  }

  async createClaimTransactions(params: {
    tokenMint: string;
    wallet: string;
  }): Promise<BagsResponse<TransactionBundle[]>> {
    return this.request<TransactionBundle[]>('/token-launch/claim-txs/v3', {
      method: 'POST',
      body: JSON.stringify({
        tokenMint: params.tokenMint,
        feeClaimer: params.wallet,
      }),
    });
  }

  // ==================== FEE SHARE CONFIG ====================

  async getFeeShareWallet(params: {
    provider: string;
    username: string;
  }): Promise<BagsResponse<FeeWalletResponse>> {
    const queryParams = new URLSearchParams({
      provider: params.provider,
      username: params.username,
    });

    return this.request<FeeWalletResponse>(
      `/token-launch/fee-share/wallet/v2?${queryParams.toString()}`,
      { method: 'GET' }
    );
  }

  async createFeeConfig(params: {
    payer: string;
    baseMint: string;
    claimers: string[];
    basisPoints: number[];
  }): Promise<BagsResponse<FeeConfigResponse>> {
    return this.request<FeeConfigResponse>('/fee-share/config', {
      method: 'POST',
      body: JSON.stringify({
        payer: params.payer,
        baseMint: params.baseMint,
        claimersArray: params.claimers,
        basisPointsArray: params.basisPoints,
      }),
    });
  }

  async getAdminList(wallet: string): Promise<BagsResponse<{ tokenMints: string[] }>> {
    return this.request<{ tokenMints: string[] }>(
      `/fee-share/admin/list?wallet=${wallet}`,
      { method: 'GET' }
    );
  }

  async updateFeeConfig(params: {
    baseMint: string;
    payer: string;
    claimers: string[];
    basisPoints: number[];
  }): Promise<BagsResponse<{ transactions: TransactionBundle[] }>> {
    return this.request<{ transactions: TransactionBundle[] }>('/fee-share/admin/update-config', {
      method: 'POST',
      body: JSON.stringify({
        baseMint: params.baseMint,
        payer: params.payer,
        claimersArray: params.claimers,
        basisPointsArray: params.basisPoints,
      }),
    });
  }

  async transferAdmin(params: {
    baseMint: string;
    currentAdmin: string;
    newAdmin: string;
    payer: string;
  }): Promise<BagsResponse<TransactionBundle>> {
    return this.request<TransactionBundle>('/fee-share/admin/transfer-tx', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // ==================== STATE/POOLS ====================

  async getPools(onlyMigrated?: boolean): Promise<BagsResponse<PoolInfo[]>> {
    const query = onlyMigrated ? '?onlyMigrated=true' : '';
    return this.request<PoolInfo[]>(`/solana/bags/pools${query}`, { method: 'GET' });
  }

  async getPoolByMint(tokenMint: string): Promise<BagsResponse<PoolInfo>> {
    return this.request<PoolInfo>(
      `/solana/bags/pools/token-mint?tokenMint=${tokenMint}`,
      { method: 'GET' }
    );
  }

  // ==================== PARTNER ====================

  async getPartnerStats(partner: string): Promise<BagsResponse<PartnerStats>> {
    return this.request<PartnerStats>(
      `/fee-share/partner-config/stats?partner=${partner}`,
      { method: 'GET' }
    );
  }

  async createPartnerClaimTransactions(
    partnerWallet: string
  ): Promise<BagsResponse<{ transactions: TransactionBundle[] }>> {
    return this.request<{ transactions: TransactionBundle[] }>('/fee-share/partner-config/claim-tx', {
      method: 'POST',
      body: JSON.stringify({ partnerWallet }),
    });
  }
}

// Export singleton instance
export const bagsClient = new BagsClient();
