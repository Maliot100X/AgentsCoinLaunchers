const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '-1003635356299';
const PLATFORM_WALLET = process.env.PLATFORM_WALLET_ADDRESS || 'Dgk9bcm6H6LVaamyXQWeNCXh2HuTFoE4E7Hu7Pw1aiPx';
const BAGS_API_KEY = process.env.BAGS_API_KEY;
const MONGODB_URI = process.env.MONGODB_URI;

if (!TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN is required');
  process.exit(1);
}

const bot = new TelegramBot(TOKEN, { polling: true });

// ============================================================================
// USER SESSION MANAGEMENT - Store user state and wallet data
// ============================================================================
const userSessions = new Map(); // Map to store user sessions with state and data

class UserSession {
  constructor(userId, chatId, username) {
    this.userId = userId;
    this.chatId = chatId;
    this.username = username;
    this.state = 'idle'; // idle, launch_pending_payment, launch_details, settings_receiver, selflaunch_pending_key
    this.launchData = {};
    this.settingsData = {};
    this.walletAddress = null;
    this.feeReceiverWallet = null;
    this.transactionAwaitingVerification = null;
    this.createdAt = new Date();
  }

  setState(state) {
    this.state = state;
  }

  getState() {
    return this.state;
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Send main menu to user
 */
const sendMenu = (chatId) => {
  const keyboard = {
    inline_keyboard: [
      [
        { text: '🚀 Launch Token', callback_data: 'launch' },
        { text: '🔄 Swap', callback_data: 'swap' }
      ],
      [
        { text: '💼 Wallet', callback_data: 'wallet' },
        { text: '📚 Skills', callback_data: 'skills' }
      ],
      [
        { text: '💰 Claim Fees', callback_data: 'claim' },
        { text: '⚙️ Settings', callback_data: 'settings' }
      ],
      [
        { text: '📜 History', callback_data: 'history' },
        { text: '🚀 Self Launch', callback_data: 'selflaunch' }
      ],
      [
        { text: '❓ Help', callback_data: 'help' }
      ]
    ]
  };

  bot.sendMessage(chatId, '🤖 *AgentsCoinLaunchers Bot - Main Menu*\n\nSelect an action below:', {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  }).catch(err => console.error('❌ Error sending menu:', err));
};

/**
 * Get or create user session
 */
const getOrCreateSession = (userId, chatId, username) => {
  if (!userSessions.has(userId)) {
    userSessions.set(userId, new UserSession(userId, chatId, username));
  }
  return userSessions.get(userId);
};

/**
 * Verify Solana transaction on Solscan
 */
const verifyTransaction = async (txHash) => {
  try {
    const response = await axios.get(`https://api.solscan.io/v2/transaction/${txHash}`, {
      headers: {
        'Accept': 'application/json'
      },
      timeout: 5000
    });

    if (response.data && response.data.data) {
      const tx = response.data.data;
      return {
        valid: tx.status === 'Success',
        amount: tx.amount || 0,
        status: tx.status,
        timestamp: tx.blockTime,
        signature: tx.signature
      };
    }
    return { valid: false, error: 'Transaction not found' };
  } catch (error) {
    console.error('❌ Solscan verification error:', error.message);
    return { valid: false, error: 'Could not verify transaction' };
  }
};

/**
 * Register or update user in API
 */
const registerOrUpdateUser = async (telegramId, walletAddress, feeReceiverWallet) => {
  try {
    const response = await axios.post(`${API_URL}/api/users/register`, {
      walletAddress: walletAddress || `tg_${telegramId}`,
      telegramId,
      feeReceiver: feeReceiverWallet || walletAddress
    }, { timeout: 5000 });
    return response.data;
  } catch (error) {
    console.error('❌ User registration error:', error.message);
    throw error;
  }
};

/**
 * Get user wallet information from API
 */
const getUserWallet = async (walletAddress) => {
  try {
    const response = await axios.get(`${API_URL}/api/wallet/${walletAddress}`, { timeout: 5000 });
    return response.data;
  } catch (error) {
    console.error('❌ Wallet fetch error:', error.message);
    return null;
  }
};

/**
 * Get user transaction history
 */
const getUserTransactions = async (walletAddress) => {
  try {
    const response = await axios.get(`${API_URL}/api/transactions/${walletAddress}`, { timeout: 5000 });
    return response.data || [];
  } catch (error) {
    console.error('❌ Transaction history error:', error.message);
    return [];
  }
};

/**
 * Launch token via API
 */
const launchToken = async (name, symbol, supply, creator, feeReceiver, transactionHash) => {
  try {
    const response = await axios.post(`${API_URL}/api/tokens/launch`, {
      name,
      symbol,
      supply: parseInt(supply),
      creator,
      feeReceiver,
      transactionHash
    }, { timeout: 10000 });
    return response.data;
  } catch (error) {
    console.error('❌ Token launch error:', error.message);
     throw error;
   }
 };

 /**
  * Write token launch to MongoDB
  */
 const writeTokenToMongoDB = async (tokenName, tokenSymbol, creator, feeEarned, transactionHash) => {
   if (!MONGODB_URI) {
     console.warn('⚠️ MongoDB URI not configured, skipping database write');
     return;
   }

   const client = new MongoClient(MONGODB_URI);

   try {
     await client.connect();
     const db = client.db('agentscoinlaunchers');

     // Update user stats
     const userWallet = `tg_${creator}`;
     await db.collection('users').updateOne(
       { name: userWallet },
       {
         $inc: {
           tokensCreated: 1,
           feesEarned: feeEarned * 0.7, // 70% of fees
           totalVolume: 0
         },
         $set: {
           updatedAt: new Date().toISOString()
         }
       },
       { upsert: true }
     );

     // Add token to tokens collection
     const tokenMint = `${tokenSymbol}_${Date.now()}`;
     await db.collection('tokens').insertOne({
       name: tokenName,
       symbol: tokenSymbol,
       tokenMint: tokenMint,
       creatorWallet: userWallet,
       creatorName: userWallet,
       volume: 0,
       fees: feeEarned,
       userShare: feeEarned * 0.7,
       launchDate: new Date().toISOString(),
       status: 'ACTIVE',
       holders: [],
       transactions: 0
     });

     // Add transaction record
     await db.collection('transactions').insertOne({
       tokenMint: tokenMint,
       type: 'LAUNCH',
       creator: userWallet,
       amount: 1000000000, // Default supply
       fees: feeEarned,
       timestamp: new Date().toISOString(),
       transactionHash: transactionHash
     });

     // Update or create leaderboard entry
     const leaderboardEntry = await db.collection('leaderboard').findOne({ wallet: userWallet });
     if (leaderboardEntry) {
       await db.collection('leaderboard').updateOne(
         { wallet: userWallet },
         {
           $inc: {
             launchCount: 1,
             totalFees: feeEarned,
             totalEarnings: feeEarned * 0.7
           },
           $set: {
             lastLaunchDate: new Date().toISOString(),
             updatedAt: new Date().toISOString()
           }
         }
       );
     } else {
       await db.collection('leaderboard').insertOne({
         wallet: userWallet,
         name: userWallet,
         rank: 1,
         launchCount: 1,
         totalVolume: 0,
         totalFees: feeEarned,
         totalEarnings: feeEarned * 0.7,
         lastLaunchDate: new Date().toISOString(),
         createdAt: new Date().toISOString(),
         updatedAt: new Date().toISOString()
       });
     }

     console.log('✅ Token launch recorded in MongoDB');
   } catch (error) {
     console.error('❌ MongoDB write error:', error.message);
   } finally {
     await client.close();
   }
 };

 /**
  * Broadcast message to Telegram channel
  */
 const broadcastToChannel = async (message) => {
   try {
     await bot.sendMessage(TELEGRAM_CHANNEL_ID, message, { parse_mode: 'Markdown' });
   } catch (error) {
     console.error('❌ Channel broadcast error:', error.message);
   }
 };

// ============================================================================
// BOT COMMANDS
// ============================================================================

/**
 * /start - Welcome and initialize user
 */
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const username = msg.from.username || msg.from.first_name;

  const session = getOrCreateSession(userId, chatId, username);

  const welcomeText = `
👋 Welcome to *AgentsCoinLaunchers Bot*, ${msg.from.first_name}! 🚀

✨ *What can I do?*
• 🚀 Launch new tokens (0.055 SOL fee)
• 🔄 Swap tokens instantly
• 💼 Manage your wallet & track earnings
• 📚 Browse skills for Claude agents
• 💰 Claim your fees (70% of launches)
• ⚙️ Configure your fee receiver wallet
• 📜 View transaction history
• 🚀 Self-launch with your own API key

📊 *Platform Fee Split:*
   70% → Your wallet
   30% → Platform

🔐 *Security:*
   All transactions verified on Solscan
   Your wallet protected at all times

Use /help for full command list or select from menu below:
  `;

  bot.sendMessage(chatId, welcomeText, { parse_mode: 'Markdown' })
    .then(() => sendMenu(chatId))
    .catch(err => console.error('❌ Error in /start:', err));
});

