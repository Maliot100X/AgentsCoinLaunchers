import { z } from 'zod';

// Tool definitions based on REAL Bags API endpoints
// Verified against docs.bags.fm/api-reference

export const TOOL_DEFINITIONS = {
  // ==================== TRADING TOOLS ====================

  bags_quote: {
    name: 'bags_quote',
    description: 'Get a price quote for swapping tokens on Bags. Shows expected output, price impact, and slippage.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        inputMint: {
          type: 'string',
          description: 'Input token mint address (use So11111111111111111111111111111111111111112 for SOL)',
        },
        outputMint: {
          type: 'string',
          description: 'Output token mint address',
        },
        amount: {
          type: 'number',
          description: 'Amount in smallest unit (lamports for SOL, base units for tokens)',
        },
        slippageMode: {
          type: 'string',
          enum: ['auto', 'manual'],
          description: 'Slippage mode: auto for automatic calculation, manual for custom',
          default: 'auto',
        },
        slippageBps: {
          type: 'number',
          description: 'Slippage in basis points (0-10000). Required when slippageMode is manual',
        },
      },
      required: ['inputMint', 'outputMint', 'amount'],
    },
  },

  bags_swap: {
    name: 'bags_swap',
    description: 'Create a swap transaction from a trade quote. Returns unsigned transaction for user to sign.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        quoteRequestId: {
          type: 'string',
          description: 'Request ID from bags_quote response',
        },
        wallet: {
          type: 'string',
          description: 'User wallet public key to sign the transaction',
        },
      },
      required: ['quoteRequestId', 'wallet'],
    },
  },

  // ==================== TOKEN LAUNCH TOOLS ====================

  bags_launch_prepare: {
    name: 'bags_launch_prepare',
    description: 'Prepare token info and metadata for launch. Creates token mint and uploads to IPFS.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        name: {
          type: 'string',
          description: 'Token name (max 32 characters)',
        },
        symbol: {
          type: 'string',
          description: 'Token symbol (max 10 characters, will be uppercased)',
        },
        description: {
          type: 'string',
          description: 'Token description (max 1000 characters)',
        },
        imageUrl: {
          type: 'string',
          description: 'Public URL to the token image',
        },
        twitter: {
          type: 'string',
          description: 'Twitter URL (optional)',
        },
        telegram: {
          type: 'string',
          description: 'Telegram URL (optional)',
        },
        website: {
          type: 'string',
          description: 'Website URL (optional)',
        },
      },
      required: ['name', 'symbol', 'description'],
    },
  },

  bags_launch_execute: {
    name: 'bags_launch_execute',
    description: 'Create the token launch transaction. Requires output from bags_launch_prepare.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        ipfs: {
          type: 'string',
          description: 'IPFS URL from bags_launch_prepare',
        },
        tokenMint: {
          type: 'string',
          description: 'Token mint from bags_launch_prepare',
        },
        wallet: {
          type: 'string',
          description: 'Creator wallet public key',
        },
        configKey: {
          type: 'string',
          description: 'Config key from fee share setup',
        },
        initialBuyLamports: {
          type: 'number',
          description: 'Initial buy amount in lamports (optional)',
          default: 0,
        },
      },
      required: ['ipfs', 'tokenMint', 'wallet', 'configKey'],
    },
  },

  // ==================== ANALYTICS TOOLS ====================

  bags_creators: {
    name: 'bags_creators',
    description: 'Get the creators/deployers of a token. Shows royalty splits and social links.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        tokenMint: {
          type: 'string',
          description: 'Token mint public key',
        },
      },
      required: ['tokenMint'],
    },
  },

  bags_lifetime_fees: {
    name: 'bags_lifetime_fees',
    description: 'Get total lifetime fees collected for a token (in lamports).',
    inputSchema: {
      type: 'object' as const,
      properties: {
        tokenMint: {
          type: 'string',
          description: 'Token mint public key',
        },
      },
      required: ['tokenMint'],
    },
  },

  bags_claim_stats: {
    name: 'bags_claim_stats',
    description: 'Get claim statistics for all fee claimers of a token. Shows who claimed how much.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        tokenMint: {
          type: 'string',
          description: 'Token mint public key',
        },
      },
      required: ['tokenMint'],
    },
  },

  bags_claim_events: {
    name: 'bags_claim_events',
    description: 'Get claim event history for a token. Supports pagination or time-based filtering.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        tokenMint: {
          type: 'string',
          description: 'Token mint public key',
        },
        mode: {
          type: 'string',
          enum: ['offset', 'time'],
          description: 'Query mode: offset for pagination, time for time range',
          default: 'offset',
        },
        limit: {
          type: 'number',
          description: 'Max events to return (1-100)',
          default: 100,
        },
        offset: {
          type: 'number',
          description: 'Skip this many events (for pagination)',
          default: 0,
        },
        from: {
          type: 'number',
          description: 'Start unix timestamp (for time mode)',
        },
        to: {
          type: 'number',
          description: 'End unix timestamp (for time mode)',
        },
      },
      required: ['tokenMint'],
    },
  },

  // ==================== FEE CLAIMING TOOLS ====================

  bags_claimable: {
    name: 'bags_claimable',
    description: 'Get all claimable fee positions for a wallet. Shows pending fees across tokens.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        wallet: {
          type: 'string',
          description: 'Wallet public key to check',
        },
      },
      required: ['wallet'],
    },
  },

  bags_claim_fees: {
    name: 'bags_claim_fees',
    description: 'Generate transactions to claim fees for a token. Returns unsigned transactions.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        tokenMint: {
          type: 'string',
          description: 'Token mint public key',
        },
        wallet: {
          type: 'string',
          description: 'Fee claimer wallet public key',
        },
      },
      required: ['tokenMint', 'wallet'],
    },
  },

  // ==================== FEE SHARE CONFIG TOOLS ====================

  bags_fee_wallet: {
    name: 'bags_fee_wallet',
    description: 'Lookup fee share wallet by social provider username (Twitter, GitHub, etc).',
    inputSchema: {
      type: 'object' as const,
      properties: {
        provider: {
          type: 'string',
          enum: ['twitter', 'github', 'instagram', 'tiktok', 'kick', 'onlyfans'],
          description: 'Social provider name',
        },
        username: {
          type: 'string',
          description: 'Username/handle on the platform',
        },
      },
      required: ['provider', 'username'],
    },
  },

  bags_fee_config: {
    name: 'bags_fee_config',
    description: 'Create fee sharing config with multiple claimers. Required before token launch.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        payer: {
          type: 'string',
          description: 'Payer wallet public key',
        },
        baseMint: {
          type: 'string',
          description: 'Token mint public key',
        },
        claimers: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of claimer wallet public keys',
        },
        basisPoints: {
          type: 'array',
          items: { type: 'number' },
          description: 'Basis points for each claimer (must total 10000)',
        },
      },
      required: ['payer', 'baseMint', 'claimers', 'basisPoints'],
    },
  },

  bags_admin_list: {
    name: 'bags_admin_list',
    description: 'List all tokens where a wallet is the fee share admin.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        wallet: {
          type: 'string',
          description: 'Admin wallet public key',
        },
      },
      required: ['wallet'],
    },
  },

  bags_admin_update: {
    name: 'bags_admin_update',
    description: 'Update fee share config for a token. Only admin can do this.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        baseMint: {
          type: 'string',
          description: 'Token mint public key',
        },
        payer: {
          type: 'string',
          description: 'Payer/admin wallet public key',
        },
        claimers: {
          type: 'array',
          items: { type: 'string' },
          description: 'New array of claimer wallets',
        },
        basisPoints: {
          type: 'array',
          items: { type: 'number' },
          description: 'New basis points for each claimer',
        },
      },
      required: ['baseMint', 'payer', 'claimers', 'basisPoints'],
    },
  },

  bags_admin_transfer: {
    name: 'bags_admin_transfer',
    description: 'Transfer fee share admin authority to a new wallet.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        baseMint: {
          type: 'string',
          description: 'Token mint public key',
        },
        currentAdmin: {
          type: 'string',
          description: 'Current admin wallet public key',
        },
        newAdmin: {
          type: 'string',
          description: 'New admin wallet public key',
        },
        payer: {
          type: 'string',
          description: 'Payer wallet public key',
        },
      },
      required: ['baseMint', 'currentAdmin', 'newAdmin', 'payer'],
    },
  },

  // ==================== STATE/POOL TOOLS ====================

  bags_pools: {
    name: 'bags_pools',
    description: 'Get list of all Bags pools with their Meteora DBC and DAMM v2 keys.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        onlyMigrated: {
          type: 'boolean',
          description: 'Only return pools that migrated to DAMM v2',
          default: false,
        },
      },
      required: [],
    },
  },

  bags_pool_info: {
    name: 'bags_pool_info',
    description: 'Get pool information for a specific token mint.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        tokenMint: {
          type: 'string',
          description: 'Token mint public key',
        },
      },
      required: ['tokenMint'],
    },
  },

  // ==================== PARTNER TOOLS ====================

  bags_partner_stats: {
    name: 'bags_partner_stats',
    description: 'Get partner statistics including claimed and unclaimed fees.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        partner: {
          type: 'string',
          description: 'Partner wallet public key',
        },
      },
      required: ['partner'],
    },
  },

  bags_partner_claim: {
    name: 'bags_partner_claim',
    description: 'Generate transactions to claim accumulated partner fees.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        partnerWallet: {
          type: 'string',
          description: 'Partner wallet public key',
        },
      },
      required: ['partnerWallet'],
    },
  },
};

