#!/bin/bash
################################################################################
# AgentsCoinLaunchers Telegram Bot - Complete Setup & Deployment Guide
# Run on SSH/Linux server 24/7 (Hermes or similar)
################################################################################

echo "🚀 AgentsCoinLaunchers Telegram Bot - Setup"
echo "==========================================================================="
echo ""
echo "This script will set up and run the Telegram bot on your server."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Installing..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Installing..."
    sudo apt-get install -y npm
fi

# Check if pm2 is installed (for 24/7 uptime)
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2 for process management..."
    sudo npm install -g pm2
fi

echo ""
echo "✓ Node.js, npm, and PM2 are ready"
echo ""

# Create bot directory
BOT_DIR="/opt/agentscoinlaunchers-bot"
echo "📁 Creating bot directory at: $BOT_DIR"
sudo mkdir -p "$BOT_DIR"
cd "$BOT_DIR"

echo ""
echo "📥 Downloading bot files..."
echo ""

# Create package.json
cat > package.json << 'EOF'
{
  "name": "agentscoinlaunchers-telegram-bot",
  "version": "1.0.0",
  "description": "Telegram bot for AgentsCoinLaunchers - Token launch platform",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "node index.js",
    "stop": "pm2 stop agentscoinlaunchers-bot",
    "restart": "pm2 restart agentscoinlaunchers-bot",
    "logs": "pm2 logs agentscoinlaunchers-bot"
  },
  "dependencies": {
    "axios": "^1.13.6",
    "dotenv": "^16.6.1",
    "node-telegram-bot-api": "^0.64.0",
    "mongodb": "^6.3.0",
    "express": "^4.22.1"
  }
}
EOF

echo "✓ Created package.json"

# Create .env.example
cat > .env.example << 'EOF'
# ============================================================================
# TELEGRAM BOT CONFIGURATION
# ============================================================================
# Get your bot token from @BotFather on Telegram
# Go to: https://t.me/BotFather
# Command: /newbot
TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN_HERE

# Telegram channel ID for broadcasting signals (find with @userinfobot)
# Must be negative number: -1001234567890
TELEGRAM_CHANNEL_ID=-1001234567890

# ============================================================================
# MONGODB CONFIGURATION
# ============================================================================
# MongoDB Atlas connection string
# Get from: https://cloud.mongodb.com
# Format: mongodb+srv://username:password@cluster.mongodb.net/database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agentscoinlaunchers

# ============================================================================
# PLATFORM WALLET CONFIGURATION
# ============================================================================
# Solana wallet that receives 30% of launch fees
PLATFORM_WALLET_ADDRESS=Dgk9bcm6H6LVaamyXQWeNCXh2HuTFoE4E7Hu7Pw1aiPx

# Bags.fm API Key for token launches
# Get from: https://bags.fm/api
BAGS_API_KEY=bags_prod_YOUR_API_KEY_HERE

# ============================================================================
# API CONFIGURATION
# ============================================================================
# Your web platform API URL
# Local: http://localhost:3001
# Production: https://your-domain.com
NEXT_PUBLIC_API_URL=http://localhost:3001

# ============================================================================
# ENVIRONMENT
# ============================================================================
NODE_ENV=production
LOG_LEVEL=info
EOF

echo "✓ Created .env.example"

# Instructions
cat > SETUP_INSTRUCTIONS.md << 'EOF'
# AgentsCoinLaunchers Telegram Bot - Setup Instructions

## ⚠️ IMPORTANT SECURITY

**This bot connects to your Solana wallet and MongoDB database. Keep all credentials SECRET!**

### Step 1: Create .env File

```bash
cp .env.example .env
nano .env
```

### Step 2: Get Required Credentials

#### 1. **Telegram Bot Token**
- Go to: https://t.me/BotFather
- Send: `/newbot`
- Follow instructions, get your token
- Paste into `TELEGRAM_BOT_TOKEN=`

#### 2. **Telegram Channel ID**
- Create a private Telegram channel
- Add @userinfobot to channel
- Send: `/start`
- Get your channel ID (will be negative: -1001234567890)
- Paste into `TELEGRAM_CHANNEL_ID=`

#### 3. **MongoDB Connection**
- Go to: https://cloud.mongodb.com
- Create cluster (free tier available)
- Get connection string: "Connect" > "Drivers"
- Format: `mongodb+srv://username:password@cluster.mongodb.net/agentscoinlaunchers`
- Paste into `MONGODB_URI=`

#### 4. **Bags API Key**
- Go to: https://bags.fm/api
- Create API key
- Paste into `BAGS_API_KEY=`

#### 5. **Platform Wallet**
- Use your Solana wallet address
- This wallet receives 30% of fees
- Paste into `PLATFORM_WALLET_ADDRESS=`

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Test Locally First

```bash
npm start
# or
node index.js
```

Expected output:
```
✅ Telegram bot started
Listening for commands...
```

Send `/start` to the bot in Telegram to test.

### Step 5: Deploy with PM2 (24/7 Uptime)

```bash
# Start bot with PM2
pm2 start index.js --name "agentscoinlaunchers-bot"

# Make it restart on server reboot
pm2 startup
pm2 save

# View logs
pm2 logs agentscoinlaunchers-bot

# Monitor
pm2 monit
```