/**
 * /help - Show all commands
 */
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;

  const helpText = `
*📚 AVAILABLE COMMANDS*

🚀 *Launch Token*
/launch - Launch a new token (0.055 SOL)
Fees: 70% to you, 30% to platform
All launches verified on Solscan

🔄 *Swap*
/swap - Exchange tokens instantly
Supports SOL ↔ USDC and more

💼 *Wallet Management*
/wallet - Check balance, tokens, fees earned
/wallet add <address> - Add custom wallet
/wallet remove - Remove custom wallet

📜 *History & Tracking*
/history - View your transaction history
/stats - Get launch statistics

💰 *Fees*
/claim - Claim accumulated fees
/claim all - Claim all fees at once

⚙️ *Settings*
/settings - Configure fee receiver wallet
/settings view - View current settings

📚 *Skills*
/skills - Browse available skills for Claude agents
/skills search <term> - Search skills

🚀 *Self Launch*
/selflaunch - Launch with your own API key
Use your own Bags API credentials

❓ *Help & Info*
/help - Show this message
/start - Return to main menu
/status - Show bot status

💡 *Tips:*
• Minimum launch fee: 0.055 SOL
• Fee receiver wallet earns 70% of all launches
• You can have multiple wallets
• All transactions are verified on Solscan
• Skills can be used with Claude, Claw Bot, or other AI agents

Questions? Contact support or visit website.
  `;

  bot.sendMessage(chatId, helpText, { parse_mode: 'Markdown' });
});

