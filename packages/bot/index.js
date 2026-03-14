const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
require('dotenv').config();

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

if (!TOKEN) {
  console.error('TELEGRAM_BOT_TOKEN is required');
  process.exit(1);
}

const bot = new TelegramBot(TOKEN, { polling: true });

// Store user sessions
const users = new Map();

// Helper functions
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
        { text: '❓ Help', callback_data: 'help' }
      ]
    ]
  };

  bot.sendMessage(chatId, '🤖 *AgentsCoinLaunchers Bot*', {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  });
};

// Bot commands
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  users.set(userId, { chatId, username: msg.from.username });
  
  bot.sendMessage(chatId, `Welcome to AgentsCoinLaunchers, ${msg.from.first_name}! 🚀\n\nUse /help to see all commands.`);
  sendMenu(chatId);
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const helpText = `
*Available Commands:*

🚀 /launch - Launch a new token (0.055 SOL minimum)
🔄 /swap - Swap tokens
💼 /wallet - Check your wallet balance
📚 /skills - Browse available skills
💰 /claim - Claim your fees
⚙️ /settings - Configure your settings
📜 /history - View transaction history

*Quick Actions:*
• Tap buttons below for quick access
• Fees: 70% to you, 30% to platform
• Minimum launch fee: 0.055 SOL
  `;
  
  bot.sendMessage(chatId, helpText, { parse_mode: 'Markdown' });
});

bot.onText(/\/launch/, (msg) => {
  const chatId = msg.chat.id;
  
  const keyboard = {
    inline_keyboard: [
      [
        { text: 'Yes, Launch Token (0.055 SOL)', callback_data: 'confirm_launch' },
        { text: 'Cancel', callback_data: 'cancel' }
      ]
    ]
  };
  
  bot.sendMessage(chatId, '🚀 *Token Launch*\n\nCost: 0.055 SOL\nFee Split: 70% to you / 30% to platform\n\nReady to proceed?', {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  });
});

bot.onText(/\/swap/, (msg) => {
  const chatId = msg.chat.id;
  
  const keyboard = {
    inline_keyboard: [
      [
        { text: 'SOL → USDC', callback_data: 'swap_sol_usdc' },
        { text: 'USDC → SOL', callback_data: 'swap_usdc_sol' }
      ],
      [
        { text: 'Cancel', callback_data: 'cancel' }
      ]
    ]
  };
  
  bot.sendMessage(chatId, '🔄 *Token Swap*\n\nSelect swap direction:', {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  });
});

bot.onText(/\/wallet/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  // Mock wallet data
  const walletData = {
    balance: '150.5 SOL',
    tokens: '3 tokens',
    fees: '45.2 SOL'
  };
  
  const response = `
💼 *Wallet Information*

💰 Balance: ${walletData.balance}
🪙 Tokens: ${walletData.tokens}
💵 Fees Earned: ${walletData.fees}

Use /claim to withdraw fees.
  `;
  
  bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });
});

bot.onText(/\/skills/, (msg) => {
  const chatId = msg.chat.id;
  
  const skills = [
    { name: 'Token Launcher', desc: 'Launch new tokens' },
    { name: 'Token Swapper', desc: 'Swap tokens' },
    { name: 'Fee Claimer', desc: 'Claim fees' },
    { name: 'Price Analyzer', desc: 'Analyze prices' }
  ];
  
  let response = '📚 *Available Skills*\n\n';
  skills.forEach((skill, i) => {
    response += `${i + 1}. *${skill.name}*\n   ${skill.desc}\n\n`;
  });
  
  response += 'Visit the website to copy skills for Claude agents.';
  
  bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });
});

bot.onText(/\/claim/, (msg) => {
  const chatId = msg.chat.id;
  
  const keyboard = {
    inline_keyboard: [
      [
        { text: 'Claim All Fees', callback_data: 'claim_all' },
        { text: 'Cancel', callback_data: 'cancel' }
      ]
    ]
  };
  
  bot.sendMessage(chatId, '💰 *Claim Fees*\n\nAvailable: 45.2 SOL\n\nClaim all fees to your wallet?', {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  });
});

bot.onText(/\/settings/, (msg) => {
  const chatId = msg.chat.id;
  
  const keyboard = {
    inline_keyboard: [
      [
        { text: 'Set Fee Receiver', callback_data: 'set_receiver' },
        { text: 'View Settings', callback_data: 'view_settings' }
      ],
      [
        { text: 'Cancel', callback_data: 'cancel' }
      ]
    ]
  };
  
  bot.sendMessage(chatId, '⚙️ *Settings*\n\nConfigure your fee receiver wallet:', {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  });
});

bot.onText(/\/history/, (msg) => {
  const chatId = msg.chat.id;
  
  const history = [
    { type: 'Launch', token: 'MYTOKEN', amount: '0.055 SOL', date: '2024-01-15' },
    { type: 'Swap', token: 'SOL→USDC', amount: '10 SOL', date: '2024-01-14' },
    { type: 'Claim', token: 'SOL', amount: '5.2 SOL', date: '2024-01-13' }
  ];
  
  let response = '📜 *Transaction History*\n\n';
  history.forEach(tx => {
    response += `• ${tx.date} - *${tx.type}*\n  ${tx.token}: ${tx.amount}\n\n`;
  });
  
  bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });
});

// Callback queries
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  
  bot.answerCallbackQuery(query.id);
  
  switch(data) {
    case 'launch':
      bot.sendMessage(chatId, 'Use /launch command to start token launch.');
      break;
      
    case 'swap':
      bot.sendMessage(chatId, 'Use /swap command to swap tokens.');
      break;
      
    case 'wallet':
      bot.sendMessage(chatId, 'Use /wallet command to check balance.');
      break;
      
    case 'skills':
      bot.sendMessage(chatId, 'Use /skills command to browse skills.');
      break;
      
    case 'claim':
      bot.sendMessage(chatId, 'Use /claim command to claim fees.');
      break;
      
    case 'settings':
      bot.sendMessage(chatId, 'Use /settings command to configure.');
      break;
      
    case 'history':
      bot.sendMessage(chatId, 'Use /history command to view history.');
      break;
      
    case 'help':
      bot.sendMessage(chatId, 'Use /help to see all commands.');
      break;
      
    case 'confirm_launch':
      bot.sendMessage(chatId, '✅ Token launch confirmed!\n\nPlease send 0.055 SOL to:\n`Dgk9bcm6H6LVaamyXQWeNCXh2HuTFoE4E7Hu7Pw1aiPx`\n\nReply with transaction hash when done.', { parse_mode: 'Markdown' });
      break;
      
    case 'cancel':
      bot.sendMessage(chatId, 'Operation cancelled.');
      break;
      
    default:
      if (data.startsWith('swap_')) {
        bot.sendMessage(chatId, `🔄 Swap initiated: ${data.replace('swap_', '')}\n\nVisit the website to complete the swap.`);
      }
  }
});

// Handle transaction hash replies
bot.on('message', (msg) => {
  if (msg.reply_to_message && msg.reply_to_message.text.includes('Reply with transaction hash')) {
    const chatId = msg.chat.id;
    const txHash = msg.text.trim();
    
    if (txHash.length > 10) {
      bot.sendMessage(chatId, `✅ Transaction received!\n\nHash: ${txHash}\n\nToken will be deployed shortly. Check your dashboard for updates.`);
    }
  }
});

console.log('🤖 AgentsCoinLaunchers Bot is running...');
console.log(`API URL: ${API_URL}`);
