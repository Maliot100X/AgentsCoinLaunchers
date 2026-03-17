# 🤖 AgentsCoinLaunchers Telegram Bot - Complete Package

This is the complete, production-ready Telegram bot for AgentsCoinLaunchers token launcher platform.

## 📦 What's Included

```
packages/bot/
├── index.js                      # Main bot code (1400+ lines, fully featured)
├── package.json                  # Dependencies
├── .env.example                  # Configuration template
├── SETUP.sh                      # Interactive setup script
├── DEPLOY.sh                     # One-command deployment for SSH/Linux
├── SETUP_INSTRUCTIONS.md         # Detailed setup guide
├── BOT_FEATURES.md              # Complete feature documentation
└── README.md                     # This file
```

## 🚀 Quick Start (3 Steps)

### 1. Prerequisites
```bash
# You need:
- Node.js 14+ 
- npm
- Telegram account
- Solana wallet
- MongoDB Atlas account (free tier OK)
```

### 2. Setup
```bash
# Clone or extract bot files
cd packages/bot

# Copy environment template
cp .env.example .env

# Edit with your credentials
nano .env
```

### 3. Run
```bash
# Install dependencies
npm install

# Start bot
npm start
# or for 24/7 uptime:
pm2 start index.js --name "agentscoinlaunchers-bot"
```

## 🔧 Configuration (.env)

Required environment variables:

```env
TELEGRAM_BOT_TOKEN=YOUR_TOKEN          # From @BotFather
TELEGRAM_CHANNEL_ID=-1001234567890     # From @userinfobot  
MONGODB_URI=mongodb+srv://...          # MongoDB Atlas
BAGS_API_KEY=bags_prod_...             # From bags.fm
PLATFORM_WALLET_ADDRESS=...            # Your Solana wallet
NEXT_PUBLIC_API_URL=http://localhost:3001  # API endpoint
```

## 🎮 Bot Commands

| Command | Description |
|---------|-------------|
| `/start` | Main menu |
| `/help` | Help & documentation |
| `/launch` | Launch new token |
| `/wallet` | Check wallet info |
| `/settings` | Configure fee wallet |
| `/history` | View transactions |
| `/claim` | Claim earned fees |
| `/swap` | Swap tokens |
| `/selflaunch` | Direct token launch |
| `/skills` | View AI skills |

## 💰 Fee Structure

- **User earns:** 70% of launch fees
- **Platform earns:** 30% of launch fees
- **Automatic transfer** to configured wallets
- **Real-time tracking** in MongoDB

## 📊 Features

✅ **Complete Token Launch**
- Create SPL tokens on Solana
- Configure name, symbol, supply
- Set fee receiver wallet
- Instant verification on Solscan

✅ **Fee Management**
- Real-time fee tracking
- Claim accumulated fees
- View fee receiver settings
- Transaction history

✅ **Wallet Integration**
- Solana wallet verification
- Transaction verification
- Balance checking
- Direct fee transfers

✅ **User Sessions**
- Per-user state management
- Session persistence
- Multi-wallet support
- Secure data storage

✅ **MongoDB Integration**
- User account management
- Transaction history
- Token registry
- Fee tracking

✅ **Error Handling**
- Graceful error recovery
- User-friendly messages
- Detailed logging
- Automatic retry logic

## 🛡️ Security

- ✅ Environment variables for all secrets
- ✅ Input validation for all user data
- ✅ Transaction verification on Solscan
- ✅ MongoDB connection pooling
- ✅ Rate limiting ready
- ✅ User session management
- ✅ Wallet verification

⚠️ **Keep .env file SECRET!**
- Never commit .env to git
- Add to .gitignore
- Use strong MongoDB passwords
- Rotate API keys regularly

## 🚀 Deploy to SSH/Hermes (24/7)

### Option 1: Automated Deploy
```bash
# On your SSH server:
sudo bash DEPLOY.sh
```

### Option 2: Manual Deploy
```bash
# 1. Install Node.js & PM2
sudo apt-get update
sudo apt-get install -y nodejs npm
sudo npm install -g pm2

# 2. Clone repo
git clone https://github.com/Maliot100X/AgentsCoinLaunchers.git
cd AgentsCoinLaunchers/packages/bot

# 3. Setup
cp .env.example .env
nano .env  # Edit with your credentials

# 4. Start
npm install
pm2 start index.js --name "agentscoinlaunchers-bot"
pm2 startup   # Auto-start on reboot
pm2 save
```

