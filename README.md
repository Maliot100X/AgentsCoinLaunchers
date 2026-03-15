# AgentsCoinLaunchers Platform

## 🧪 QUICK START - Local Testing

**Everything is fixed and ready to test with ZERO ERRORS!**

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for complete local testing instructions.

**Quick commands:**
```bash
bash test-all.sh        # Verify all components
bash start-api.sh       # Start API only
bash start-web.sh       # Start Website only
bash start-bot.sh       # Start Bot only
bash start-all.sh       # Start all 3 services
```

---

## Overview

AgentsCoinLaunchers is a comprehensive Solana-based token launch and trading platform with Telegram bot integration, web interface, and AI-powered skills marketplace.

## Features

### 🚀 Token Launch
- Deploy Solana tokens with 0.055 SOL minimum fee
- 70/30 fee split (70% to user, 30% to platform)
- Automated deployment using Bags API

### 💬 Telegram Bot
- Full-featured bot with 9 commands
- Token creation, swaps, wallet management
- Skills marketplace browsing
- Transaction history and fee claiming

### 🌐 Web Interface
- Wallet connection (Phantom/Solana)
- Token launch interface
- Swap interface
- Skills marketplace
- User dashboard

### 🤖 Skills System
- MCP (Model Context Protocol) skills
- Share and browse skills
- Claude agent integration
- Categories: swap, launch, claim, analytics

## Architecture

```
agentscoinlaunchers/
├── packages/
│   ├── web/              # Next.js 14 frontend
│   ├── bot/              # Telegram bot
│   ├── api/              # Express backend
│   └── bagsx-mcp/        # MCP tools (19 tools)
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB
- Telegram Bot Token (from @BotFather)
- Solana RPC URL
- Your Bags API Key (from dev.bags.fm)

### Local Development Setup

1. **Install dependencies:**
```bash
# Bot
cd packages/bot
npm install

# API
cd ../api
npm install

# Web
cd ../web
npm install
```

2. **Create environment files:**

**packages/bot/.env:**
```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**packages/api/.env:**
```env
DATABASE_URL=mongodb://localhost:27017/agentscoinlaunchers
PORT=3001
BAGS_API_KEY=your_bags_api_key_here
PLATFORM_WALLET_ADDRESS=your_platform_wallet_address
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

**packages/web/.env:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

3. **Start services:**

**Terminal 1 - API Server:**
```bash
cd packages/api
npm run dev
```

**Terminal 2 - Telegram Bot:**
```bash
cd packages/bot
npm run dev
```

**Terminal 3 - Web App:**
```bash
cd packages/web
npm run dev
```

### Production Deployment

**Vercel (Website + API):**
1. Push to GitHub
2. Import repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

**Ubuntu Server (Telegram Bot):**
See `telegram.txt` for complete setup instructions.

## Business Logic

### Fee Structure
- **Minimum Launch Fee:** 0.055 SOL
- **User Fee Receiver:** 70% (user provides wallet)
- **Platform Wallet:** 30% (sustainability)
- **Platform API Key:** Uses YOUR Bags API key (not user's)

### Payment Flow
1. User initiates token launch
2. User pays 0.055 SOL to YOUR platform wallet
3. Platform confirms payment
4. Token deploys with fee configuration (70/30 split)
5. Ongoing creator fees: 70% to user, 30% to platform

## Architecture

### Components
- **Bot:** Telegram interface (Node.js + Telegram Bot API)
- **API:** Express backend (MongoDB, Solana integration)
- **Web:** Next.js frontend (Phantom wallet connect)
- **MCP Server:** Trading tools integration

### Data Flow
```
User → Telegram/Web → API → Bags.fm API → Solana Blockchain
     (Token launch)   (Process)    (Deploy)     (Token created)
```

### Installation
```bash
# Clone repository
git clone https://github.com/Maliot100X/AgentsCoinLaunchers
cd AgentsCoinLaunchers

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your actual values

# Run development
npm run dev
```

### Components
- **Web**: `npm run web` (http://localhost:3000)
- **API**: `npm run api` (http://localhost:3001)
- **Bot**: `npm run bot`

## Business Logic

### Payment Flow
1. User pays 0.055 SOL to platform wallet
2. Platform confirms payment via Solana RPC
3. Token deployed with fee configuration:
   - 70% to user's fee receiver wallet
   - 30% to platform wallet (Dgk9bcm6H6LVaamyXQWeNCXh2HuTFoE4E7Hu7Pw1aiPx)

### Skills Marketplace
- Users create MCP skills
- Display on website marketplace
- Copy-paste to Claude agents
- Categories: swap, launch, claim, analytics

## API Endpoints

- `POST /api/users/register` - Register user
- `POST /api/tokens/launch` - Launch token
- `GET /api/skills` - Browse skills
- `POST /api/transactions` - Transaction history
- `POST /api/fees/claim` - Claim fees

## Telegram Bot Commands

- `/start` - Register users
- `/help` - Show all commands
- `/launch` - Create tokens (0.055 SOL minimum)
- `/swap` - Token swaps
- `/wallet` - Check balance
- `/skills` - Browse skills
- `/claim` - Claim fees
- `/settings` - Configure
- `/history` - Transaction history

## Technologies

- **Frontend**: Next.js 14, Tailwind CSS, Phantom Wallet
- **Backend**: Express.js, MongoDB
- **Bot**: Telegram Bot API, Node.js
- **Solana**: @solana/web3.js, Bags API
- **MCP**: Model Context Protocol tools

## Security

- No real keys in repository
- Environment variables for sensitive data
- Secure payment verification
- Fee split automation

## License

MIT