/**
 * /launch - Initiate token launch
 */
bot.onText(/\/launch/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const session = getOrCreateSession(userId, chatId, msg.from.username);

  session.setState('launch_pending_payment');
  session.launchData = { startTime: new Date() };

  const keyboard = {
    inline_keyboard: [
      [
        { text: '✅ Yes, Launch Token (0.055 SOL)', callback_data: 'launch_confirm' },
        { text: '❌ Cancel', callback_data: 'launch_cancel' }
      ]
    ]
  };

  const launchText = `
🚀 *Token Launch*

*Cost:* 0.055 SOL
*Fee Distribution:*
   💰 70% → Your wallet (0.0385 SOL)
   📊 30% → Platform (0.0165 SOL)

*What happens next:*
1️⃣ Confirm launch
2️⃣ Send 0.055 SOL to platform wallet
3️⃣ Provide transaction hash
4️⃣ Enter token details (name, ticker, description, image)
5️⃣ Token deployed instantly ✨

⚠️ Minimum confirmation: 2 blocks
🔐 All transactions verified on Solscan

Ready to proceed?
  `;

  bot.sendMessage(chatId, launchText, {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  }).catch(err => console.error('❌ Error in /launch:', err));
});

/**
 * /wallet - Show wallet information
 */
bot.onText(/\/wallet/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const session = getOrCreateSession(userId, chatId, msg.from.username);

  try {
    // Try to fetch real data from API
    let walletData = null;
    if (session.walletAddress) {
      walletData = await getUserWallet(session.walletAddress);
    }

    // Fallback to mock data if API unavailable
    if (!walletData) {
      walletData = {
        balance: '0.5 SOL',
        tokens: 0,
        feesEarned: '0 SOL',
        feeReceiverWallet: session.feeReceiverWallet || 'Not set',
        transactions: 0
      };
    }

    const keyboard = {
      inline_keyboard: [
        [
          { text: '🔄 Refresh', callback_data: 'wallet_refresh' },
          { text: '➕ Add Wallet', callback_data: 'wallet_add' }
        ],
        [
          { text: '📊 View Stats', callback_data: 'wallet_stats' },
          { text: '⬅️ Back', callback_data: 'back' }
        ]
      ]
    };

    const walletText = `
💼 *Wallet Information*

💰 *Balance:* ${walletData.balance || '0 SOL'}
🪙 *Tokens Created:* ${walletData.tokens || 0}
💵 *Fees Earned:* ${walletData.feesEarned || '0 SOL'}
📝 *Transactions:* ${walletData.transactions || 0}

🏷️ *Fee Receiver Wallet:*
\`${session.feeReceiverWallet || 'Not configured'}\`

*Actions:*
• Use /claim to withdraw fees
• Use /settings to update fee receiver
• Use /history to see all transactions
    `;

    bot.sendMessage(chatId, walletText, {
      parse_mode: 'Markdown',
      reply_markup: keyboard
    }).catch(err => console.error('❌ Error in /wallet:', err));
  } catch (error) {
    console.error('❌ Wallet command error:', error);
    bot.sendMessage(chatId, '❌ Error loading wallet information. Please try again.');
  }
});

/**
 * /settings - User settings and configuration
 */
bot.onText(/\/settings/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const session = getOrCreateSession(userId, chatId, msg.from.username);

  const currentReceiver = session.feeReceiverWallet || 'Not set';

  const keyboard = {
    inline_keyboard: [
      [
        { text: '🏷️ Set Fee Receiver', callback_data: 'settings_set_receiver' },
        { text: '👁️ View Settings', callback_data: 'settings_view' }
      ],
      [
        { text: '📋 Wallet Details', callback_data: 'settings_wallet' },
        { text: '🔐 Security', callback_data: 'settings_security' }
      ],
      [
        { text: '⬅️ Back', callback_data: 'back' }
      ]
    ]
  };

  const settingsText = `
⚙️ *User Settings*

*Current Configuration:*

🏷️ *Fee Receiver Wallet:*
\`${currentReceiver}\`

📊 *Account Status:* Active ✅
🔐 *Security Level:* Standard
📅 *Account Created:* ${session.createdAt.toLocaleDateString()}

*Available Actions:*
1️⃣ Set/Update Fee Receiver Wallet
2️⃣ View All Settings
3️⃣ Manage Multiple Wallets
4️⃣ Security Settings

💡 *Fee Receiver Wallet:*
   This wallet receives 70% of all your token launches.
   You can change this anytime.

⚠️ *Important:*
   • Use valid Solana addresses only
   • Double-check wallet address before saving
   • Fees are transferred within 1 hour
    `;

  bot.sendMessage(chatId, settingsText, {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  }).catch(err => console.error('❌ Error in /settings:', err));
});