### Option 3: With Git Pull (Recommended)
```bash
# Update and restart bot
cd /opt/agentscoinlaunchers-bot
git pull origin master
npm install
pm2 restart agentscoinlaunchers-bot
```

## 📊 Monitoring

```bash
# View status
pm2 status

# Watch logs in real-time
pm2 logs agentscoinlaunchers-bot

# Monitor resources
pm2 monit

# Restart if crashed
pm2 restart agentscoinlaunchers-bot

# View error logs
pm2 logs agentscoinlaunchers-bot --err
```

## 🔍 Troubleshooting

### Bot won't start
```bash
# Check Node version
node --version  # Need 14+

# Check dependencies
npm list

# Check env file
cat .env | grep TOKEN

# View error logs
pm2 logs agentscoinlaunchers-bot --err
```

### MongoDB connection failed
- Verify connection string in .env
- Check IP whitelist in MongoDB Atlas
- Ensure credentials are correct
- Test connection: `mongosh "your-uri"`

### Telegram not responding
- Verify bot token in @BotFather
- Check polling is enabled (default)
- Restart bot: `pm2 restart agentscoinlaunchers-bot`
- View logs: `pm2 logs agentscoinlaunchers-bot`

### Solana transaction verification fails
- Check Solscan API availability
- Verify transaction hash format
- Check RPC endpoint connectivity
- Increase timeout in code if needed

## 📈 Analytics

Bot automatically tracks:
- Tokens launched per user
- Total fees earned
- Transaction history
- User activity timestamps
- Wallet addresses
- Fee receivers

Access data via:
1. **MongoDB** - Raw collections
2. **Bot commands** - `/history`, `/wallet`
3. **Web dashboard** - See statistics tab

## 🔐 Production Checklist

- [ ] .env configured with real credentials
- [ ] TELEGRAM_BOT_TOKEN valid and not shared
- [ ] MongoDB URI correct and password strong
- [ ] BAGS_API_KEY configured
- [ ] PLATFORM_WALLET_ADDRESS set
- [ ] PM2 installed and configured
- [ ] Bot runs with `pm2 start`
- [ ] `pm2 startup` configured
- [ ] `pm2 save` run to persist config
- [ ] Logs monitored regularly
- [ ] Backups scheduled for MongoDB
- [ ] HTTPS used for all API calls (production)

## 📞 Support

- **GitHub Issues:** https://github.com/Maliot100X/AgentsCoinLaunchers/issues
- **Telegram Bot Creator:** @BotFather
- **MongoDB Help:** https://docs.mongodb.com
- **Solana Docs:** https://docs.solana.com

## 📄 File Reference

### index.js (1449 lines)
Main bot file containing:
- TelegramBot initialization
- User session management
- Command handlers (/start, /launch, etc.)
- Callback query handlers (buttons)
- MongoDB integration
- Solana transaction verification
- Fee tracking and claims
- Error handling and logging

### Key Functions:
```javascript
sendMenu()                      // Display main menu
getOrCreateSession()            // Session management
verifyTransaction()             // Solscan verification
registerOrUpdateUser()          // User registration
launchToken()                   // Token creation
getUserWallet()                 // Wallet lookup
getUserTransactions()           // Transaction history
```

### Key Event Handlers:
```javascript
bot.onText(/\/start/)          // Start command
bot.onText(/\/launch/)         // Launch token
bot.on('callback_query')       // Button clicks
bot.on('message')              // Text messages
bot.on('polling_error')        // Error handling
```

## 🎯 Next Steps

1. **Configure .env** with your credentials
2. **Install dependencies:** `npm install`
3. **Test locally:** `npm start`
4. **Deploy to SSH:** Use DEPLOY.sh or manual steps
5. **Monitor with PM2:** `pm2 logs`, `pm2 monit`
6. **Test in Telegram:** Send `/start` to bot

---

**Ready to launch tokens with your Telegram bot! 🚀**

For detailed setup, see: SETUP_INSTRUCTIONS.md
For all features, see: BOT_FEATURES.md