// ==================== ZOD SCHEMAS ====================

export const QuoteInputSchema = z.object({
  inputMint: z.string().min(32).max(44),
  outputMint: z.string().min(32).max(44),
  amount: z.number().positive(),
  slippageMode: z.enum(['auto', 'manual']).optional().default('auto'),
  slippageBps: z.number().min(0).max(10000).optional(),
});

export const SwapInputSchema = z.object({
  quoteRequestId: z.string().min(1),
  wallet: z.string().min(32).max(44),
});

export const LaunchPrepareInputSchema = z.object({
  name: z.string().min(1).max(32),
  symbol: z.string().min(1).max(10),
  description: z.string().min(1).max(1000),
  imageUrl: z.string().url().optional(),
  twitter: z.string().optional(),
  telegram: z.string().optional(),
  website: z.string().url().optional(),
});

export const LaunchExecuteInputSchema = z.object({
  ipfs: z.string().min(1),
  tokenMint: z.string().min(32).max(44),
  wallet: z.string().min(32).max(44),
  configKey: z.string().min(32).max(44),
  initialBuyLamports: z.number().min(0).optional().default(0),
});

export const TokenMintInputSchema = z.object({
  tokenMint: z.string().min(32).max(44),
});

export const ClaimEventsInputSchema = z.object({
  tokenMint: z.string().min(32).max(44),
  mode: z.enum(['offset', 'time']).optional().default('offset'),
  limit: z.number().min(1).max(100).optional().default(100),
  offset: z.number().min(0).optional().default(0),
  from: z.number().min(0).optional(),
  to: z.number().min(0).optional(),
});

