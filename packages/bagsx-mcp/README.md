# BAGSX MCP Server v2.0

<div align="center">

<img src="https://img.shields.io/badge/BAGSX-AI%20x%20Solana-00d4ff?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyTDIgN2wxMCA1IDEwLTV6Ii8+PC9zdmc+" alt="BAGSX" />

### 🤖 "Hey Claude, swap 1 SOL for BAGSX"

**The first MCP server that lets Claude trade Solana tokens for you**

[![npm version](https://img.shields.io/npm/v/bagsx-mcp?style=flat-square&color=00d4ff)](https://www.npmjs.com/package/bagsx-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-9b59b6?style=flat-square)](https://modelcontextprotocol.io)
[![Bags Hackathon](https://img.shields.io/badge/🏆%20Bags-Hackathon%202026-ff6b6b?style=flat-square)](https://bags.fm/hackathon)
[![19 Tools](https://img.shields.io/badge/Tools-19%20Real%20APIs-00ff88?style=flat-square)](#tools)
[![$BAGSX Token](https://img.shields.io/badge/%24BAGSX-Buy%20Now-f39c12?style=flat-square)](https://bags.fm/BA6ggscnXVgfENwPGk9CXeEqKR67T9z6n64G5ue5BAGS)

**[🚀 Quick Start](#quick-install) • [💰 Buy $BAGSX](#bagsx-token) • [📖 Docs](#tools) • [🎥 Demo](#demo)**

</div>

---

## 🎥 Demo

> **Coming soon:** GIF showing live Claude + BAGSX interaction

```
You: "What can I claim for wallet 7xK2..."
Claude: You have 0.57 SOL claimable across 2 tokens. Want me to generate the claim transactions?
You: "Yes"
Claude: Done. Copy this unsigned transaction to Phantom and sign it.
```

**Zero custody. You always hold your keys.**

</div>

---

## 💎 $BAGSX Token

<div align="center">

| 🪙 Token | 📍 Mint Address | 🛒 Buy Now |
|----------|-----------------|------------|
| **$BAGSX** | `BA6ggscnXVgfENwPGk9CXeEqKR67T9z6n64G5ue5BAGS` | **[bags.fm/BAGSX](https://bags.fm/BA6ggscnXVgfENwPGk9CXeEqKR67T9z6n64G5ue5BAGS)** |

</div>

Every trade on $BAGSX generates creator fees → Reinvested into development + hackathon prizes.

---

## 🔥 Why BAGSX?

| Before BAGSX | With BAGSX |
|--------------|------------|
| ❌ Copy-paste addresses into DEX | ✅ "Claude, swap 1 SOL for BAGSX" |
| ❌ Manually check fee claims | ✅ "What can I claim across all tokens?" |
| ❌ Complex token launch process | ✅ "Launch a token called DEMO" |
| ❌ Manage fee splits in code | ✅ "Split fees 50/50 with this wallet" |

**This is what DeFi should feel like.** Talk to your AI, get things done.

---

## ✨ Features

BAGSX is a **Model Context Protocol (MCP) server** that connects [Claude](https://claude.ai) to the [Bags.fm API](https://docs.bags.fm) — enabling AI-powered trading, token launches, and fee management on Solana.

Talk to Claude in plain English to:
- 💰 **Get swap quotes** and execute trades with slippage protection
- 🚀 **Launch tokens** with automatic metadata and bonding curves
- 💸 **Claim creator fees** from your launched tokens
- 📊 **View analytics** on creators, fees, and claim events
- ⚙️ **Configure fee sharing** with multiple wallets

> **Built for the $4M Bags Hackathon** — 19 real API tools

---

## Features

| Feature | Description |
|---------|-------------|
| **🛠️ 19 Real Tools** | Every tool maps to an actual Bags API endpoint — no fake data |
| **💱 Trading** | Get quotes, execute swaps with auto-slippage protection |
| **🚀 Token Launch** | Prepare metadata + create bonding curve tokens in 2 commands |
| **💸 Fee Management** | Claim fees, configure splits, transfer admin — all via chat |
| **🔐 Zero Custody** | All transactions are UNSIGNED — you sign in your wallet |
| **⚡ Fast** | Direct API calls, no on-chain simulation overhead |

---

## Security Model

**BAGSX uses unsigned transactions** — your private keys NEVER leave your wallet:

1. You ask Claude to trade/claim/etc
2. BAGSX generates an unsigned transaction
3. You copy the transaction to your wallet (Phantom/Solflare)
4. You sign and submit yourself

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Claude + MCP  │ → │  Unsigned TX    │ → │  Your Wallet    │
│   (analysis)    │    │  (base64 blob)  │    │  (you sign)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

**Zero custody risk.** We never see your private key.

---

## Installation

### Prerequisites
- Node.js 18+
- [Bags API Key](https://dev.bags.fm) (free)
- [Claude Desktop](https://claude.ai/download) or any MCP client
- A Solana wallet (Phantom, Solflare, Backpack)

### Quick Install

```bash
# Clone the repo
git clone https://github.com/chunk97-bot/bagsx-mcp.git
cd bagsx-mcp

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your Bags API key

# Build
npm run build
```

### Add to Claude Desktop

Edit your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on Mac or `%APPDATA%/Claude/claude_desktop_config.json` on Windows):

```json
{
  "mcpServers": {
    "bagsx": {
      "command": "node",
      "args": ["/path/to/bagsx-mcp/dist/index.js"],
      "env": {
        "BAGS_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

Restart Claude Desktop. You'll see "bagsx" in the MCP servers list.

---

## Usage

Once connected, just talk to Claude:

### Get Swap Quotes
```
"Get a quote for swapping 0.5 SOL to BAGSX"
"What's the price to swap 1 SOL to this token?"
"Quote me a swap from SOL to BA6ggscnXVgfENwPGk9CXeEqKR67T9z6n64G5ue5BAGS"
```

### Execute Trades
```
"Execute that swap with my wallet 7xK2..."
"Create a swap transaction for wallet ABC123..."
```

### Launch Tokens
```
"Prepare a token called DEMO with symbol DMO"
"Create token metadata with description 'My awesome project'"
```

### Claim Creator Fees
```
"What fees can I claim for wallet 7xK2...?"
"Show my claimable positions"
"Generate claim transactions for this token"
```

### Manage Fee Sharing
```
"Look up fee wallet for Twitter user @username"
"Create fee share config splitting 50/50 between two wallets"
"List tokens where I'm admin"
```

### View Analytics
```
"Show creators for token XYZ"
"What are the lifetime fees for BAGSX?"
"Get claim stats for this token mint"
```

---

## Tools

### 💰 Trading (2 Tools)

| Tool | Description |
|------|-------------|
| `bags_quote` | Get swap quotes with price impact & slippage. Supports auto or manual slippage. |
| `bags_swap` | Create unsigned swap transaction from a quote. You sign in your wallet. |

### 🚀 Token Launch (2 Tools)

| Tool | Description |
|------|-------------|
| `bags_launch_prepare` | Create token metadata (name, symbol, image, socials). Returns mint address. |
| `bags_launch_execute` | Create bonding curve launch transaction. You sign to deploy. |

### 📊 Analytics (4 Tools)

| Tool | Description |
|------|-------------|
| `bags_creators` | Get creator info and royalty settings for a token. |
| `bags_lifetime_fees` | Total fees generated by a token since launch. |
| `bags_claim_stats` | Who claimed fees and how much (per wallet breakdown). |
| `bags_claim_events` | Historical claim events with timestamps & signatures. |

### 💸 Fee Claiming (2 Tools)

| Tool | Description |
|------|-------------|
| `bags_claimable` | Check claimable positions for a wallet (all tokens). |
| `bags_claim_fees` | Generate unsigned transactions to claim fees. You sign. |

### ⚙️ Fee Share Config (5 Tools)

| Tool | Description |
|------|-------------|
| `bags_fee_wallet` | Look up fee share wallet for a social username (Twitter, etc). |
| `bags_fee_config` | Create fee share configuration with multiple claimers & splits. |
| `bags_admin_list` | List tokens where a wallet has admin rights. |
| `bags_admin_update` | Update fee share splits (admin only). |
| `bags_admin_transfer` | Transfer admin rights to another wallet. |

### 🏊 State/Pools (2 Tools)

| Tool | Description |
|------|-------------|
| `bags_pools` | List all Bags pools (optionally filter to migrated only). |
| `bags_pool_info` | Get pool details by token mint address. |

### 🤝 Partner (2 Tools)

| Tool | Description |
|------|-------------|
| `bags_partner_stats` | View claimed and unclaimed partner fees. |
| `bags_partner_claim` | Generate unsigned transactions to claim partner fees. |

---

## Usage Examples

### Getting a Swap Quote
```
You: "Get a quote for swapping 0.5 SOL to the BAGSX token"

Claude: [Uses bags_quote tool]

Quote details:
- Input: 0.5 SOL (500000000 lamports)
- Output: ~2,547,510,849,175,944 BAGSX
- Price Impact: 0.002%
- Slippage: 100 bps (1%)
- Request ID: 64aa5700-1f3b-4127-a191-5311ab0274aa

Use bags_swap with this request ID to execute the trade.
```

### Executing a Swap
```
You: "Execute that swap with my wallet 7xK2..."

Claude: [Uses bags_swap tool]

Unsigned transaction ready:
- Transaction: AQAAAA...
- Block Height: 234567890
- Priority Fee: 5000 lamports

To complete: Copy to Phantom → Sign → Submit
```

### Launching a Token
```
You: "Prepare a token called DEMO with symbol DMO"

Claude: [Uses bags_launch_prepare tool]

Token info created:
- Mint: 9xYz123...
- Metadata URI: ipfs://...
- Status: Ready

Use bags_launch_execute to deploy the bonding curve.
```

### Claiming Creator Fees
```
You: "What fees can I claim for wallet 7xK2...?"

Claude: [Uses bags_claimable tool]

Claimable positions:
| Token | Amount |
|-------|--------|
| BAGSX | 0.42 SOL |
| DEMO  | 0.15 SOL |

Total: 0.57 SOL

Shall I generate claim transactions?
```

---

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `BAGS_API_KEY` | Yes | Your Bags API key from dev.bags.fm |

### Get Your API Key

1. Go to [dev.bags.fm](https://dev.bags.fm)
2. Sign up / log in
3. Create a new API key
4. Add to your `.env` file

---

## Categories

This project is submitted to the **Bags Hackathon 2026** under:

- ✅ **Claude Skills** — MCP server for Claude integration
- ✅ **Bags API** — Full integration with public Bags.fm API
- ✅ **AI Agents** — Enables AI-powered trading via natural language

---

## Development

```bash
# Run in development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Project Structure

```
bagsx-mcp/
├── src/
│   ├── index.ts              # MCP server entry point
│   ├── config.ts             # Configuration management
│   ├── lib/
│   │   └── bags-client-new.ts # Bags API client (19 methods)
│   └── tools/
│       ├── definitions-new.ts # Tool schemas (19 tools)
│       └── handlers-new.ts    # Tool implementations
├── package.json
├── tsconfig.json
└── README.md
```

---

## Security

- 🔒 **Private keys never needed** — All transactions are unsigned
- 🔒 **API key in environment** — Not hardcoded or exposed to Claude
- 🔒 **You sign everything** — Full control over what gets submitted
- 🔒 **Open source** — Audit the code yourself

---

## Roadmap

- [x] Core MCP server with real API integration
- [x] 19 working tools (trading, launch, fees, analytics)
- [x] Zero custody security model
- [x] $BAGSX token launch
- [ ] Additional analytics as Bags API expands
- [ ] Real-time price feeds (when available)

---

## Links

- **Bags.fm**: https://bags.fm
- **Bags API Docs**: https://docs.bags.fm
- **Bags Hackathon**: https://bags.fm/hackathon
- **MCP Specification**: https://modelcontextprotocol.io

---

## License

MIT License — see [LICENSE](LICENSE)

---

<div align="center">

**Built for the $4M Bags Hackathon 2026**

[Apply Now](https://bags.fm/apply) • [Discord](https://discord.gg/bagsapp) • [Twitter](https://x.com/BagsHackathon)

</div>
