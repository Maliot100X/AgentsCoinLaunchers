import { z } from 'zod';

// Tool definitions following MCP spec
export const TOOL_DEFINITIONS = {
  // ==================== READ TOOLS ====================

  bags_trending: {
    name: 'bags_trending',
    description: 'Get trending tokens on Bags.fm by volume, market cap, gainers, or losers. Use this to discover hot projects.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        metric: {
          type: 'string',
          enum: ['volume', 'marketCap', 'gainers', 'losers'],
          description: 'How to rank trending tokens',
          default: 'volume',
        },
        limit: {
          type: 'number',
          description: 'Number of results (1-50)',
          default: 10,
        },
      },
      required: [],
    },
  },

  bags_search: {
    name: 'bags_search',
    description: 'Search for tokens on Bags.fm by name or symbol. Use this to find specific projects.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        query: {
          type: 'string',
          description: 'Search query (token name or symbol)',
        },
        limit: {
          type: 'number',
          description: 'Number of results (1-20)',
          default: 10,
        },
      },
      required: ['query'],
    },
  },

  bags_token_info: {
    name: 'bags_token_info',
    description: 'Get detailed information about a specific token including price, market cap, volume, and holders.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        token: {
          type: 'string',
          description: 'Token symbol (e.g., "NYAN") or mint address',
        },
      },
      required: ['token'],
    },
  },

  bags_portfolio: {
    name: 'bags_portfolio',
    description: 'Get portfolio holdings and performance for a Solana wallet address.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        wallet: {
          type: 'string',
          description: 'Solana wallet address (Base58 encoded)',
        },
      },
      required: ['wallet'],
    },
  },

  bags_trades: {
    name: 'bags_trades',
    description: 'Get recent trades for a token. Shows buy/sell activity.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        token: {
          type: 'string',
          description: 'Token symbol or mint address',
        },
        limit: {
          type: 'number',
          description: 'Number of trades to fetch (1-100)',
          default: 20,
        },
      },
      required: ['token'],
    },
  },

  bags_whales: {
    name: 'bags_whales',
    description: 'Track whale activity (large trades) across Bags.fm or for a specific token.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        token: {
          type: 'string',
          description: 'Optional: Token symbol or mint to filter whales',
        },
        minUsd: {
          type: 'number',
          description: 'Minimum trade size in USD',
          default: 10000,
        },
      },
      required: [],
    },
  },

  // ==================== TRADE TOOLS ====================

  bags_quote: {
    name: 'bags_quote',
    description: 'Get a price quote for a trade without executing. Shows expected output and price impact.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        from: {
          type: 'string',
          description: 'Input token (SOL or token symbol/mint)',
        },
        to: {
          type: 'string',
          description: 'Output token (symbol or mint)',
        },
        amount: {
          type: 'number',
          description: 'Amount to swap (in input token units)',
        },
        slippage: {
          type: 'number',
          description: 'Max slippage tolerance as percentage',
          default: 1,
        },
      },
      required: ['from', 'to', 'amount'],
    },
  },

  bags_buy: {
    name: 'bags_buy',
    description: 'Prepare a buy order on Bags.fm. Returns an unsigned transaction for the user to sign in their wallet. NO PRIVATE KEY NEEDED - zero custody risk.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        token: {
          type: 'string',
          description: 'Token symbol or mint address to buy',
        },
        amountUsd: {
          type: 'number',
          description: 'Amount in USD to spend',
        },
        slippage: {
          type: 'number',
          description: 'Max slippage tolerance as percentage',
          default: 1,
        },
        wallet: {
          type: 'string',
          description: 'Optional: Wallet address for transaction simulation',
        },
      },
      required: ['token', 'amountUsd'],
    },
  },

  bags_sell: {
    name: 'bags_sell',
    description: 'Prepare a sell order on Bags.fm. Returns an unsigned transaction for the user to sign in their wallet. NO PRIVATE KEY NEEDED - zero custody risk.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        token: {
          type: 'string',
          description: 'Token symbol or mint address to sell',
        },
        amount: {
          type: 'number',
          description: 'Amount of tokens to sell (or use "all" via percentage)',
        },
        percentage: {
          type: 'number',
          description: 'Alternative: percentage of holdings to sell (1-100)',
        },
        slippage: {
          type: 'number',
          description: 'Max slippage tolerance as percentage',
          default: 1,
        },
        wallet: {
          type: 'string',
          description: 'Optional: Wallet address for transaction simulation',
        },
      },
      required: ['token'],
    },
  },

  // ==================== ANALYTICS TOOLS ====================

  bags_creator_earnings: {
    name: 'bags_creator_earnings',
    description: 'Get creator earnings and royalty stats for a token.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        token: {
          type: 'string',
          description: 'Token symbol or mint address',
        },
      },
      required: ['token'],
    },
  },

  // ==================== NEW MARKET INTELLIGENCE TOOLS ====================

  bags_price_history: {
    name: 'bags_price_history',
    description: 'Get historical price data for a token. Useful for analyzing trends and performance over time.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        token: {
          type: 'string',
          description: 'Token symbol or mint address',
        },
        period: {
          type: 'string',
          enum: ['1h', '24h', '7d', '30d'],
          description: 'Time period for price history',
          default: '24h',
        },
      },
      required: ['token'],
    },
  },

  bags_new_launches: {
    name: 'bags_new_launches',
    description: 'Get newly launched tokens on Bags.fm. Great for finding early opportunities.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        hours: {
          type: 'number',
          description: 'How far back to look (in hours, max 72)',
          default: 24,
        },
        limit: {
          type: 'number',
          description: 'Number of results (1-50)',
          default: 20,
        },
      },
      required: [],
    },
  },

  bags_gainers_losers: {
    name: 'bags_gainers_losers',
    description: 'Get top gainers and losers in real-time. Shows tokens with biggest price movements.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        type: {
          type: 'string',
          enum: ['gainers', 'losers', 'both'],
          description: 'Which list to fetch',
          default: 'both',
        },
        period: {
          type: 'string',
          enum: ['1h', '24h', '7d'],
          description: 'Time period for price change calculation',
          default: '24h',
        },
        limit: {
          type: 'number',
          description: 'Number of results per category (1-25)',
          default: 10,
        },
      },
      required: [],
    },
  },

  bags_holder_analysis: {
    name: 'bags_holder_analysis',
    description: 'Analyze holder distribution for a token. Shows whale vs retail breakdown and concentration.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        token: {
          type: 'string',
          description: 'Token symbol or mint address',
        },
      },
      required: ['token'],
    },
  },

  // ==================== TRADING ENHANCEMENT TOOLS ====================

  bags_swap: {
    name: 'bags_swap',
    description: 'Prepare a token-to-token swap (not just SOL). Returns unsigned transaction for user to sign.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        fromToken: {
          type: 'string',
          description: 'Input token symbol or mint',
        },
        toToken: {
          type: 'string',
          description: 'Output token symbol or mint',
        },
        amount: {
          type: 'number',
          description: 'Amount of input token to swap',
        },
        slippage: {
          type: 'number',
          description: 'Max slippage tolerance as percentage',
          default: 1,
        },
        wallet: {
          type: 'string',
          description: 'Wallet address for transaction',
        },
      },
      required: ['fromToken', 'toToken', 'amount'],
    },
  },

  bags_limit_order: {
    name: 'bags_limit_order',
    description: 'Set a limit buy or sell order. Order executes when price target is reached.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        token: {
          type: 'string',
          description: 'Token symbol or mint address',
        },
        side: {
          type: 'string',
          enum: ['buy', 'sell'],
          description: 'Order side',
        },
        price: {
          type: 'number',
          description: 'Target price in USD',
        },
        amount: {
          type: 'number',
          description: 'Amount in tokens (for sell) or USD (for buy)',
        },
        expiry: {
          type: 'string',
          enum: ['1h', '24h', '7d', '30d'],
          description: 'Order expiration time',
          default: '24h',
        },
        wallet: {
          type: 'string',
          description: 'Wallet address',
        },
      },
      required: ['token', 'side', 'price', 'amount'],
    },
  },

  bags_gas_estimate: {
    name: 'bags_gas_estimate',
    description: 'Preview transaction fees before trading. Shows estimated SOL cost for any trade.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        action: {
          type: 'string',
          enum: ['buy', 'sell', 'swap', 'launch'],
          description: 'Type of transaction',
        },
        token: {
          type: 'string',
          description: 'Token involved (optional for launch)',
        },
        amount: {
          type: 'number',
          description: 'Trade amount (in USD for buy, tokens for sell)',
        },
      },
      required: ['action'],
    },
  },

  bags_slippage_check: {
    name: 'bags_slippage_check',
    description: 'Calculate expected slippage for large orders. Helps avoid excessive price impact.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        token: {
          type: 'string',
          description: 'Token symbol or mint address',
        },
        side: {
          type: 'string',
          enum: ['buy', 'sell'],
          description: 'Trade direction',
        },
        amountUsd: {
          type: 'number',
          description: 'Trade size in USD',
        },
      },
      required: ['token', 'side', 'amountUsd'],
    },
  },

  // ==================== PORTFOLIO & ALERTS TOOLS ====================

  bags_watchlist: {
    name: 'bags_watchlist',
    description: 'Manage a watchlist of tokens to track. Add, remove, or view watched tokens.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        action: {
          type: 'string',
          enum: ['add', 'remove', 'list'],
          description: 'Watchlist action',
        },
        token: {
          type: 'string',
          description: 'Token to add/remove (not needed for list)',
        },
        wallet: {
          type: 'string',
          description: 'Wallet address (for persistent storage)',
        },
      },
      required: ['action'],
    },
  },

  bags_price_alert: {
    name: 'bags_price_alert',
    description: 'Set price alerts for tokens. Get notified when price targets are hit.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        action: {
          type: 'string',
          enum: ['set', 'remove', 'list'],
          description: 'Alert action',
        },
        token: {
          type: 'string',
          description: 'Token symbol or mint',
        },
        targetPrice: {
          type: 'number',
          description: 'Price target in USD',
        },
        direction: {
          type: 'string',
          enum: ['above', 'below'],
          description: 'Alert when price goes above or below target',
        },
        wallet: {
          type: 'string',
          description: 'Wallet address for alert association',
        },
      },
      required: ['action'],
    },
  },

  bags_pnl_report: {
    name: 'bags_pnl_report',
    description: 'Generate a profit/loss report for a wallet. Shows realized and unrealized gains.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        wallet: {
          type: 'string',
          description: 'Solana wallet address',
        },
        period: {
          type: 'string',
          enum: ['24h', '7d', '30d', 'all'],
          description: 'Report period',
          default: '30d',
        },
      },
      required: ['wallet'],
    },
  },

  bags_compare: {
    name: 'bags_compare',
    description: 'Side-by-side comparison of 2 or more tokens. Shows key metrics for decision making.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        tokens: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of token symbols or mints to compare (2-5)',
        },
      },
      required: ['tokens'],
    },
  },

  // ==================== CREATOR TOOLS ====================

  bags_top_creators: {
    name: 'bags_top_creators',
    description: 'Get leaderboard of top-earning creators on Bags.fm.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        metric: {
          type: 'string',
          enum: ['earnings', 'volume', 'holders'],
          description: 'Ranking metric',
          default: 'earnings',
        },
        limit: {
          type: 'number',
          description: 'Number of results (1-50)',
          default: 20,
        },
      },
      required: [],
    },
  },

  bags_launch_token: {
    name: 'bags_launch_token',
    description: 'Prepare a new token launch on Bags.fm. Returns unsigned transaction for user to sign.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        name: {
          type: 'string',
          description: 'Token name',
        },
        symbol: {
          type: 'string',
          description: 'Token symbol (1-10 chars)',
        },
        description: {
          type: 'string',
          description: 'Token description',
        },
        image: {
          type: 'string',
          description: 'Image URL for token',
        },
        twitter: {
          type: 'string',
          description: 'Twitter handle (optional)',
        },
        telegram: {
          type: 'string',
          description: 'Telegram link (optional)',
        },
        website: {
          type: 'string',
          description: 'Website URL (optional)',
        },
        initialBuySol: {
          type: 'number',
          description: 'Initial SOL to buy at launch (optional)',
        },
        wallet: {
          type: 'string',
          description: 'Creator wallet address',
        },
      },
      required: ['name', 'symbol', 'description'],
    },
  },

  bags_airdrop: {
    name: 'bags_airdrop',
    description: 'Prepare an airdrop of tokens to multiple wallets. Returns unsigned transaction.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        token: {
          type: 'string',
          description: 'Token mint to airdrop',
        },
        recipients: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              wallet: { type: 'string' },
              amount: { type: 'number' },
            },
          },
          description: 'Array of recipient wallets and amounts',
        },
        senderWallet: {
          type: 'string',
          description: 'Sender wallet address',
        },
      },
      required: ['token', 'recipients'],
    },
  },

  // ==================== MULTI-WALLET TOOLS ====================

  bags_wallet_add: {
    name: 'bags_wallet_add',
    description: 'Add a wallet to your multi-wallet session. Assign an alias for easy reference.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        wallet: {
          type: 'string',
          description: 'Solana wallet address to add',
        },
        alias: {
          type: 'string',
          description: 'Friendly name for this wallet (e.g., "main", "trading", "cold")',
        },
      },
      required: ['wallet'],
    },
  },

  bags_wallet_remove: {
    name: 'bags_wallet_remove',
    description: 'Remove a wallet from your multi-wallet session.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        walletOrAlias: {
          type: 'string',
          description: 'Wallet address or alias to remove',
        },
      },
      required: ['walletOrAlias'],
    },
  },

  bags_wallet_list: {
    name: 'bags_wallet_list',
    description: 'List all wallets in your current session with their aliases and balances.',
    inputSchema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },

  bags_wallet_set_default: {
    name: 'bags_wallet_set_default',
    description: 'Set the default wallet for trades when no wallet is specified.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        walletOrAlias: {
          type: 'string',
          description: 'Wallet address or alias to set as default',
        },
      },
      required: ['walletOrAlias'],
    },
  },

  bags_portfolio_all: {
    name: 'bags_portfolio_all',
    description: 'Get combined portfolio across all wallets in your session.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        groupBy: {
          type: 'string',
          enum: ['token', 'wallet'],
          description: 'How to group the results',
          default: 'token',
        },
      },
      required: [],
    },
  },

  // ==================== NOTIFICATION TOOLS ====================

  bags_notify_telegram: {
    name: 'bags_notify_telegram',
    description: 'Configure Telegram notifications. First use /start with @BagsXBot to get your chat ID.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        action: {
          type: 'string',
          enum: ['setup', 'test', 'remove', 'status'],
          description: 'Notification action',
        },
        chatId: {
          type: 'string',
          description: 'Your Telegram chat ID (get it from @BagsXBot)',
        },
      },
      required: ['action'],
    },
  },

  bags_notify_discord: {
    name: 'bags_notify_discord',
    description: 'Configure Discord notifications via webhook.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        action: {
          type: 'string',
          enum: ['setup', 'test', 'remove', 'status'],
          description: 'Notification action',
        },
        webhookUrl: {
          type: 'string',
          description: 'Discord webhook URL from your server settings',
        },
      },
      required: ['action'],
    },
  },

  bags_notification_settings: {
    name: 'bags_notification_settings',
    description: 'Configure what notifications you receive.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        action: {
          type: 'string',
          enum: ['get', 'update'],
          description: 'Get current settings or update them',
        },
        priceAlerts: {
          type: 'boolean',
          description: 'Receive price alert notifications',
        },
        whaleAlerts: {
          type: 'boolean',
          description: 'Receive whale activity notifications',
        },
        tradeConfirmations: {
          type: 'boolean',
          description: 'Receive trade confirmation notifications',
        },
        newLaunches: {
          type: 'boolean',
          description: 'Receive new token launch notifications',
        },
        portfolioDaily: {
          type: 'boolean',
          description: 'Receive daily portfolio summary',
        },
      },
      required: ['action'],
    },
  },
};