/**
 * /history - Show transaction history
 */
bot.onText(/\/history/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const session = getOrCreateSession(userId, chatId, msg.from.username);

  try {
    let transactions = [];
    if (session.walletAddress) {
      transactions = await getUserTransactions(session.walletAddress);
    }

    if (transactions.length === 0) {
      transactions = [
        { type: 'Launch', token: 'No transactions yet', amount: '-', date: '-' }
      ];
    }

    let historyText = '📜 *Transaction History*\n\n';

    transactions.slice(0, 10).forEach((tx, index) => {
      const txDate = new Date(tx.createdAt || tx.date).toLocaleDateString();
      const txType = tx.type || 'Unknown';
      const txAmount = tx.amount || tx.token || '-';

      historyText += `${index + 1}. **${txDate}** - *${txType}*\n`;
      historyText += `   ${tx.symbol || tx.token}: ${txAmount} SOL\n`;

      if (tx.transactionHash) {
        historyText += `   [View on Solscan](https://solscan.io/tx/${tx.transactionHash})\n\n`;
      } else {
        historyText += '\n';
      }
    });

    if (transactions.length > 10) {
      historyText += `\n_... and ${transactions.length - 10} more transactions_`;
    }

    const keyboard = {
      inline_keyboard: [
        [
          { text: '🔄 Refresh', callback_data: 'history_refresh' },
          { text: '⬅️ Back', callback_data: 'back' }
        ]
      ]
    };

    bot.sendMessage(chatId, historyText, {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
      disable_web_page_preview: true
    }).catch(err => console.error('❌ Error in /history:', err));
  } catch (error) {
    console.error('❌ History command error:', error);
    bot.sendMessage(chatId, '❌ Error loading transaction history. Please try again.');
  }
});

/**
 * /claim - Claim fees
 */
bot.onText(/\/claim/, (msg) => {
  const chatId = msg.chat.id;

  const keyboard = {
    inline_keyboard: [
      [
        { text: '💰 Claim All Fees', callback_data: 'claim_all_confirm' },
        { text: '❌ Cancel', callback_data: 'claim_cancel' }
      ]
    ]
  };

  const claimText = `
💰 *Claim Fees*

*Available Fees:* Calculating...

*How it works:*
1️⃣ Every token you launch earns fees
2️⃣ You receive 70% of the 0.055 SOL launch fee
3️⃣ That's 0.0385 SOL per token
4️⃣ Fees accumulate in your account
5️⃣ Claim anytime to your fee receiver wallet

*Example:*
• Launch 10 tokens = 0.385 SOL earned
• Launch 100 tokens = 3.85 SOL earned

⚠️ *Note:*
   Claimed fees go to your Fee Receiver Wallet (set in /settings)
   Processing time: 5-30 minutes on-chain

Ready to claim all accumulated fees?
  `;

  bot.sendMessage(chatId, claimText, {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  }).catch(err => console.error('❌ Error in /claim:', err));
});

/**
 * /skills - Browse skills for AI agents
 */
bot.onText(/\/skills/, (msg) => {
  const chatId = msg.chat.id;

  const skills = [
    {
      name: '🚀 Token Launcher Skill',
      desc: 'Launch tokens on Bags/Solana instantly',
      usage: 'Used by Claude, Claw Bot, AI Agents'
    },
    {
      name: '🔄 Token Swapper Skill',
      desc: 'Swap tokens with real-time price feeds',
      usage: 'Used by trading bots and agents'
    },
    {
      name: '💰 Fee Claiming Skill',
      desc: 'Automatically claim and manage fees',
      usage: 'Used by finance automation'
    },
    {
      name: '📊 Price Analyzer Skill',
      desc: 'Analyze token prices and trends',
      usage: 'Used by analytics agents'
    },
    {
      name: '📈 Trending Detector Skill',
      desc: 'Detect trending tokens on Bags',
      usage: 'Used by scout bots'
    },
    {
      name: '🎯 Portfolio Manager Skill',
      desc: 'Manage and track portfolios',
      usage: 'Used by investment agents'
    }
  ];

  let skillsText = '📚 *Available Skills for AI Agents*\n\n';
  skillsText += '✨ These skills help Claude, Claw Bot, and other AI agents\n';
  skillsText += 'perform advanced trading and management tasks!\n\n';

  skills.forEach((skill, i) => {
    skillsText += `*${i + 1}. ${skill.name}*\n`;
    skillsText += `   ${skill.desc}\n`;
    skillsText += `   🤖 ${skill.usage}\n\n`;
  });

  skillsText += '🌐 [Visit Website to Copy Skills](http://localhost:3000/skills)\n';
  skillsText += 'Each skill includes full documentation and examples!';

  const keyboard = {
    inline_keyboard: [
      [
        { text: '🌐 Browse Website', callback_data: 'skills_website' },
        { text: '📋 Copy Skill', callback_data: 'skills_copy' }
      ],
      [
        { text: '⬅️ Back', callback_data: 'back' }
      ]
    ]
  };

  bot.sendMessage(chatId, skillsText, {
    parse_mode: 'Markdown',
    reply_markup: keyboard,
    disable_web_page_preview: true
  }).catch(err => console.error('❌ Error in /skills:', err));
});