export const WalletInputSchema = z.object({
  wallet: z.string().min(32).max(44),
});

export const ClaimFeesInputSchema = z.object({
  tokenMint: z.string().min(32).max(44),
  wallet: z.string().min(32).max(44),
});

export const FeeWalletInputSchema = z.object({
  provider: z.enum(['twitter', 'github', 'instagram', 'tiktok', 'kick', 'onlyfans']),
  username: z.string().min(1).max(100),
});

export const FeeConfigInputSchema = z.object({
  payer: z.string().min(32).max(44),
  baseMint: z.string().min(32).max(44),
  claimers: z.array(z.string().min(32).max(44)).min(1).max(100),
  basisPoints: z.array(z.number().min(0).max(10000)).min(1).max(100),
});

export const AdminUpdateInputSchema = z.object({
  baseMint: z.string().min(32).max(44),
  payer: z.string().min(32).max(44),
  claimers: z.array(z.string().min(32).max(44)).min(1).max(100),
  basisPoints: z.array(z.number().min(0).max(10000)).min(1).max(100),
});

export const AdminTransferInputSchema = z.object({
  baseMint: z.string().min(32).max(44),
  currentAdmin: z.string().min(32).max(44),
  newAdmin: z.string().min(32).max(44),
  payer: z.string().min(32).max(44),
});

export const PoolsInputSchema = z.object({
  onlyMigrated: z.boolean().optional().default(false),
});

export const PartnerInputSchema = z.object({
  partner: z.string().min(32).max(44),
});

export const PartnerClaimInputSchema = z.object({
  partnerWallet: z.string().min(32).max(44),
});
