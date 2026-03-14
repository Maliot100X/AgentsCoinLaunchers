# How to Build a Zero-Custody AI Trading Agent with MCP

*A step-by-step guide to connecting Claude to Solana's Bags.fm DEX*

---

**TLDR:** We built an MCP server with 19 tools that lets Claude execute DeFi transactions on Solana. The key insight: AI handles preparation, but YOU sign. Zero custody.

**GitHub:** https://github.com/chunk97-bot/bagsx-mcp

---

## Why This Matters

The Model Context Protocol (MCP) is revolutionizing how AI interacts with external systems. But most examples are read-only — fetching data, searching docs, reading files.

What about *write* operations? What about financial transactions?

This tutorial shows how to build a zero-custody trading system where:
1. The AI understands your intent ("swap 1 SOL for BAGSX")
2. The AI calls real APIs and generates transactions
3. But YOU sign and submit from your own wallet

**Result:** All the convenience of AI, none of the custody risk.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        BAGSX MCP Server                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   Claude     │ →→ │  MCP Tools   │ →→ │  Bags API    │      │
│  │  (LLM)       │    │  (19 tools)  │    │  (REST)      │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│         ↓                                        ↓              │
│  ┌──────────────┐                       ┌──────────────┐        │
│  │  User Input  │                       │ Unsigned TX  │        │
│  │  (natural    │                       │ (base64)     │        │
│  │   language)  │                       └──────────────┘        │
│  └──────────────┘                              ↓                │
│                                         ┌──────────────┐        │
│                                         │  User Wallet │        │
│                                         │  (Phantom)   │        │
│                                         │  SIGNS HERE  │        │
│                                         └──────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

The key security boundary: **Unsigned transactions**. The MCP server never has access to private keys. It generates transaction data, and the user signs in their own wallet.

---

## Prerequisites