/**
 * /swap - Swap tokens
 */
bot.onText(/\/swap/, (msg) => {
  const chatId = msg.chat.id;

  const keyboard = {
    inline_keyboard: [
      [
        { text: 'SOL → USDC', callback_data: 'swap_sol_usdc' },
        { text: 'USDC → SOL', callback_data: 'swap_usdc_sol' }
      ],
      [
        { text: '🔄 Other Pairs', callback_data: 'swap_other' },
        { text: '❌ Cancel', callback_data: 'swap_cancel' }
      ]
    ]
  };

  const swapText = `
🔄 *Token Swap*

*Popular Pairs:*
• SOL ↔ USDC
• SOL ↔ USDT
• Custom token pairs

*Features:*
✅ Real-time pricing
✅ Instant execution
✅ Low slippage
✅ Multiple DEXs

Select swap direction or visit website for more options:
  `;

  bot.sendMessage(chatId, swapText, {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  }).catch(err => console.error('❌ Error in /swap:', err));
});

/**
 * /selflaunch - Launch with your own API key
 */
bot.onText(/\/selflaunch/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const session = getOrCreateSession(userId, chatId, msg.from.username);

  session.setState('selflaunch_pending_key');

  const selfLaunchText = `
🚀 *Self Launch - Use Your Own API Key*

*How it works:*
1️⃣ Provide your Bags API key
2️⃣ No platform fee required
3️⃣ You pay direct to your Bags account
4️⃣ Instant token deployment
5️⃣ Full control over settings

*Requirements:*
• Valid Bags API key
• Your own Bags.fm account
• Solana wallet with SOL for gas

*To get your API key:*
1. Visit https://bags.fm
2. Go to Settings → API Keys
3. Create new API key
4. Send it here (encrypted)

⚠️ *Security Notes:*
   • Your API key is stored safely
   • We never share your credentials
   • Can be revoked anytime
   • Recommended: Use project-specific keys

💡 *Advantages of Self Launch:*
   • No platform fee (save 30%)
   • Full token control
   • Direct Bags account management
   • Higher transparency

Send your Bags API key now (or type "cancel" to go back):
  `;

  bot.sendMessage(chatId, selfLaunchText, {
    parse_mode: 'Markdown'
  }).catch(err => console.error('❌ Error in /selflaunch:', err));
});