// Zod schemas for runtime validation
export const TrendingInputSchema = z.object({
  metric: z.enum(['volume', 'marketCap', 'gainers', 'losers']).optional().default('volume'),
  limit: z.number().min(1).max(50).optional().default(10),
});

export const SearchInputSchema = z.object({
  query: z.string().min(1),
  limit: z.number().min(1).max(20).optional().default(10),
});

export const TokenInfoInputSchema = z.object({
  token: z.string().min(1),
});

export const PortfolioInputSchema = z.object({
  wallet: z.string().min(32).max(44),
});

export const TradesInputSchema = z.object({
  token: z.string().min(1),
  limit: z.number().min(1).max(100).optional().default(20),
});

export const WhalesInputSchema = z.object({
  token: z.string().optional(),
  minUsd: z.number().min(0).optional().default(10000),
});

export const QuoteInputSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  amount: z.number().positive(),
  slippage: z.number().min(0).max(50).optional().default(1),
});

export const BuyInputSchema = z.object({
  token: z.string().min(1),
  amountUsd: z.number().positive(),
  slippage: z.number().min(0).max(50).optional().default(1),
  wallet: z.string().min(32).max(44).optional(),
});

export const SellInputSchema = z.object({
  token: z.string().min(1),
  amount: z.number().positive().optional(),
  percentage: z.number().min(1).max(100).optional(),
  slippage: z.number().min(0).max(50).optional().default(1),
  wallet: z.string().min(32).max(44).optional(),
});

