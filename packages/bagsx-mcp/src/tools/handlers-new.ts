import { bagsClient } from '../lib/bags-client-new';

// Handler type definition
type ToolHandler = (args: Record<string, unknown>) => Promise<unknown>;

// ==================== TOOL HANDLERS ====================

export const toolHandlers: Record<string, ToolHandler> = {
  // ==================== TRADING ====================

  bags_quote: async (args) => {
    const { inputMint, outputMint, amount, slippageMode, slippageBps } = args as {
      inputMint: string;
      outputMint: string;
      amount: number;
      slippageMode?: 'auto' | 'manual';
      slippageBps?: number;
    };

    const result = await bagsClient.getQuote({
      inputMint,
      outputMint,
      amount,
      slippageMode,
      slippageBps,
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to get quote');
    }

    return {
      requestId: result.response!.requestId,
      inputMint: result.response!.inputMint,
      outputMint: result.response!.outputMint,
      inAmount: result.response!.inAmount,
      outAmount: result.response!.outAmount,
      minOutAmount: result.response!.minOutAmount,
      priceImpactPct: result.response!.priceImpactPct,
      slippageBps: result.response!.slippageBps,
      routes: result.response!.routePlan.length,
      message: 'Quote retrieved. Use bags_swap with the requestId to execute.',
    };
  },

  bags_swap: async (args) => {
    const { quoteRequestId, wallet } = args as {
      quoteRequestId: string;
      wallet: string;
    };

    const result = await bagsClient.createSwap({ quoteRequestId, wallet });

    if (!result.success) {
      throw new Error(result.error || 'Failed to create swap transaction');
    }

    return {
      transaction: result.response!.swapTransaction,
      computeUnitLimit: result.response!.computeUnitLimit,
      lastValidBlockHeight: result.response!.lastValidBlockHeight,
      prioritizationFeeLamports: result.response!.prioritizationFeeLamports,
      message: 'Sign and submit this transaction to complete the swap.',
    };
  },

  // ==================== TOKEN LAUNCH ====================

  bags_launch_prepare: async (args) => {
    const { name, symbol, description, imageUrl, twitter, telegram, website } = args as {
      name: string;
      symbol: string;
      description: string;
      imageUrl?: string;
      twitter?: string;
      telegram?: string;
      website?: string;
    };

    const result = await bagsClient.createTokenInfo({
      name,
      symbol,
      description,
      imageUrl,
      twitter,
      telegram,
      website,
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to prepare token launch');
    }

    return {
      tokenMint: result.response!.tokenMint,
      metadataUri: result.response!.tokenMetadata,
      status: result.response!.tokenLaunch.status,
      message: 'Token info created. Use bags_launch_execute to complete the launch.',
    };
  },

  bags_launch_execute: async (args) => {
    const { ipfs, tokenMint, wallet, configKey, initialBuyLamports } = args as {
      ipfs: string;
      tokenMint: string;
      wallet: string;
      configKey: string;
      initialBuyLamports?: number;
    };

    const result = await bagsClient.createLaunchTransaction({
      ipfs,
      tokenMint,
      wallet,
      configKey,
      initialBuyLamports,
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to create launch transaction');
    }

    return {
      transaction: result.response,
      message: 'Sign and submit this transaction to launch your token.',
    };
  },

  // ==================== ANALYTICS ====================

  bags_creators: async (args) => {
    const { tokenMint } = args as { tokenMint: string };
    const result = await bagsClient.getCreators(tokenMint);

    if (!result.success) {
      throw new Error(result.error || 'Failed to get creators');
    }

    return {
      creators: result.response,
      count: result.response!.length,
    };
  },

  bags_lifetime_fees: async (args) => {
    const { tokenMint } = args as { tokenMint: string };
    const result = await bagsClient.getLifetimeFees(tokenMint);

    if (!result.success) {
      throw new Error(result.error || 'Failed to get lifetime fees');
    }

    return {
      tokenMint,
      lifetimeFees: result.response,
    };
  },

  bags_claim_stats: async (args) => {
    const { tokenMint } = args as { tokenMint: string };
    const result = await bagsClient.getClaimStats(tokenMint);

    if (!result.success) {
      throw new Error(result.error || 'Failed to get claim stats');
    }

    return {
      tokenMint,
      stats: result.response,
      totalClaimers: result.response!.length,
    };
  },

  bags_claim_events: async (args) => {
    const { tokenMint, mode, limit, offset, from, to } = args as {
      tokenMint: string;
      mode?: 'offset' | 'time';
      limit?: number;
      offset?: number;
      from?: number;
      to?: number;
    };

    const result = await bagsClient.getClaimEvents({
      tokenMint,
      mode,
      limit,
      offset,
      from,
      to,
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to get claim events');
    }

    return {
      tokenMint,
      events: result.response!.events,
      count: result.response!.events.length,
    };
  },

  // ==================== FEE CLAIMING ====================

  bags_claimable: async (args) => {
    const { wallet } = args as { wallet: string };
    const result = await bagsClient.getClaimablePositions(wallet);

    if (!result.success) {
      throw new Error(result.error || 'Failed to get claimable positions');
    }

    const totalClaimable = result.response!.reduce(
      (sum, pos) => sum + pos.claimableDisplayAmount,
      0
    );

    return {
      wallet,
      positions: result.response,
      count: result.response!.length,
      totalClaimableSOL: totalClaimable.toFixed(4),
    };
  },

  bags_claim_fees: async (args) => {
    const { tokenMint, wallet } = args as { tokenMint: string; wallet: string };
    const result = await bagsClient.createClaimTransactions({ tokenMint, wallet });

    if (!result.success) {
      throw new Error(result.error || 'Failed to create claim transactions');
    }

    return {
      transactions: result.response!.map((tx) => ({
        blockhash: tx.blockhash.blockhash,
        lastValidBlockHeight: tx.blockhash.lastValidBlockHeight,
        transaction: tx.transaction,
      })),
      count: result.response!.length,
      message: 'Sign and submit these transactions to claim your fees.',
    };
  },

  // ==================== FEE SHARE CONFIG ====================

  bags_fee_wallet: async (args) => {
    const { provider, username } = args as { provider: string; username: string };
    const result = await bagsClient.getFeeShareWallet({ provider, username });

    if (!result.success) {
      throw new Error(result.error || 'Failed to get fee share wallet');
    }

    return {
      provider: result.response!.provider,
      username: result.response!.platformData.username,
      displayName: result.response!.platformData.display_name,
      wallet: result.response!.wallet,
    };
  },

  bags_fee_config: async (args) => {
    const { payer, baseMint, claimers, basisPoints } = args as {
      payer: string;
      baseMint: string;
      claimers: string[];
      basisPoints: number[];
    };

    if (claimers.length !== basisPoints.length) {
      throw new Error('claimers and basisPoints arrays must have the same length');
    }

    const totalBps = basisPoints.reduce((sum, bp) => sum + bp, 0);
    if (totalBps !== 10000) {
      throw new Error(`Basis points must sum to 10000 (100%), got ${totalBps}`);
    }

    const result = await bagsClient.createFeeConfig({ payer, baseMint, claimers, basisPoints });

    if (!result.success) {
      throw new Error(result.error || 'Failed to create fee config');
    }

    return {
      needsCreation: result.response!.needsCreation,
      feeShareAuthority: result.response!.feeShareAuthority,
      transactions: result.response!.transactions.length,
      message: result.response!.needsCreation
        ? 'Sign and submit the transactions to create fee share config.'
        : 'Fee share config already exists for this token.',
    };
  },

  bags_admin_list: async (args) => {
    const { wallet } = args as { wallet: string };
    const result = await bagsClient.getAdminList(wallet);

    if (!result.success) {
      throw new Error(result.error || 'Failed to get admin list');
    }

    return {
      wallet,
      tokenMints: result.response!.tokenMints,
      count: result.response!.tokenMints.length,
    };
  },

  bags_admin_update: async (args) => {
    const { baseMint, payer, claimers, basisPoints } = args as {
      baseMint: string;
      payer: string;
      claimers: string[];
      basisPoints: number[];
    };

    if (claimers.length !== basisPoints.length) {
      throw new Error('claimers and basisPoints arrays must have the same length');
    }

    const totalBps = basisPoints.reduce((sum, bp) => sum + bp, 0);
    if (totalBps !== 10000) {
      throw new Error(`Basis points must sum to 10000 (100%), got ${totalBps}`);
    }

    const result = await bagsClient.updateFeeConfig({ baseMint, payer, claimers, basisPoints });

    if (!result.success) {
      throw new Error(result.error || 'Failed to update fee config');
    }

    return {
      baseMint,
      transactions: result.response!.transactions.length,
      message: 'Sign and submit the transactions to update fee share config.',
    };
  },

  bags_admin_transfer: async (args) => {
    const { baseMint, currentAdmin, newAdmin, payer } = args as {
      baseMint: string;
      currentAdmin: string;
      newAdmin: string;
      payer: string;
    };

    const result = await bagsClient.transferAdmin({ baseMint, currentAdmin, newAdmin, payer });

    if (!result.success) {
      throw new Error(result.error || 'Failed to create admin transfer transaction');
    }

    return {
      blockhash: result.response!.blockhash.blockhash,
      lastValidBlockHeight: result.response!.blockhash.lastValidBlockHeight,
      transaction: result.response!.transaction,
      message: 'Sign and submit this transaction to transfer admin rights.',
    };
  },

  // ==================== STATE/POOLS ====================

  bags_pools: async (args) => {
    const { onlyMigrated } = args as { onlyMigrated?: boolean };
    const result = await bagsClient.getPools(onlyMigrated);

    if (!result.success) {
      throw new Error(result.error || 'Failed to get pools');
    }

    return {
      pools: result.response,
      count: result.response!.length,
      filter: onlyMigrated ? 'migrated only' : 'all',
    };
  },

  bags_pool_info: async (args) => {
    const { tokenMint } = args as { tokenMint: string };
    const result = await bagsClient.getPoolByMint(tokenMint);

    if (!result.success) {
      throw new Error(result.error || 'Failed to get pool info');
    }

    return {
      tokenMint: result.response!.tokenMint,
      dbcConfigKey: result.response!.dbcConfigKey,
      dbcPoolKey: result.response!.dbcPoolKey,
      dammV2PoolKey: result.response!.dammV2PoolKey,
    };
  },

  // ==================== PARTNER ====================

  bags_partner_stats: async (args) => {
    const { partner } = args as { partner: string };
    const result = await bagsClient.getPartnerStats(partner);

    if (!result.success) {
      throw new Error(result.error || 'Failed to get partner stats');
    }

    return {
      partner,
      claimedFees: result.response!.claimedFees,
      unclaimedFees: result.response!.unclaimedFees,
    };
  },

  bags_partner_claim: async (args) => {
    const { partnerWallet } = args as { partnerWallet: string };
    const result = await bagsClient.createPartnerClaimTransactions(partnerWallet);

    if (!result.success) {
      throw new Error(result.error || 'Failed to create partner claim transactions');
    }

    return {
      transactions: result.response!.transactions.map((tx) => ({
        blockhash: tx.blockhash.blockhash,
        lastValidBlockHeight: tx.blockhash.lastValidBlockHeight,
        transaction: tx.transaction,
      })),
      count: result.response!.transactions.length,
      message: 'Sign and submit these transactions to claim partner fees.',
    };
  },
};