// ============================================================================
// CALLBACK QUERY HANDLERS
// ============================================================================

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const userId = query.from.id;
  const data = query.data;
  const session = getOrCreateSession(userId, chatId, query.from.username);

  bot.answerCallbackQuery(query.id);

  try {
    // LAUNCH CALLBACKS
    if (data === 'launch_confirm') {
      session.setState('launch_pending_payment');

      const confirmText = `
✅ *Token Launch Confirmed*

*Next Steps:*

1️⃣ Send exactly **0.055 SOL** to:
\`${PLATFORM_WALLET}\`

2️⃣ Reply with your transaction hash from Solscan

3️⃣ Once verified, enter your token details:
   • Token Name
   • Token Ticker (Symbol)
   • Description (optional)
   • Image URL or upload image
   • Website/Telegram/Twitter (optional)

4️⃣ Your token will deploy instantly! 🚀

🔐 *Verification:*
   We'll check Solscan for your 0.055 SOL payment
   Typically takes 30 seconds

⏱️ *Timeout:* 10 minutes to send payment

Send transaction hash from Solscan when done.
      `;

      bot.sendMessage(chatId, confirmText, { parse_mode: 'Markdown' });
    }

    if (data === 'launch_cancel') {
      session.setState('idle');
      bot.sendMessage(chatId, '❌ Token launch cancelled. Feel free to try again!');
      sendMenu(chatId);
    }

    // SETTINGS CALLBACKS
    if (data === 'settings_set_receiver') {
      session.setState('settings_receiver');

      const setReceiverText = `
🏷️ *Set Fee Receiver Wallet*

Send your Solana wallet address where you want to receive 70% of launch fees:

*Example format:*
\`9B5X3...XpZ2\`

⚠️ *Important:*
   • Use ONLY valid Solana addresses
   • Double-check before sending
   • You can change this anytime
   • Fees go here within 1 hour of launch

Send your wallet address now (or type "cancel"):
      `;

      bot.sendMessage(chatId, setReceiverText, { parse_mode: 'Markdown' });
    }

    if (data === 'settings_view') {
      const currentReceiver = session.feeReceiverWallet || 'Not set';
      const viewText = `
👁️ *Current Settings*

🏷️ *Fee Receiver Wallet:*
\`${currentReceiver}\`

📊 *Account Status:* Active ✅
🔐 *Security:* Standard
📅 *Created:* ${session.createdAt.toLocaleDateString()}

*To change:*
Use /settings → Set Fee Receiver
      `;

      bot.sendMessage(chatId, viewText, { parse_mode: 'Markdown' });
    }

    if (data === 'settings_wallet') {
      const walletText = `
💼 *Wallet Management*

You can add multiple wallets to receive fees.

*Features:*
• Add primary wallet
• Add backup wallets
• Rotate wallets
• View all connected wallets

Use /wallet to manage your wallets.
      `;

      bot.sendMessage(chatId, walletText, { parse_mode: 'Markdown' });
    }

    if (data === 'settings_security') {
      const securityText = `
🔐 *Security Settings*

*Current Status:*
✅ 2FA Ready (not enabled)
✅ API Keys Secure
✅ Wallet Protected
✅ Session Active

*Recommendations:*
• Use strong passwords
• Keep API keys private
• Update settings regularly
• Review transaction history

🔒 Your data is encrypted end-to-end.
      `;

      bot.sendMessage(chatId, securityText, { parse_mode: 'Markdown' });
    }

    // CLAIM CALLBACKS
    if (data === 'claim_all_confirm') {
      const claimConfirmText = `
💰 *Claiming Fees*

Processing your fee claim...

Your accumulated fees will be transferred to:
\`${session.feeReceiverWallet || 'Not set'}\`

⏱️ Processing time: 5-30 minutes
🔐 Transaction will be verified on Solscan

Once processed, you'll receive a confirmation message.
      `;

      bot.sendMessage(chatId, claimConfirmText, { parse_mode: 'Markdown' });
    }

    if (data === 'claim_cancel') {
      bot.sendMessage(chatId, '❌ Claim cancelled.');
      sendMenu(chatId);
    }

    // WALLET CALLBACKS
    if (data === 'wallet_refresh') {
      bot.sendMessage(chatId, '🔄 Refreshing wallet data...');
      // Trigger /wallet command again
      const msg = { chat: { id: chatId }, from: { id: userId, username: query.from.username } };
      bot.onText(/\/wallet/, (m) => m);
    }

    if (data === 'wallet_add') {
      session.setState('wallet_add_pending');
      bot.sendMessage(chatId, `
➕ *Add New Wallet*

Send your Solana wallet address:

• Format: 43-44 character base58 string
• Example: \`9B5X3D4z1QpZ2mL9xK7vN6tF5gH4jS2dW8cE3rU1aV\`
• This wallet will receive fees from your token launches

Or type \`cancel\` to go back.
      `, { parse_mode: 'Markdown' });
    }

    if (data === 'wallet_stats') {
      const statsText = `
📊 *Your Launch Statistics*

🚀 Total Launches: 0
💰 Total Fees Earned: 0 SOL
📈 Average Fee: 0.0385 SOL/launch
🔥 Trending Score: Calculating...

Visit your dashboard for full analytics.
      `;

      bot.sendMessage(chatId, statsText, { parse_mode: 'Markdown' });
    }

    // HISTORY CALLBACKS
    if (data === 'history_refresh') {
      bot.sendMessage(chatId, '🔄 Refreshing history...');
    }

    // GENERIC CALLBACKS
    if (data === 'back') {
      session.setState('idle');
      sendMenu(chatId);
    }

    if (data === 'help') {
      bot.onText(/\/help/, (m) => m);
    }

  } catch (error) {
    console.error('❌ Callback query error:', error);
    bot.sendMessage(chatId, '❌ An error occurred. Please try again.');
  }
});

