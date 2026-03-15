# API Requirements & Setup Guide

## TLDR: What APIs Do We Need?

### ✅ REQUIRED: Bags.fm API
- **What it does**: Everything! Token creation, fee tracking, trending detection
- **Where to get it**: https://dev.bags.fm
- **Cost**: Free API key (production keys have rate limits)
- **What's included**:
  - Token launching (SPL token creation)
  - Fee management & claiming
  - Lifetime fees tracking
  - Token creators lookup
  - Token claim events
  - Real-time trending detection
  - Trading execution (multi-DEX routing)
  - Error handling & rate limiting

### ❌ NOT NEEDED: Helius API
- Bags.fm API is comprehensive and handles all blockchain interactions
- No need for additional RPC providers or data providers

## Setup Instructions

### 1. Get Bags.fm API Key

1. Go to https://dev.bags.fm
2. Create an account or log in
3. Create a new API key (it will start with `bags_prod_`)
4. Copy the full key and add to environment variables

```env
BAGS_API_KEY=bags_prod_YhTVMoennloNU06kSEDqQ8g_Bdd7_5g7RdcMT1EBr4o
```

### 2. Solana RPC Configuration

Bags recommends using their standard RPC endpoint:

```env
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

Or for development:
```env
SOLANA_RPC_URL=https://api.devnet.solana.com
```

### 3. Bags Wallet Setup

Create or link a Bags.fm wallet to receive fees:

```env
PLATFORM_WALLET_ADDRESS=Dgk9bcm6H6LVaamyXQWeNCXh2HuTFoE4E7Hu7Pw1aiPx
```

## Key Bags.fm API Features

### Token Launch
```bash
POST /api/tokens/launch
```
- Create new SPL tokens instantly
- Configure fee sharing (70/30 split)
- Support multiple fee claimers
- Automatic transaction broadcasting

### Fee Management
```bash
GET /api/fees/:wallet
POST /api/fees/claim
```
- Track all earned fees
- Claim fees from multiple tokens
- Support for virtual pool, DAMM pool, and custom fee vaults
- Batch claiming operations

### Token Analytics
```bash
GET /api/tokens/:mint
GET /api/tokens/lifetime-fees/:mint
```
- Get token performance metrics
- Track lifetime earnings
- Monitor trending tokens
- Get token creator information

### Real-Time Tracking
```bash
GET /api/bags/new
GET /api/bags/trending
GET /api/bags/graduating
```
- Detect newly launched tokens
- Track trending metrics
- Identify graduating tokens
- Real-time market data

## Rate Limiting & Best Practices

From Bags.fm API docs:
- Production keys have rate limits (check your plan)
- Implement exponential backoff for retries
- Cache responses when possible
- Use webhooks for real-time updates when available

## Error Handling

All Bags SDK calls include comprehensive error handling:
- Invalid wallet formats
- Insufficient SOL for fees
- Transaction failures
- API rate limiting
- Network timeouts (15-60 second protection)

## No Additional Services Needed

You do NOT need:
- ❌ Helius API (Bags handles all blockchain data)
- ❌ Magic Eden API (Bags integrates with DEXs)
- ❌ DexScreener API (Bags provides all price data)
- ❌ Orca API (Bags routes through DEXs)

Bags.fm is a complete solution for token operations on Solana.

## Deployment Checklist

- [ ] Create Bags.fm account and get API key
- [ ] Set BAGS_API_KEY in environment variables
- [ ] Configure SOLANA_RPC_URL
- [ ] Set PLATFORM_WALLET_ADDRESS
- [ ] (Optional) Add PRIVATE_KEY for automated claiming
- [ ] Test /api/skills endpoint
- [ ] Test /api/leaderboard endpoint
- [ ] Test token launching workflow
- [ ] Deploy to Vercel

## Resources

- Bags.fm Docs: https://docs.bags.fm
- API Reference: https://docs.bags.fm/api-reference
- Setup Guide: https://docs.bags.fm/how-to-guides/typescript-node-setup
- Fee Management: https://docs.bags.fm/how-to-guides/claim-fees