- Node.js 18+
- [Claude Desktop](https://claude.ai/download) or any MCP client
- [Bags API Key](https://dev.bags.fm) (free)
- A Solana wallet (Phantom, Solflare, Backpack)

---

## Step 1: Set Up the Project

```bash
# Clone the repository
git clone https://github.com/chunk97-bot/bagsx-mcp.git
cd bagsx-mcp

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

Edit `.env` and add your Bags API key:

```env
BAGS_API_KEY=your_api_key_here
```

Build the project:

```bash
npm run build
```

---

## Step 2: Understand the Tool Structure

BAGSX has 19 tools organized into 7 categories:

### Trading Tools
```typescript
// Get a swap quote
bags_quote: {
  inputMint: string,   // Token to sell (or "SOL")
  outputMint: string,  // Token to buy (or "SOL")
  amount: number,      // Amount in smallest units
  slippageBps?: number // Optional: slippage in basis points
}

// Execute a swap
bags_swap: {
  quoteRequestId: string, // From bags_quote response
  walletAddress: string   // Your wallet (will receive unsigned TX)
}
```

### Token Launch Tools
```typescript
// Prepare token metadata
bags_launch_prepare: {
  name: string,
  symbol: string,
  description?: string,
  image?: string,       // URL or base64
  twitter?: string,
  telegram?: string,
  website?: string
}

// Execute the launch
bags_launch_execute: {
  mintAddress: string,   // From prepare response
  walletAddress: string  // Creator wallet
}
```

### Fee Claiming Tools
```typescript
// Check claimable positions
bags_claimable: {
  walletAddress: string
}

// Generate claim transactions
bags_claim_fees: {
  walletAddress: string,
  tokenMint?: string  // Optional: specific token
}
```

---

## Step 3: Configure Claude Desktop

Add BAGSX to your Claude Desktop configuration:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "bagsx": {
      "command": "node",
      "args": ["/absolute/path/to/bagsx-mcp/dist/index.js"],
      "env": {
        "BAGS_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

Restart Claude Desktop. You should see "bagsx" in the MCP servers list.

---

## Step 4: Test Your First Trade

Open Claude and try:

```
Get a quote for swapping 0.1 SOL to BAGSX
```

Claude will use the `bags_quote` tool and return something like:

```
Quote details:
- Input: 0.1 SOL (100,000,000 lamports)
- Output: ~510,502,169,835,188 BAGSX
- Price Impact: 0.002%
- Slippage: 100 bps (1%)
- Request ID: 64aa5700-1f3b-4127-a191-5311ab0274aa
```

Now execute:

```
Execute that swap with my wallet 7xKY...abc
```

Claude returns an unsigned transaction. You'll see:

```
Unsigned transaction ready:
- Transaction: AQAAAA... (long base64 string)
- Block Height: 234567890
- Priority Fee: 5000 lamports

To complete:
1. Open Phantom/Solflare
2. Go to Settings → Developer
3. Paste the transaction
4. Sign and submit
```

---

## Step 5: The Security Model Deep Dive

Why is this secure? Let's break it down:

### What BAGSX CAN access:
- Bags.fm public API
- Your wallet ADDRESS (public)
- Transaction data (amounts, tokens)

### What BAGSX CANNOT access:
- Your private key
- Your seed phrase
- Transaction signing authority

### The Flow:
1. You tell Claude your intent
2. Claude calls BAGSX tools with your PUBLIC wallet address
3. BAGSX generates an unsigned transaction
4. You paste the transaction into your ACTUAL wallet
5. You sign with your PRIVATE key (offline/local)
6. You submit to the network

**The AI never touches your keys.**

---

## Step 6: Launch Your Own Token

One of the coolest features — launch a creator token:

```
Prepare a token called DEMO with symbol DMO and description "My test token"
```

Claude responds with:
```
Token info created:
- Mint Address: 9xYz123...
- Metadata URI: ipfs://...
- Status: Ready for launch

Use bags_launch_execute to deploy the bonding curve.
```

Then:

```
Execute the token launch for wallet 7xKY...abc
```

You'll get an unsigned transaction to create the bonding curve pool. Sign it, submit it, and your token is live on Bags.fm!

---

## Step 7: Claim Creator Fees

After your token gets trading volume:

```
What can I claim for wallet 7xKY...abc?
```

Claude shows all claimable positions:
```
Claimable fees:
- DEMO: 0.42 SOL
- OTHER: 0.15 SOL
Total: 0.57 SOL
```

Claim them:
```
Generate claim transactions for all my tokens
```

---

## Understanding the Code

### Tool Definitions (Zod Schemas)

Each tool is defined with a strict Zod schema:

```typescript
export const bagsQuoteSchema = z.object({
  inputMint: z.string().describe('Token mint to sell, or "SOL"'),
  outputMint: z.string().describe('Token mint to buy, or "SOL"'),
  amount: z.number().describe('Amount in smallest units'),
  slippageBps: z.number().optional().default(100)
});
```

This ensures Claude passes valid data to the API.

### API Client

The client handles authentication and request formatting:

```typescript
async getQuote(params: QuoteParams) {
  const response = await fetch(`${this.baseUrl}/trade/quote?...`, {
    headers: {
      'x-api-key': this.apiKey,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
}
```

### Handler Pattern

Each tool has a handler that:
1. Parses input with Zod
2. Calls the API client
3. Formats response for Claude

```typescript
async handleQuote(args: unknown) {
  const parsed = bagsQuoteSchema.parse(args);
  const result = await this.client.getQuote(parsed);
  return {
    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
  };
}
```

---

## Common Patterns for MCP + DeFi

### 1. Always Return Unsigned Transactions

Never generate signed transactions. Return base64 transaction data and let the user sign.

### 2. Include Block Height

Solana transactions expire. Include the `lastValidBlockHeight` so users know the deadline.

### 3. Clear Instructions

After generating a transaction, tell the user EXACTLY what to do:
- Which wallet to use
- Where to paste the transaction
- What the transaction will do

### 4. Error Handling

Wrap API calls in try-catch and return human-readable errors:

```typescript
try {
  return await this.client.swap(params);
} catch (error) {
  return { error: `Swap failed: ${error.message}` };
}
```

---

## Next Steps

- [ ] Add more DEX integrations (Jupiter, Raydium)
- [ ] Portfolio tracking tools
- [ ] Price alerts via MCP
- [ ] Multi-chain support

---

## Resources

- **BAGSX GitHub:** https://github.com/chunk97-bot/bagsx-mcp
- **MCP Docs:** https://modelcontextprotocol.io
- **Bags API Docs:** https://docs.bags.fm
- **$BAGSX Token:** `BA6ggscnXVgfENwPGk9CXeEqKR67T9z6n64G5ue5BAGS`

---

*Built for the Bags Hackathon 2026. MIT licensed. PRs welcome!*

---

**Tags:** #mcp #ai #solana #defi #claude #modelcontextprotocol #bags #trading #blockchain #typescript
