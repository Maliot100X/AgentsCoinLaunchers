import { bagsClient } from '../lib/bags-client';
import {
  TrendingInputSchema,
  SearchInputSchema,
  TokenInfoInputSchema,
  PortfolioInputSchema,
  TradesInputSchema,
  WhalesInputSchema,
  QuoteInputSchema,
  BuyInputSchema,
  SellInputSchema,
  CreatorEarningsInputSchema,
  // New Market Intelligence
  PriceHistoryInputSchema,
  NewLaunchesInputSchema,
  GainersLosersInputSchema,
  HolderAnalysisInputSchema,
  // New Trading Enhancements
  SwapInputSchema,
  LimitOrderInputSchema,
  GasEstimateInputSchema,
  SlippageCheckInputSchema,
  // New Portfolio & Alerts
  WatchlistInputSchema,
  PriceAlertInputSchema,
  PnlReportInputSchema,
  CompareInputSchema,
  // New Creator Tools
  TopCreatorsInputSchema,
  LaunchTokenInputSchema,
  AirdropInputSchema,
  // Multi-Wallet
  WalletAddInputSchema,
  WalletRemoveInputSchema,
  WalletListInputSchema,
  WalletSetDefaultInputSchema,
  PortfolioAllInputSchema,
  // Notifications
  NotifyTelegramInputSchema,
  NotifyDiscordInputSchema,
  NotificationSettingsInputSchema,
} from './definitions';

type ToolResult = {
  content: Array<{
    type: 'text';
    text: string;
  }>;
  isError?: boolean;
};

function formatSuccess(data: unknown): ToolResult {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}

function formatError(message: string): ToolResult {
  return {
    content: [
      {
        type: 'text',
        text: `Error: ${message}`,
      },
    ],
    isError: true,
  };
}