export const CreatorEarningsInputSchema = z.object({
  token: z.string().min(1),
});

// ==================== NEW MARKET INTELLIGENCE SCHEMAS ====================

export const PriceHistoryInputSchema = z.object({
  token: z.string().min(1),
  period: z.enum(['1h', '24h', '7d', '30d']).optional().default('24h'),
});

export const NewLaunchesInputSchema = z.object({
  hours: z.number().min(1).max(72).optional().default(24),
  limit: z.number().min(1).max(50).optional().default(20),
});

export const GainersLosersInputSchema = z.object({
  type: z.enum(['gainers', 'losers', 'both']).optional().default('both'),
  period: z.enum(['1h', '24h', '7d']).optional().default('24h'),
  limit: z.number().min(1).max(25).optional().default(10),
});

export const HolderAnalysisInputSchema = z.object({
  token: z.string().min(1),
});

// ==================== TRADING ENHANCEMENT SCHEMAS ====================

export const SwapInputSchema = z.object({
  fromToken: z.string().min(1),
  toToken: z.string().min(1),
  amount: z.number().positive(),
  slippage: z.number().min(0).max(50).optional().default(1),
  wallet: z.string().min(32).max(44).optional(),
});

export const LimitOrderInputSchema = z.object({
  token: z.string().min(1),
  side: z.enum(['buy', 'sell']),
  price: z.number().positive(),
  amount: z.number().positive(),
  expiry: z.enum(['1h', '24h', '7d', '30d']).optional().default('24h'),
  wallet: z.string().min(32).max(44).optional(),
});

