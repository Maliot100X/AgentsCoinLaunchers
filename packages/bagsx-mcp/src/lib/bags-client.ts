import { CONFIG } from '../config';

interface BagsResponse<T> {
  success: boolean;
  response?: T;
  error?: string;
}

interface TokenInfo {
  mint: string;
  name: string;
  symbol: string;
  description?: string;
  image?: string;
  marketCap?: number;
  volume24h?: number;
  priceUsd?: number;
  holders?: number;
  createdAt?: string;
}

interface TrendingToken extends TokenInfo {
  change24h?: number;
  rank?: number;
}

interface Portfolio {
  tokens: {
    mint: string;
    symbol: string;
    balance: number;
    valueUsd: number;
    change24h: number;
  }[];
  totalValueUsd: number;
  totalChange24h: number;
}

interface TradeResult {
  success: boolean;
  txHash?: string;
  amountIn?: number;
  amountOut?: number;
  priceImpact?: number;
  error?: string;
}

interface UnsignedTransaction {
  transaction: string; // Base64 encoded unsigned transaction
  amountIn: number;
  amountOut: number;
  priceImpact: number;
  fee: number;
  expiresAt: string; // ISO timestamp - transaction valid for ~2 minutes
}

class BagsClient {
  private apiKey: string;
  private baseUrl: string;

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
      ...(this.apiKey && { 'x-api-key': this.apiKey }),
      ...(options.headers as Record<string, string>),
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json() as { response?: T; error?: string };

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return {
        success: true,
        response: (data.response || data) as T,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // ==================== READ OPERATIONS ====================

  /**
   * Get trending tokens on Bags.fm
   */
  async getTrending(
    metric: 'volume' | 'marketCap' | 'gainers' | 'losers' = 'volume',
    limit: number = 10
  ): Promise<BagsResponse<TrendingToken[]>> {
    return this.request<TrendingToken[]>(`/tokens/trending?metric=${metric}&limit=${limit}`);
  }

  /**
   * Search for tokens by name or symbol
   */
  async searchTokens(query: string, limit: number = 10): Promise<BagsResponse<TokenInfo[]>> {
    return this.request<TokenInfo[]>(`/tokens/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  }

  /**
   * Get detailed info for a specific token
   */
  async getTokenInfo(mintOrSymbol: string): Promise<BagsResponse<TokenInfo>> {
    return this.request<TokenInfo>(`/tokens/${encodeURIComponent(mintOrSymbol)}`);
  }

  /**
   * Get portfolio for a wallet address
   */
  async getPortfolio(walletAddress: string): Promise<BagsResponse<Portfolio>> {
    return this.request<Portfolio>(`/wallets/${walletAddress}/portfolio`);
  }

  /**
   * Get recent trades for a token
   */
  async getRecentTrades(
    mint: string,
    limit: number = 20
  ): Promise<BagsResponse<any[]>> {
    return this.request<any[]>(`/tokens/${mint}/trades?limit=${limit}`);
  }

  /**
   * Get whale activity (large trades)
   */
  async getWhaleActivity(
    mint?: string,
    minUsd: number = 10000
  ): Promise<BagsResponse<any[]>> {
    const endpoint = mint
      ? `/tokens/${mint}/whales?minUsd=${minUsd}`
      : `/whales?minUsd=${minUsd}`;
    return this.request<any[]>(endpoint);
  }

  /**
   * Get creator earnings for a token
   */
  async getCreatorEarnings(mint: string): Promise<BagsResponse<{
    totalEarnings: number;
    totalVolume: number;
    tradeCount: number;
  }>> {
    return this.request(`/tokens/${mint}/earnings`);
  }

  // ==================== WRITE OPERATIONS ====================

  /**
   * Get a quote for a trade (doesn't execute)
   */
  async getQuote(
    inputMint: string,
    outputMint: string,
    amount: number,
    slippage: number = CONFIG.DEFAULT_SLIPPAGE
  ): Promise<BagsResponse<{
    inputAmount: number;
    outputAmount: number;
    priceImpact: number;
    fee: number;
  }>> {
    return this.request('/trading/quote', {
      method: 'POST',
      body: JSON.stringify({
        inputMint,
        outputMint,
        amount,
        slippage,
      }),
    });
  }

  /**
   * Generate unsigned buy transaction (user signs in their wallet)
   * Returns base64 transaction to sign - NO PRIVATE KEY NEEDED
   */
  async buy(
    tokenMint: string,
    amountUsd: number,
    slippage: number = CONFIG.DEFAULT_SLIPPAGE,
    walletAddress?: string
  ): Promise<BagsResponse<UnsignedTransaction>> {
    // Generate unsigned transaction - user will sign it themselves
    return this.request<UnsignedTransaction>('/trading/prepare-buy', {
      method: 'POST',
      body: JSON.stringify({
        mint: tokenMint,
        amountUsd,
        slippage,
        walletAddress, // Optional: for simulation
      }),
    });
  }

  /**
   * Generate unsigned sell transaction (user signs in their wallet)
   * Returns base64 transaction to sign - NO PRIVATE KEY NEEDED
   */
  async sell(
    tokenMint: string,
    amountTokens: number,
    slippage: number = CONFIG.DEFAULT_SLIPPAGE,
    walletAddress?: string
  ): Promise<BagsResponse<UnsignedTransaction>> {
    // Generate unsigned transaction - user will sign it themselves
    return this.request<UnsignedTransaction>('/trading/prepare-sell', {
      method: 'POST',
      body: JSON.stringify({
        mint: tokenMint,
        amountTokens,
        slippage,
        walletAddress, // Optional: for simulation
      }),
    });
  }

  // ==================== LAUNCH OPERATIONS ====================

  /**
   * Create token metadata (first step of launch)
   */
  async createTokenMetadata(params: {
    name: string;
    symbol: string;
    description: string;
    image?: string;
    twitter?: string;
    telegram?: string;
    website?: string;
  }): Promise<BagsResponse<{ metadataUri: string }>> {
    return this.request('/tokens/metadata', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Launch a new token on Bags.fm
   */
  async launchToken(params: {
    metadataUri: string;
    initialBuyAmountSol?: number;
    feeSharing?: {
      wallets: string[];
      percentages: number[];
    };
  }): Promise<BagsResponse<{
    transaction: string; // Unsigned transaction for token launch
    mint: string;
    bagsUrl: string;
  }>> {
    // Returns unsigned transaction - user signs themselves
    return this.request('/tokens/prepare-launch', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // ==================== NEW: MARKET INTELLIGENCE ====================

  /**
   * Get historical price data for a token
   */
  async getPriceHistory(
    token: string,
    period: '1h' | '24h' | '7d' | '30d' = '24h'
  ): Promise<BagsResponse<{
    token: string;
    period: string;
    prices: Array<{ timestamp: number; price: number; volume: number }>;
    priceChange: number;
    high: number;
    low: number;
  }>> {
    return this.request(`/tokens/${encodeURIComponent(token)}/price-history?period=${period}`);
  }

  /**
   * Get newly launched tokens
   */
  async getNewLaunches(
    hours: number = 24,
    limit: number = 20
  ): Promise<BagsResponse<Array<{
    mint: string;
    name: string;
    symbol: string;
    creator: string;
    launchedAt: string;
    initialMarketCap: number;
    currentMarketCap: number;
    priceChange: number;
    volume24h: number;
    holders: number;
  }>>> {
    return this.request(`/tokens/new?hours=${hours}&limit=${limit}`);
  }

  /**
   * Get top gainers and losers
   */
  async getGainersLosers(
    type: 'gainers' | 'losers' | 'both' = 'both',
    period: '1h' | '24h' | '7d' = '24h',
    limit: number = 10
  ): Promise<BagsResponse<{
    gainers?: Array<{ mint: string; symbol: string; name: string; priceChange: number; volume: number }>;
    losers?: Array<{ mint: string; symbol: string; name: string; priceChange: number; volume: number }>;
  }>> {
    return this.request(`/tokens/movers?type=${type}&period=${period}&limit=${limit}`);
  }

  /**
   * Analyze holder distribution for a token
   */
  async getHolderAnalysis(token: string): Promise<BagsResponse<{
    totalHolders: number;
    top10Concentration: number;
    top50Concentration: number;
    whaleCount: number;
    retailCount: number;
    distribution: Array<{
      range: string;
      count: number;
      percentage: number;
    }>;
    topHolders: Array<{
      wallet: string;
      balance: number;
      percentage: number;
    }>;
  }>> {
    return this.request(`/tokens/${encodeURIComponent(token)}/holders`);
  }

  // ==================== NEW: TRADING ENHANCEMENTS ====================

  /**
   * Prepare token-to-token swap (unsigned transaction)
   */
  async prepareSwap(
    fromToken: string,
    toToken: string,
    amount: number,
    slippage: number = 1,
    wallet?: string
  ): Promise<BagsResponse<UnsignedTransaction & {
    inputAmount: number;
    outputAmount: number;
    priceImpact: number;
  }>> {
    return this.request<UnsignedTransaction & {
      inputAmount: number;
      outputAmount: number;
      priceImpact: number;
    }>('/trading/prepare-swap', {
      method: 'POST',
      body: JSON.stringify({
        fromMint: fromToken,
        toMint: toToken,
        amount,
        slippage,
        walletAddress: wallet,
      }),
    });
  }

  /**
   * Set a limit order
   */
  async setLimitOrder(params: {
    token: string;
    side: 'buy' | 'sell';
    price: number;
    amount: number;
    expiry: string;
    wallet?: string;
  }): Promise<BagsResponse<{
    orderId: string;
    token: string;
    side: string;
    targetPrice: number;
    amount: number;
    expiresAt: string;
    status: 'active' | 'pending';
  }>> {
    return this.request('/orders/limit', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Estimate gas/fees for a transaction
   */
  async estimateGas(
    action: 'buy' | 'sell' | 'swap' | 'launch',
    token?: string,
    amount?: number
  ): Promise<BagsResponse<{
    estimatedFee: number;
    feeInSol: number;
    feeInUsd: number;
    networkCongestion: 'low' | 'medium' | 'high';
    priorityFee: number;
  }>> {
    return this.request('/trading/estimate-gas', {
      method: 'POST',
      body: JSON.stringify({ action, token, amount }),
    });
  }

  /**
   * Calculate slippage for a trade
   */
  async checkSlippage(
    token: string,
    side: 'buy' | 'sell',
    amountUsd: number
  ): Promise<BagsResponse<{
    expectedSlippage: number;
    priceImpact: number;
    recommendedSlippage: number;
    liquidity: number;
    warning: string | null;
  }>> {
    return this.request('/trading/slippage-check', {
      method: 'POST',
      body: JSON.stringify({ token, side, amountUsd }),
    });
  }

  // ==================== NEW: PORTFOLIO & ALERTS ====================

  /**
   * Manage watchlist
   */
  async manageWatchlist(
    action: 'add' | 'remove' | 'list',
    token?: string,
    wallet?: string
  ): Promise<BagsResponse<{
    action: string;
    watchlist?: Array<{
      mint: string;
      symbol: string;
      name: string;
      addedAt: string;
      priceAtAdd: number;
      currentPrice: number;
      change: number;
    }>;
    success?: boolean;
  }>> {
    return this.request('/user/watchlist', {
      method: 'POST',
      body: JSON.stringify({ action, token, wallet }),
    });
  }

  /**
   * Manage price alerts
   */
  async managePriceAlert(params: {
    action: 'set' | 'remove' | 'list';
    token?: string;
    targetPrice?: number;
    direction?: 'above' | 'below';
    wallet?: string;
  }): Promise<BagsResponse<{
    action: string;
    alerts?: Array<{
      id: string;
      token: string;
      targetPrice: number;
      direction: string;
      currentPrice: number;
      createdAt: string;
    }>;
    success?: boolean;
  }>> {
    return this.request('/user/alerts', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Generate P&L report for a wallet
   */
  async getPnlReport(
    wallet: string,
    period: '24h' | '7d' | '30d' | 'all' = '30d'
  ): Promise<BagsResponse<{
    wallet: string;
    period: string;
    summary: {
      totalInvested: number;
      currentValue: number;
      realizedPnl: number;
      unrealizedPnl: number;
      totalPnl: number;
      percentageReturn: number;
    };
    byToken: Array<{
      token: string;
      symbol: string;
      invested: number;
      currentValue: number;
      pnl: number;
      percentageReturn: number;
    }>;
    trades: number;
    winRate: number;
  }>> {
    return this.request(`/portfolio/${wallet}/pnl?period=${period}`);
  }

  /**
   * Compare multiple tokens side-by-side
   */
  async compareTokens(tokens: string[]): Promise<BagsResponse<Array<{
    mint: string;
    symbol: string;
    name: string;
    price: number;
    marketCap: number;
    volume24h: number;
    priceChange24h: number;
    priceChange7d: number;
    holders: number;
    liquidity: number;
    creatorEarnings: number;
  }>>> {
    return this.request('/tokens/compare', {
      method: 'POST',
      body: JSON.stringify({ tokens }),
    });
  }

  // ==================== NEW: CREATOR TOOLS ====================

  /**
   * Get top creators leaderboard
   */
  async getTopCreators(
    metric: 'earnings' | 'volume' | 'holders' = 'earnings',
    limit: number = 20
  ): Promise<BagsResponse<Array<{
    wallet: string;
    displayName: string;
    avatar: string;
    tokenCount: number;
    totalEarnings: number;
    totalVolume: number;
    totalHolders: number;
    topToken: {
      symbol: string;
      mint: string;
    };
  }>>> {
    return this.request(`/creators/top?metric=${metric}&limit=${limit}`);
  }

  /**
   * Prepare token launch (full flow)
   */
  async prepareTokenLaunch(params: {
    name: string;
    symbol: string;
    description: string;
    image?: string;
    twitter?: string;
    telegram?: string;
    website?: string;
    initialBuySol?: number;
    wallet?: string;
  }): Promise<BagsResponse<UnsignedTransaction & {
    metadataUri: string;
    estimatedMint: string;
    launchFee: number;
  }>> {
    return this.request<UnsignedTransaction & {
      metadataUri: string;
      estimatedMint: string;
      launchFee: number;
    }>('/tokens/prepare-full-launch', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  /**
   * Prepare airdrop transaction
   */
  async prepareAirdrop(
    token: string,
    recipients: Array<{ wallet: string; amount: number }>,
    senderWallet?: string
  ): Promise<BagsResponse<UnsignedTransaction & {
    totalAmount: number;
    recipientCount: number;
    estimatedFee: number;
  }>> {
    return this.request<UnsignedTransaction & {
      totalAmount: number;
      recipientCount: number;
      estimatedFee: number;
    }>('/tokens/prepare-airdrop', {
      method: 'POST',
      body: JSON.stringify({
        mint: token,
        recipients,
        senderWallet,
      }),
    });
  }

  // ==================== MULTI-WALLET MANAGEMENT ====================

  // In-memory wallet store (persists during session)
  private wallets: Map<string, { address: string; alias?: string }> = new Map();
  private defaultWallet: string | null = null;

  /**
   * Add a wallet to the session
   */
  async addWallet(
    wallet: string,
    alias?: string
  ): Promise<BagsResponse<{
    wallet: string;
    alias: string | null;
    balance: number;
    tokenCount: number;
  }>> {
    // Validate wallet exists and get balance
    const portfolioResult = await this.getPortfolio(wallet);

    if (!portfolioResult.success) {
      return { success: false, error: 'Invalid wallet address or unable to fetch balance' };
    }

    const key = alias || wallet;
    this.wallets.set(key, { address: wallet, alias });

    // Set as default if first wallet
    if (this.wallets.size === 1) {
      this.defaultWallet = key;
    }

    const portfolio = portfolioResult.response as Portfolio;
    return {
      success: true,
      response: {
        wallet,
        alias: alias || null,
        balance: portfolio.totalValueUsd,
        tokenCount: portfolio.tokens.length,
      },
    };
  }

  /**
   * Remove a wallet from the session
   */
  removeWallet(walletOrAlias: string): BagsResponse<{ removed: boolean; wallet: string }> {
    const entry = this.wallets.get(walletOrAlias);
    if (!entry) {
      // Try finding by address
      for (const [key, val] of this.wallets.entries()) {
        if (val.address === walletOrAlias) {
          this.wallets.delete(key);
          if (this.defaultWallet === key) {
            this.defaultWallet = this.wallets.keys().next().value || null;
          }
          return { success: true, response: { removed: true, wallet: val.address } };
        }
      }
      return { success: false, error: 'Wallet not found in session' };
    }

    this.wallets.delete(walletOrAlias);
    if (this.defaultWallet === walletOrAlias) {
      this.defaultWallet = this.wallets.keys().next().value || null;
    }
    return { success: true, response: { removed: true, wallet: entry.address } };
  }

  /**
   * List all wallets in session
   */
  async listWallets(): Promise<BagsResponse<Array<{
    wallet: string;
    alias: string | null;
    isDefault: boolean;
    balance: number;
    tokenCount: number;
  }>>> {
    const results = [];

    for (const [key, val] of this.wallets.entries()) {
      const portfolio = await this.getPortfolio(val.address);
      const p = portfolio.response as Portfolio | undefined;
      results.push({
        wallet: val.address,
        alias: val.alias || null,
        isDefault: this.defaultWallet === key,
        balance: p?.totalValueUsd || 0,
        tokenCount: p?.tokens.length || 0,
      });
    }

    return { success: true, response: results };
  }

  /**
   * Set default wallet for trades
   */
  setDefaultWallet(walletOrAlias: string): BagsResponse<{ defaultWallet: string }> {
    const entry = this.wallets.get(walletOrAlias);
    if (!entry) {
      // Try finding by address
      for (const [key, val] of this.wallets.entries()) {
        if (val.address === walletOrAlias) {
          this.defaultWallet = key;
          return { success: true, response: { defaultWallet: val.address } };
        }
      }
      return { success: false, error: 'Wallet not found in session' };
    }

    this.defaultWallet = walletOrAlias;
    return { success: true, response: { defaultWallet: entry.address } };
  }

  /**
   * Get combined portfolio across all wallets
   */
  async getPortfolioAll(groupBy: 'token' | 'wallet' = 'token'): Promise<BagsResponse<{
    totalValue: number;
    walletCount: number;
    byWallet?: Array<{ wallet: string; alias: string | null; value: number; holdings: unknown[] }>;
    byToken?: Array<{ token: string; symbol: string; totalBalance: number; totalValue: number; wallets: string[] }>;
  }>> {
    if (this.wallets.size === 0) {
      return { success: false, error: 'No wallets in session. Use bags_wallet_add first.' };
    }

    let totalValue = 0;
    const byWallet: Array<{ wallet: string; alias: string | null; value: number; holdings: unknown[] }> = [];
    const tokenMap = new Map<string, { symbol: string; balance: number; value: number; wallets: string[] }>();

    for (const [key, val] of this.wallets.entries()) {
      const portfolio = await this.getPortfolio(val.address);
      const p = portfolio.response as Portfolio | undefined;
      if (p) {
        totalValue += p.totalValueUsd;
        byWallet.push({
          wallet: val.address,
          alias: val.alias || null,
          value: p.totalValueUsd,
          holdings: p.tokens,
        });

        for (const h of p.tokens) {
          const existing = tokenMap.get(h.mint);
          if (existing) {
            existing.balance += h.balance;
            existing.value += h.valueUsd;
            existing.wallets.push(val.alias || val.address.slice(0, 8));
          } else {
            tokenMap.set(h.mint, {
              symbol: h.symbol,
              balance: h.balance,
              value: h.valueUsd,
              wallets: [val.alias || val.address.slice(0, 8)],
            });
          }
        }
      }
    }

    const byToken = Array.from(tokenMap.entries()).map(([mint, data]) => ({
      token: mint,
      symbol: data.symbol,
      totalBalance: data.balance,
      totalValue: data.value,
      wallets: data.wallets,
    }));

    return {
      success: true,
      response: {
        totalValue,
        walletCount: this.wallets.size,
        ...(groupBy === 'wallet' ? { byWallet } : { byToken }),
      },
    };
  }

  /**
   * Resolve wallet from alias or address
   */
  resolveWallet(walletOrAlias?: string): string | null {
    if (!walletOrAlias) {
      if (this.defaultWallet) {
        const entry = this.wallets.get(this.defaultWallet);
        return entry?.address || null;
      }
      return null;
    }

    const entry = this.wallets.get(walletOrAlias);
    if (entry) return entry.address;

    // Check if it's a direct address
    if (walletOrAlias.length >= 32) return walletOrAlias;

    return null;
  }

  // ==================== NOTIFICATION MANAGEMENT ====================

  /**
   * Setup/manage Telegram notifications
   */
  async manageTelegram(
    action: 'setup' | 'test' | 'remove' | 'status',
    chatId?: string
  ): Promise<BagsResponse<{
    status: string;
    chatId?: string;
    configured: boolean;
    message: string;
  }>> {
    return this.request('/notifications/telegram', {
      method: 'POST',
      body: JSON.stringify({ action, chatId }),
    });
  }

  /**
   * Setup/manage Discord notifications
   */
  async manageDiscord(
    action: 'setup' | 'test' | 'remove' | 'status',
    webhookUrl?: string
  ): Promise<BagsResponse<{
    status: string;
    configured: boolean;
    webhookConfigured: boolean;
    message: string;
  }>> {
    return this.request('/notifications/discord', {
      method: 'POST',
      body: JSON.stringify({ action, webhookUrl }),
    });
  }

  /**
   * Get or update notification settings
   */
  async manageNotificationSettings(params: {
    action: 'get' | 'update';
    priceAlerts?: boolean;
    whaleAlerts?: boolean;
    tradeConfirmations?: boolean;
    newLaunches?: boolean;
    portfolioDaily?: boolean;
  }): Promise<BagsResponse<{
    action: string;
    settings: {
      priceAlerts: boolean;
      whaleAlerts: boolean;
      tradeConfirmations: boolean;
      newLaunches: boolean;
      portfolioDaily: boolean;
    };
  }>> {
    return this.request('/notifications/settings', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }
}

export const bagsClient = new BagsClient();
export type { TokenInfo, TrendingToken, Portfolio, TradeResult, BagsResponse };