export async function handleToolCall(
  toolName: string,
  args: Record<string, unknown>
): Promise<ToolResult> {
  try {
    switch (toolName) {
      // ==================== READ OPERATIONS ====================

      case 'bags_trending': {
        const input = TrendingInputSchema.parse(args);
        const result = await bagsClient.getTrending(input.metric, input.limit);

        if (!result.success) {
          return formatError(result.error || 'Failed to fetch trending tokens');
        }

        return formatSuccess({
          metric: input.metric,
          tokens: result.response,
        });
      }

      case 'bags_search': {
        const input = SearchInputSchema.parse(args);
        const result = await bagsClient.searchTokens(input.query, input.limit);

        if (!result.success) {
          return formatError(result.error || 'Search failed');
        }

        return formatSuccess({
          query: input.query,
          results: result.response,
        });
      }

      case 'bags_token_info': {
        const input = TokenInfoInputSchema.parse(args);
        const result = await bagsClient.getTokenInfo(input.token);

        if (!result.success) {
          return formatError(result.error || 'Token not found');
        }

        return formatSuccess(result.response);
      }

      case 'bags_portfolio': {
        const input = PortfolioInputSchema.parse(args);
        const result = await bagsClient.getPortfolio(input.wallet);

        if (!result.success) {
          return formatError(result.error || 'Failed to fetch portfolio');
        }

        return formatSuccess(result.response);
      }

      case 'bags_trades': {
        const input = TradesInputSchema.parse(args);
        const result = await bagsClient.getRecentTrades(input.token, input.limit);

        if (!result.success) {
          return formatError(result.error || 'Failed to fetch trades');
        }

        return formatSuccess({
          token: input.token,
          trades: result.response,
        });
      }

      case 'bags_whales': {
        const input = WhalesInputSchema.parse(args);
        const result = await bagsClient.getWhaleActivity(input.token, input.minUsd);

        if (!result.success) {
          return formatError(result.error || 'Failed to fetch whale activity');
        }

        return formatSuccess({
          filter: input.token ? `Token: ${input.token}` : 'All tokens',
          minUsd: input.minUsd,
          activity: result.response,
        });
      }

      // ==================== TRADE OPERATIONS ====================

      case 'bags_quote': {
        const input = QuoteInputSchema.parse(args);
        const result = await bagsClient.getQuote(
          input.from,
          input.to,
          input.amount,
          input.slippage
        );

        if (!result.success) {
          return formatError(result.error || 'Failed to get quote');
        }

        return formatSuccess({
          trade: `${input.amount} ${input.from} → ${input.to}`,
          quote: result.response,
        });
      }

      case 'bags_buy': {
        const input = BuyInputSchema.parse(args);

        const result = await bagsClient.buy(
          input.token,
          input.amountUsd,
          input.slippage,
          input.wallet
        );

        if (!result.success) {
          return formatError(result.error || 'Failed to prepare trade');
        }

        const tx = result.response;
        return formatSuccess({
          status: 'unsigned_transaction_ready',
          trade: {
            type: 'BUY',
            token: input.token,
            amountUsd: input.amountUsd,
            expectedOutput: tx?.amountOut,
            priceImpact: tx?.priceImpact,
            fee: tx?.fee,
          },
          transaction: tx?.transaction,
          expiresAt: tx?.expiresAt,
          instructions: [
            '🔐 SECURE SIGNING - Your keys never leave your wallet',
            '',
            'To complete this trade:',
            '1. Copy the transaction string below',
            '2. Go to bags.fm/sign or use Phantom/Solflare',
            '3. Paste and sign the transaction',
            '4. Submit to complete the trade',
            '',
            '⏱️ Transaction expires in ~2 minutes',
          ].join('\\n'),
        });
      }

      case 'bags_sell': {
        const input = SellInputSchema.parse(args);

        if (!input.amount && !input.percentage) {
          return formatError('Must specify either amount or percentage to sell');
        }

        const result = await bagsClient.sell(
          input.token,
          input.amount || 0,
          input.slippage,
          input.wallet
        );

        if (!result.success) {
          return formatError(result.error || 'Failed to prepare trade');
        }

        const tx = result.response;
        return formatSuccess({
          status: 'unsigned_transaction_ready',
          trade: {
            type: 'SELL',
            token: input.token,
            amountTokens: input.amount,
            expectedOutput: tx?.amountOut,
            priceImpact: tx?.priceImpact,
            fee: tx?.fee,
          },
          transaction: tx?.transaction,
          expiresAt: tx?.expiresAt,
          instructions: [
            '🔐 SECURE SIGNING - Your keys never leave your wallet',
            '',
            'To complete this trade:',
            '1. Copy the transaction string below',
            '2. Go to bags.fm/sign or use Phantom/Solflare',
            '3. Paste and sign the transaction',
            '4. Submit to complete the trade',
            '',
            '⏱️ Transaction expires in ~2 minutes',
          ].join('\\n'),
        });
      }

      // ==================== ANALYTICS ====================

      case 'bags_creator_earnings': {
        const input = CreatorEarningsInputSchema.parse(args);
        const result = await bagsClient.getCreatorEarnings(input.token);

        if (!result.success) {
          return formatError(result.error || 'Failed to fetch earnings');
        }

        return formatSuccess(result.response);
      }

      // ==================== NEW: MARKET INTELLIGENCE ====================

      case 'bags_price_history': {
        const input = PriceHistoryInputSchema.parse(args);
        const result = await bagsClient.getPriceHistory(input.token, input.period);

        if (!result.success) {
          return formatError(result.error || 'Failed to fetch price history');
        }

        return formatSuccess({
          token: input.token,
          period: input.period,
          data: result.response,
        });
      }

      case 'bags_new_launches': {
        const input = NewLaunchesInputSchema.parse(args);
        const result = await bagsClient.getNewLaunches(input.hours, input.limit);

        if (!result.success) {
          return formatError(result.error || 'Failed to fetch new launches');
        }

        return formatSuccess({
          timeframe: `Last ${input.hours} hours`,
          tokens: result.response,
        });
      }

      case 'bags_gainers_losers': {
        const input = GainersLosersInputSchema.parse(args);
        const result = await bagsClient.getGainersLosers(input.type, input.period, input.limit);

        if (!result.success) {
          return formatError(result.error || 'Failed to fetch movers');
        }

        return formatSuccess({
          period: input.period,
          type: input.type,
          data: result.response,
        });
      }

      case 'bags_holder_analysis': {
        const input = HolderAnalysisInputSchema.parse(args);
        const result = await bagsClient.getHolderAnalysis(input.token);

        if (!result.success) {
          return formatError(result.error || 'Failed to analyze holders');
        }

        return formatSuccess({
          token: input.token,
          analysis: result.response,
        });
      }

      // ==================== NEW: TRADING ENHANCEMENTS ====================

      case 'bags_swap': {
        const input = SwapInputSchema.parse(args);
        const result = await bagsClient.prepareSwap(
          input.fromToken,
          input.toToken,
          input.amount,
          input.slippage,
          input.wallet
        );

        if (!result.success) {
          return formatError(result.error || 'Failed to prepare swap');
        }

        const tx = result.response;
        return formatSuccess({
          status: 'unsigned_transaction_ready',
          swap: {
            from: input.fromToken,
            to: input.toToken,
            inputAmount: tx?.inputAmount,
            outputAmount: tx?.outputAmount,
            priceImpact: tx?.priceImpact,
          },
          transaction: tx?.transaction,
          expiresAt: tx?.expiresAt,
          instructions: [
            '🔐 SECURE SIGNING - Your keys never leave your wallet',
            '',
            `Swapping ${input.amount} ${input.fromToken} → ${input.toToken}`,
            '1. Copy the transaction string below',
            '2. Sign in Phantom/Solflare/bags.fm',
            '3. Submit to complete the swap',
            '',
            '⏱️ Transaction expires in ~2 minutes',
          ].join('\\n'),
        });
      }

      case 'bags_limit_order': {
        const input = LimitOrderInputSchema.parse(args);
        const result = await bagsClient.setLimitOrder({
          token: input.token,
          side: input.side,
          price: input.price,
          amount: input.amount,
          expiry: input.expiry,
          wallet: input.wallet,
        });

        if (!result.success) {
          return formatError(result.error || 'Failed to set limit order');
        }

        return formatSuccess({
          status: 'limit_order_set',
          order: result.response,
          message: `${input.side.toUpperCase()} order set for ${input.token} at $${input.price}`,
        });
      }

      case 'bags_gas_estimate': {
        const input = GasEstimateInputSchema.parse(args);
        const result = await bagsClient.estimateGas(input.action, input.token, input.amount);

        if (!result.success) {
          return formatError(result.error || 'Failed to estimate gas');
        }

        return formatSuccess({
          action: input.action,
          estimate: result.response,
        });
      }

      case 'bags_slippage_check': {
        const input = SlippageCheckInputSchema.parse(args);
        const result = await bagsClient.checkSlippage(input.token, input.side, input.amountUsd);

        if (!result.success) {
          return formatError(result.error || 'Failed to check slippage');
        }

        return formatSuccess({
          token: input.token,
          tradeSize: input.amountUsd,
          side: input.side,
          slippageData: result.response,
        });
      }

      // ==================== NEW: PORTFOLIO & ALERTS ====================

      case 'bags_watchlist': {
        const input = WatchlistInputSchema.parse(args);
        const result = await bagsClient.manageWatchlist(input.action, input.token, input.wallet);

        if (!result.success) {
          return formatError(result.error || 'Watchlist operation failed');
        }

        return formatSuccess({
          action: input.action,
          result: result.response,
        });
      }

      case 'bags_price_alert': {
        const input = PriceAlertInputSchema.parse(args);
        const result = await bagsClient.managePriceAlert({
          action: input.action,
          token: input.token,
          targetPrice: input.targetPrice,
          direction: input.direction,
          wallet: input.wallet,
        });

        if (!result.success) {
          return formatError(result.error || 'Alert operation failed');
        }

        return formatSuccess({
          action: input.action,
          result: result.response,
        });
      }

      case 'bags_pnl_report': {
        const input = PnlReportInputSchema.parse(args);
        const result = await bagsClient.getPnlReport(input.wallet, input.period);

        if (!result.success) {
          return formatError(result.error || 'Failed to generate P&L report');
        }

        return formatSuccess({
          wallet: input.wallet,
          period: input.period,
          report: result.response,
        });
      }

      case 'bags_compare': {
        const input = CompareInputSchema.parse(args);
        const result = await bagsClient.compareTokens(input.tokens);

        if (!result.success) {
          return formatError(result.error || 'Failed to compare tokens');
        }

        return formatSuccess({
          comparing: input.tokens,
          comparison: result.response,
        });
      }

      // ==================== NEW: CREATOR TOOLS ====================

      case 'bags_top_creators': {
        const input = TopCreatorsInputSchema.parse(args);
        const result = await bagsClient.getTopCreators(input.metric, input.limit);

        if (!result.success) {
          return formatError(result.error || 'Failed to fetch creators');
        }

        return formatSuccess({
          metric: input.metric,
          leaderboard: result.response,
        });
      }

      case 'bags_launch_token': {
        const input = LaunchTokenInputSchema.parse(args);
        const result = await bagsClient.prepareTokenLaunch({
          name: input.name,
          symbol: input.symbol,
          description: input.description,
          image: input.image,
          twitter: input.twitter,
          telegram: input.telegram,
          website: input.website,
          initialBuySol: input.initialBuySol,
          wallet: input.wallet,
        });

        if (!result.success) {
          return formatError(result.error || 'Failed to prepare token launch');
        }

        const tx = result.response;
        return formatSuccess({
          status: 'unsigned_transaction_ready',
          token: {
            name: input.name,
            symbol: input.symbol,
            estimatedMint: tx?.estimatedMint,
            metadataUri: tx?.metadataUri,
            launchFee: tx?.launchFee,
          },
          transaction: tx?.transaction,
          expiresAt: tx?.expiresAt,
          instructions: [
            '🚀 TOKEN LAUNCH - Sign to create your token',
            '',
            `Creating: ${input.symbol} (${input.name})`,
            '1. Copy the transaction string below',
            '2. Sign in Phantom/Solflare',
            '3. Submit to launch your token',
            '',
            '⏱️ Transaction expires in ~2 minutes',
          ].join('\\n'),
        });
      }

      case 'bags_airdrop': {
        const input = AirdropInputSchema.parse(args);
        const result = await bagsClient.prepareAirdrop(
          input.token,
          input.recipients,
          input.senderWallet
        );

        if (!result.success) {
          return formatError(result.error || 'Failed to prepare airdrop');
        }

        const tx = result.response;
        return formatSuccess({
          status: 'unsigned_transaction_ready',
          airdrop: {
            token: input.token,
            recipientCount: tx?.recipientCount,
            totalAmount: tx?.totalAmount,
            estimatedFee: tx?.estimatedFee,
          },
          transaction: tx?.transaction,
          expiresAt: tx?.expiresAt,
          instructions: [
            '🎁 AIRDROP - Sign to distribute tokens',
            '',
            `Sending ${input.token} to ${input.recipients.length} recipients`,
            '1. Copy the transaction string below',
            '2. Sign in Phantom/Solflare',
            '3. Submit to execute the airdrop',
            '',
            '⏱️ Transaction expires in ~2 minutes',
          ].join('\\n'),
        });
      }

      // ==================== MULTI-WALLET TOOLS ====================

      case 'bags_wallet_add': {
        const input = WalletAddInputSchema.parse(args);
        const result = await bagsClient.addWallet(input.wallet, input.alias);

        if (!result.success) {
          return formatError(result.error || 'Failed to add wallet');
        }

        return formatSuccess({
          status: 'wallet_added',
          wallet: result.response,
          message: input.alias
            ? `Wallet added as "${input.alias}"`
            : 'Wallet added to session',
        });
      }

      case 'bags_wallet_remove': {
        const input = WalletRemoveInputSchema.parse(args);
        const result = bagsClient.removeWallet(input.walletOrAlias);

        if (!result.success) {
          return formatError(result.error || 'Failed to remove wallet');
        }

        return formatSuccess({
          status: 'wallet_removed',
          result: result.response,
        });
      }

      case 'bags_wallet_list': {
        WalletListInputSchema.parse(args);
        const result = await bagsClient.listWallets();

        if (!result.success) {
          return formatError(result.error || 'Failed to list wallets');
        }

        const wallets = result.response || [];
        if (wallets.length === 0) {
          return formatSuccess({
            message: 'No wallets in session. Use bags_wallet_add to add a wallet.',
            wallets: [],
          });
        }

        return formatSuccess({
          walletCount: wallets.length,
          wallets: wallets,
          tip: 'Use bags_wallet_set_default to change the default wallet for trades.',
        });
      }

      case 'bags_wallet_set_default': {
        const input = WalletSetDefaultInputSchema.parse(args);
        const result = bagsClient.setDefaultWallet(input.walletOrAlias);

        if (!result.success) {
          return formatError(result.error || 'Failed to set default wallet');
        }

        return formatSuccess({
          status: 'default_wallet_set',
          defaultWallet: result.response?.defaultWallet,
          message: `Default wallet set to ${result.response?.defaultWallet}`,
        });
      }

      case 'bags_portfolio_all': {
        const input = PortfolioAllInputSchema.parse(args);
        const result = await bagsClient.getPortfolioAll(input.groupBy);

        if (!result.success) {
          return formatError(result.error || 'Failed to fetch combined portfolio');
        }

        return formatSuccess({
          summary: {
            totalValue: result.response?.totalValue,
            walletCount: result.response?.walletCount,
          },
          groupedBy: input.groupBy,
          data: input.groupBy === 'wallet'
            ? result.response?.byWallet
            : result.response?.byToken,
        });
      }

      // ==================== NOTIFICATION TOOLS ====================

      case 'bags_notify_telegram': {
        const input = NotifyTelegramInputSchema.parse(args);

        if (input.action === 'setup' && !input.chatId) {
          return formatSuccess({
            status: 'setup_required',
            instructions: [
              '📱 TELEGRAM SETUP',
              '',
              '1. Open Telegram and search for @BagsXBot',
              '2. Start the bot with /start',
              '3. The bot will reply with your Chat ID',
              '4. Run this tool again with your chatId:',
              '   bags_notify_telegram action=setup chatId=YOUR_CHAT_ID',
              '',
              'Example: bags_notify_telegram action=setup chatId=123456789',
            ].join('\\n'),
          });
        }

        const result = await bagsClient.manageTelegram(input.action, input.chatId);

        if (!result.success) {
          return formatError(result.error || 'Telegram operation failed');
        }

        return formatSuccess({
          action: input.action,
          result: result.response,
        });
      }

      case 'bags_notify_discord': {
        const input = NotifyDiscordInputSchema.parse(args);

        if (input.action === 'setup' && !input.webhookUrl) {
          return formatSuccess({
            status: 'setup_required',
            instructions: [
              '🎮 DISCORD SETUP',
              '',
              '1. Go to your Discord server settings',
              '2. Click Integrations → Webhooks → New Webhook',
              '3. Name it "BAGSX Alerts" and choose a channel',
              '4. Copy the Webhook URL',
              '5. Run this tool again with your webhookUrl:',
              '',
              'Example:',
              'bags_notify_discord action=setup webhookUrl=https://discord.com/api/webhooks/...',
            ].join('\\n'),
          });
        }

        const result = await bagsClient.manageDiscord(input.action, input.webhookUrl);

        if (!result.success) {
          return formatError(result.error || 'Discord operation failed');
        }

        return formatSuccess({
          action: input.action,
          result: result.response,
        });
      }

      case 'bags_notification_settings': {
        const input = NotificationSettingsInputSchema.parse(args);
        const result = await bagsClient.manageNotificationSettings({
          action: input.action,
          priceAlerts: input.priceAlerts,
          whaleAlerts: input.whaleAlerts,
          tradeConfirmations: input.tradeConfirmations,
          newLaunches: input.newLaunches,
          portfolioDaily: input.portfolioDaily,
        });

        if (!result.success) {
          return formatError(result.error || 'Failed to manage notification settings');
        }

        return formatSuccess({
          action: input.action,
          settings: result.response?.settings,
          message: input.action === 'update'
            ? 'Notification settings updated'
            : 'Current notification settings',
        });
      }

      default:
        return formatError(`Unknown tool: ${toolName}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      return formatError(error.message);
    }
    return formatError('An unexpected error occurred');
  }
}