export const GasEstimateInputSchema = z.object({
  action: z.enum(['buy', 'sell', 'swap', 'launch']),
  token: z.string().optional(),
  amount: z.number().optional(),
});

export const SlippageCheckInputSchema = z.object({
  token: z.string().min(1),
  side: z.enum(['buy', 'sell']),
  amountUsd: z.number().positive(),
});

// ==================== PORTFOLIO & ALERTS SCHEMAS ====================

export const WatchlistInputSchema = z.object({
  action: z.enum(['add', 'remove', 'list']),
  token: z.string().optional(),
  wallet: z.string().min(32).max(44).optional(),
});

export const PriceAlertInputSchema = z.object({
  action: z.enum(['set', 'remove', 'list']),
  token: z.string().optional(),
  targetPrice: z.number().positive().optional(),
  direction: z.enum(['above', 'below']).optional(),
  wallet: z.string().min(32).max(44).optional(),
});

export const PnlReportInputSchema = z.object({
  wallet: z.string().min(32).max(44),
  period: z.enum(['24h', '7d', '30d', 'all']).optional().default('30d'),
});

export const CompareInputSchema = z.object({
  tokens: z.array(z.string()).min(2).max(5),
});

// ==================== CREATOR SCHEMAS ====================

export const TopCreatorsInputSchema = z.object({
  metric: z.enum(['earnings', 'volume', 'holders']).optional().default('earnings'),
  limit: z.number().min(1).max(50).optional().default(20),
});

