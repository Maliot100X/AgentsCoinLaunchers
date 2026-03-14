# AgentsCoinLaunchers Platform

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
- Telegram Bot Token
- Solana RPC URL

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