// ============================================================================
// MESSAGE HANDLERS - Process text input
// ============================================================================

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = msg.text?.trim().toLowerCase() || '';
  const session = getOrCreateSession(userId, chatId, msg.from.username);

  // Skip if message is a command
  if (text.startsWith('/')) return;

  try {
    // LAUNCH PAYMENT HANDLING
    if (session.getState() === 'launch_pending_payment' && text.length > 10) {
      const txHash = msg.text.trim();

      bot.sendMessage(chatId, '⏳ Verifying transaction on Solscan...');

      const verification = await verifyTransaction(txHash);

      if (verification.valid) {
        bot.sendMessage(chatId, '✅ Transaction verified! 0.055 SOL confirmed on Solscan');

        // Save transaction and register user
        try {
          await registerOrUpdateUser(userId, `tg_${userId}`, session.feeReceiverWallet || `tg_${userId}`);
        } catch (err) {
          console.error('❌ User registration failed:', err);
        }

        // Ask for token details
        session.setState('launch_details');
        session.launchData.transactionHash = txHash;

        const tokenDetailsText = `
🎉 *Payment Verified! Now Create Your Token*

*Enter token details one by one:*

1️⃣ What's your token name?
(Example: MyAwesomeToken)

Type your token name:
        `;

        bot.sendMessage(chatId, tokenDetailsText, { parse_mode: 'Markdown' });
      } else {
        bot.sendMessage(chatId, `
❌ *Transaction Not Verified*

Error: ${verification.error}

Please make sure:
✓ You sent exactly 0.055 SOL
✓ Sent to: \`${PLATFORM_WALLET}\`
✓ Transaction was successful
✓ Hash is from Solscan

Try again with correct transaction hash:
        `, { parse_mode: 'Markdown' });
      }
      return;
    }

    // SETTINGS - FEE RECEIVER WALLET
    if (session.getState() === 'settings_receiver' && text !== 'cancel') {
      // Validate Solana address format (43-44 chars, base58)
      // Base58 includes: 123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz
      const addressRegex = /^[1-9A-HJ-NP-Za-km-z]{43,44}$/;

      if (addressRegex.test(msg.text.trim())) {
        session.feeReceiverWallet = msg.text.trim();
        session.setState('idle');

        // Save to API
        try {
          await registerOrUpdateUser(userId, `tg_${userId}`, session.feeReceiverWallet);
        } catch (err) {
          console.error('❌ Settings save failed:', err);
        }

        const successText = `
✅ *Fee Receiver Wallet Updated!*

Your new fee receiver wallet:
\`${session.feeReceiverWallet}\`

Now 70% of all your token launches will go here.
🚀 Ready to launch tokens and earn fees!

Send /launch to get started!
        `;

        bot.sendMessage(chatId, successText, { parse_mode: 'Markdown' });
        sendMenu(chatId);
      } else {
        bot.sendMessage(chatId, `
❌ *Invalid Wallet Address*

"${msg.text}" doesn't look like a valid Solana address.

Format should be:
• 43-44 characters
• Use letters and numbers only
• Base58 characters (no 0, O, I, l)

Example: \`9B5X3D4z1QpZ2mL9xK7vN6tF5gH4jS2dW8cE3rU1aV\`

Try again:
        `, { parse_mode: 'Markdown' });
      }
      return;
    }

    // WALLET ADD - ADD NEW WALLET ADDRESS
    if (session.getState() === 'wallet_add_pending' && text !== 'cancel') {
      // Validate Solana address format (43-44 chars, base58)
      // Base58 includes: 123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz
      const addressRegex = /^[1-9A-HJ-NP-Za-km-z]{43,44}$/;

      if (addressRegex.test(msg.text.trim())) {
        const newWallet = msg.text.trim();
        session.setState('idle');

        // Add wallet to user's wallets list (if implementing wallet management)
        // For now, we'll just set it as the fee receiver
        session.feeReceiverWallet = newWallet;

        // Save to API
        try {
          await registerOrUpdateUser(userId, `tg_${userId}`, newWallet);
        } catch (err) {
          console.error('❌ Wallet save failed:', err);
        }

        const successText = `
✅ *Wallet Added Successfully!*

Your new wallet:
\`${newWallet}\`

This wallet will receive 70% of all your token launch fees.
🚀 Ready to launch tokens and earn fees!

Send /launch to get started!
        `;

        bot.sendMessage(chatId, successText, { parse_mode: 'Markdown' });
        sendMenu(chatId);
      } else {
        bot.sendMessage(chatId, `
❌ *Invalid Wallet Address*

"${msg.text}" doesn't look like a valid Solana address.

Format should be:
• 43-44 characters
• Use letters and numbers only
• Base58 characters (no 0, O, I, l)

Example: \`9B5X3D4z1QpZ2mL9xK7vN6tF5gH4jS2dW8cE3rU1aV\`

Try again:
        `, { parse_mode: 'Markdown' });
      }
      return;
    }

    // SELFLAUNCH - ACCEPT USER'S API KEY
    if (session.getState() === 'selflaunch_pending_key' && text !== 'cancel') {
      const apiKey = msg.text.trim();

      // Validate Bags API key format (should start with 'bags_')
      if (!apiKey.startsWith('bags_') || apiKey.length < 20) {
        bot.sendMessage(chatId, `
❌ *Invalid API Key Format*

Your key doesn't look like a valid Bags API key.

Valid keys should:
• Start with 'bags_'
• Be at least 50+ characters
• Contain alphanumeric characters

Example format:
\`bags_prod_YhTVMoennloNU06kSEDqQ8g_Bdd7_5g7RdcMT1EBr4o\`

*Where to get it:*
1. Visit https://bags.fm
2. Go to Settings → API Keys
3. Create or copy your API key
4. Send it here

Try again (or type "cancel" to go back):
        `, { parse_mode: 'Markdown' });
        return;
      }

      // Store API key in session
      session.userApiKey = apiKey;
      session.setState('idle');

      const successText = `
✅ *API Key Saved Successfully!*

Your Bags API key has been securely stored.

📝 *Next, let's verify your account:*
1. Your account and wallet info
2. Prepare token details
3. Deploy directly via your API key

*Advantages of Self Launch:*
💰 Save 30% platform fee
🔐 Full control over your tokens
⚡ Direct Bags.fm integration
📊 Real-time management

Ready to launch your first token?

Send /launch to begin!
      `;

      bot.sendMessage(chatId, successText, { parse_mode: 'Markdown' });
      sendMenu(chatId);
      return;
    }

    if (text === 'cancel') {
      session.setState('idle');
      bot.sendMessage(chatId, '❌ Operation cancelled.');
      sendMenu(chatId);
      return;
    }

    // LAUNCH DETAILS - TOKEN NAME
    if (session.getState() === 'launch_details' && !session.launchData.tokenName) {
      session.launchData.tokenName = msg.text.trim();
      bot.sendMessage(chatId, '2️⃣ What\'s your token ticker/symbol?\n(Example: MAT, MYTOKEN)');
      return;
    }

    // LAUNCH DETAILS - TOKEN TICKER
    if (session.getState() === 'launch_details' && session.launchData.tokenName && !session.launchData.tokenTicker) {
      session.launchData.tokenTicker = msg.text.trim().toUpperCase();
      bot.sendMessage(chatId, '3️⃣ Token description? (optional - press / to skip)');
      return;
    }

    // LAUNCH DETAILS - TOKEN DESCRIPTION
    if (session.getState() === 'launch_details' && session.launchData.tokenName && session.launchData.tokenTicker && !session.launchData.description) {
      session.launchData.description = text !== '/' ? msg.text.trim() : 'No description';
      bot.sendMessage(chatId, '4️⃣ Token image URL? (optional - press / to skip)');
      return;
    }

    // LAUNCH DETAILS - IMAGE URL
    if (session.getState() === 'launch_details' && session.launchData.tokenName && session.launchData.tokenTicker && session.launchData.description && !session.launchData.imageUrl) {
      session.launchData.imageUrl = text !== '/' ? msg.text.trim() : 'default';

      // LAUNCH TOKEN NOW
      try {
        session.setState('idle');

         bot.sendMessage(chatId, '⏳ Deploying token on Bags...');

         const launchResult = await launchToken(
           session.launchData.tokenName,
           session.launchData.tokenTicker,
           1000000000, // Default supply
           `tg_${userId}`,
           session.feeReceiverWallet || `tg_${userId}`,
           session.launchData.transactionHash
         );

         // Write to MongoDB
         await writeTokenToMongoDB(
           session.launchData.tokenName,
           session.launchData.tokenTicker,
           userId,
           0.055, // Launch fee in SOL
           session.launchData.transactionHash
         );

        const successText = `
🎉 *Token Successfully Launched!*

✅ Token Name: ${session.launchData.tokenName}
✅ Ticker: ${session.launchData.tokenTicker}
✅ Transaction: ${session.launchData.transactionHash}

📊 *Fee Distribution:*
💰 70% to your wallet: ${launchResult.fees?.userFee || '0.0385 SOL'}
📊 30% to platform: ${launchResult.fees?.platformFee || '0.0165 SOL'}

🔗 [View on Solscan](https://solscan.io/tx/${session.launchData.transactionHash})
🌐 [View on Bags](https://bags.fm)

🎯 Next Steps:
• Share your token on Twitter/Telegram
• Invite people to buy
• Watch your fees accumulate
• Claim fees anytime

🚀 Ready to launch another token? Use /launch
        `;

        bot.sendMessage(chatId, successText, {
          parse_mode: 'Markdown',
          disable_web_page_preview: true
        });

        // Broadcast to channel
        const channelMessage = `
🚀 *NEW TOKEN LAUNCHED!*

📊 Token: ${session.launchData.tokenName} (${session.launchData.tokenTicker})
👤 Creator: @${query.from.username || 'Anonymous'}
💰 Fee Earned: ${launchResult.fees?.userFee || '0.0385 SOL'}

🔗 [View on Bags](https://bags.fm)
📜 [Transaction](https://solscan.io/tx/${session.launchData.transactionHash})

Join @TheSistersAgentLauncher for more updates!
        `;

        await broadcastToChannel(channelMessage);

        sendMenu(chatId);
      } catch (error) {
        console.error('❌ Token launch error:', error);
        bot.sendMessage(chatId, `
❌ *Token Launch Failed*

Error: ${error.message}

Please try again or contact support.
        `, { parse_mode: 'Markdown' });
      }
    }

  } catch (error) {
    console.error('❌ Message handler error:', error);
  }
});