export const LaunchTokenInputSchema = z.object({
  name: z.string().min(1).max(30),
  symbol: z.string().min(1).max(10),
  description: z.string().min(1).max(500),
  image: z.string().url().optional(),
  twitter: z.string().optional(),
  telegram: z.string().optional(),
  website: z.string().url().optional(),
  initialBuySol: z.number().positive().optional(),
  wallet: z.string().min(32).max(44).optional(),
});

export const AirdropInputSchema = z.object({
  token: z.string().min(1),
  recipients: z.array(z.object({
    wallet: z.string().min(32).max(44),
    amount: z.number().positive(),
  })).min(1).max(100),
  senderWallet: z.string().min(32).max(44).optional(),
});

// ==================== MULTI-WALLET SCHEMAS ====================

export const WalletAddInputSchema = z.object({
  wallet: z.string().min(32).max(44),
  alias: z.string().min(1).max(20).optional(),
});

export const WalletRemoveInputSchema = z.object({
  walletOrAlias: z.string().min(1),
});

export const WalletListInputSchema = z.object({});

export const WalletSetDefaultInputSchema = z.object({
  walletOrAlias: z.string().min(1),
});

export const PortfolioAllInputSchema = z.object({
  groupBy: z.enum(['token', 'wallet']).optional().default('token'),
});

// ==================== NOTIFICATION SCHEMAS ====================

export const NotifyTelegramInputSchema = z.object({
  action: z.enum(['setup', 'test', 'remove', 'status']),
  chatId: z.string().optional(),
});

export const NotifyDiscordInputSchema = z.object({
  action: z.enum(['setup', 'test', 'remove', 'status']),
  webhookUrl: z.string().url().optional(),
});

export const NotificationSettingsInputSchema = z.object({
  action: z.enum(['get', 'update']),
  priceAlerts: z.boolean().optional(),
  whaleAlerts: z.boolean().optional(),
  tradeConfirmations: z.boolean().optional(),
  newLaunches: z.boolean().optional(),
  portfolioDaily: z.boolean().optional(),
});