### Step 6: Update Bot Commands

In Telegram @BotFather, set these commands:

```
start - Main menu
help - Show help
launch - Launch new token
wallet - Check wallet info
settings - Configure settings
history - View transaction history
claim - Claim earned fees
swap - Swap tokens
selflaunch - Self-launch token
skills - View AI skills
```

## 🤖 Bot Features

### User Commands
- `/start` - Main menu with all options
- `/help` - Detailed help and documentation
- `/launch` - Launch a new token (requires Solana wallet)
- `/wallet` - View wallet info and balances
- `/settings` - Configure fee receiver wallet
- `/history` - View transaction history
- `/claim` - Claim earned fees
- `/swap` - Swap tokens (integration ready)
- `/selflaunch` - Launch token directly (Bags API)
- `/skills` - View available AI skills

### Callback Features
- **Launch Token** - Token launch with fee split (70% user, 30% platform)
- **Fee Claims** - Claim accumulated fees
- **Wallet Verification** - Verify Solana transactions on Solscan
- **Fee Receiver Config** - Set custom fee wallet
- **Transaction History** - View all past launches and claims

## 📊 MongoDB Collections

The bot automatically creates these collections:

```
users:
  - telegramId (unique)
  - walletAddress
  - feeReceiverWallet
  - totalFeesEarned
  - totalVolumeTraded
  - createdAt
  - lastActive

tokens:
  - name, symbol, supply
  - creator (walletAddress)
  - launchHash
  - feeReceiver
  - createdAt

transactions:
  - userWallet
  - type (launch, claim, swap)
  - amount
  - hash
  - status
  - timestamp
```

## 🔐 Security Checklist

- [ ] .env file has `TELEGRAM_BOT_TOKEN` (keep SECRET)
- [ ] .env file has `MONGODB_URI` (keep SECRET)
- [ ] .env file has `BAGS_API_KEY` (keep SECRET)
- [ ] .env file is in `.gitignore`
- [ ] Never share .env file
- [ ] Keep MongoDB password strong
- [ ] Use HTTPS for API URLs in production
- [ ] Regularly backup MongoDB data
- [ ] Monitor bot logs for errors

## 🐛 Troubleshooting

### Bot won't start
```bash
# Check Node.js version (need 14+)
node --version

# Check npm packages installed
npm list

# Reinstall packages
rm -rf node_modules package-lock.json
npm install

# Check environment variables
cat .env | grep TOKEN
```

### Bot not responding to commands
```bash
# Check logs
pm2 logs agentscoinlaunchers-bot

# Verify bot token is correct in Telegram BotFather
# Verify polling is enabled (should be by default)

# Restart bot
pm2 restart agentscoinlaunchers-bot
```

### MongoDB connection failed
```bash
# Verify connection string
# Test: mongosh "your-connection-string"

# Check if IP is whitelisted in MongoDB Atlas
# Go to: cluster > Network Access > IP Whitelist
# Add your server's IP (0.0.0.0/0 for testing, but restrict in production)
```

### Transaction verification failing
```bash
# Check Solscan API
curl https://api.solscan.io/v1/tx/{your-tx-hash}

# Verify Solana RPC endpoint
curl https://api.mainnet-beta.solana.com -X POST
```

## 📞 Support

- **Bot Code Issues**: Check logs with `pm2 logs`
- **MongoDB Issues**: MongoDB Atlas docs: https://docs.mongodb.com
- **Telegram Issues**: BotFather: @BotFather
- **Solana Issues**: Devnet docs: https://docs.solana.com

## 🚀 Going Live

### Before Production:

1. **Verify all credentials** are correct and secure
2. **Test all features** in private chat first
3. **Set up monitoring** with PM2
4. **Enable backups** for MongoDB
5. **Monitor logs** daily for errors
6. **Use HTTPS** for all API calls

### Commands for 24/7 Uptime:

```bash
# Install as system service
pm2 startup systemd -u your_user --hp /home/your_user

# Start bot
pm2 start index.js --name "agentscoinlaunchers-bot" --watch

# Save configuration
pm2 save

# Check status
pm2 status

# View logs
pm2 logs agentscoinlaunchers-bot --lines 100
```

### Monitoring:

```bash
# Dashboard
pm2 monit

# Status
pm2 status

# Restart on crash
pm2 update

# Email alerts (optional)
pm2 install pm2-auto-pull
```

## 📈 Analytics

The bot automatically tracks:
- Total tokens launched per user
- Total fees earned
- Transaction history
- User activity
- Launch signatures

Access via MongoDB collections or the web dashboard.

---

**Happy launching! 🚀**

For more info: https://github.com/Maliot100X/AgentsCoinLaunchers

EOF

echo "✓ Created SETUP_INSTRUCTIONS.md"

echo ""
echo "==========================================================================="
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "  1. Edit .env file with your credentials:"
echo "     nano .env"
echo ""
echo "  2. Install dependencies:"
echo "     npm install"
echo ""
echo "  3. Test locally:"
echo "     npm start"
echo ""
echo "  4. Run 24/7 with PM2:"
echo "     pm2 start index.js --name 'agentscoinlaunchers-bot'"
echo ""
echo "📖 Full instructions in: SETUP_INSTRUCTIONS.md"
echo "==========================================================================="