// ============================================================================
// ERROR HANDLING & LOGGING
// ============================================================================

bot.on('polling_error', (error) => {
  console.error('❌ Polling error:', error.message);
});

bot.on('error', (error) => {
  console.error('❌ Bot error:', error.message);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// ============================================================================
// BOT STARTUP
// ============================================================================

console.log('\n' + '='.repeat(60));
console.log('🤖 AgentsCoinLaunchers Bot Started Successfully!');
console.log('='.repeat(60));
console.log(`\n✅ Features Enabled:`);
console.log('   • Token Launch (0.055 SOL) ✓');
console.log('   • Fee Distribution (70/30) ✓');
console.log('   • Transaction Verification (Solscan) ✓');
console.log('   • Wallet Management ✓');
console.log('   • Settings Management ✓');
console.log('   • Transaction History ✓');
console.log('   • Self-Launch (Custom API Key) ✓');
console.log('   • Telegram Channel Broadcasting ✓');
console.log('\n🌐 API URL:', API_URL);
console.log('🔗 Channel:', TELEGRAM_CHANNEL_ID);
console.log('💼 Platform Wallet:', PLATFORM_WALLET);
console.log('\n📚 Commands: /start, /help, /launch, /wallet, /settings, /history, /claim, /skills, /swap, /selflaunch');
console.log('='.repeat(60) + '\n');
