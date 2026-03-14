# Reddit Marketing Posts for BAGSX MCP

## Post 1: r/solana

### Title:
I built an MCP server that lets Claude trade Solana tokens — 19 real tools, zero custody, open source

### Body:
Hey r/solana,

I've been building this for the Bags Hackathon and wanted to share it with the community.

**What is it?**
BAGSX is a Model Context Protocol (MCP) server that connects Claude (Anthropic's AI) to the Bags.fm API. You can literally type "swap 0.5 SOL for BAGSX" and it handles everything.

**What can it do?**
- 💱 Get swap quotes with price impact & slippage
- 🚀 Launch creator tokens (bonding curves)
- 💸 Claim creator fees across all your tokens
- ⚙️ Configure fee sharing between wallets
- 📊 View analytics on any token

**Security model:**
All transactions are UNSIGNED. You get a base64 blob, paste it into Phantom/Solflare, and sign yourself. Your keys never leave your wallet. Zero custody.

**Why I built it:**
DeFi UX is painful. Copy-pasting addresses, checking multiple dashboards, manually tracking fee claims... I wanted to just *talk* to an AI and have it do the work.

**Links:**
- GitHub: https://github.com/chunk97-bot/bagsx-mcp
- Landing page: https://chunk97-bot.github.io/bagsx-mcp
- $BAGSX Token: `BA6ggscnXVgfENwPGk9CXeEqKR67T9z6n64G5ue5BAGS`

It's MIT licensed, completely open source. Would love feedback from the Solana community!

---

## Post 2: r/LocalLLaMA

### Title:
MCP Server for Solana trading — talk to Claude, get real DeFi transactions

### Body:
Built something cool for the MCP ecosystem and wanted to share.

**BAGSX** is an MCP server that connects Claude (or any MCP-compatible LLM) to Solana's Bags.fm DEX. It has 19 tools that map to real API endpoints — no fake data, everything actually works.

**Example conversation:**
```
You: Get a quote for swapping 0.5 SOL to BAGSX
Claude: Quote ready - 0.5 SOL → 2.5M BAGSX, 0.002% impact, 1% slippage
You: Execute that swap with my wallet 7xK2...
Claude: Unsigned transaction ready. Copy to Phantom and sign.
```

**Why this matters for MCP:**
- Shows that MCP can handle real financial transactions
- Demonstrates zero-custody pattern (AI generates unsigned TX, human signs)
- 19 tools covering trading, token launches, fee management, analytics

**Technical details:**
- TypeScript + MCP SDK + Zod schemas
- Direct API calls to bags.fm
- No on-chain simulation overhead
- Works with Claude Desktop or any MCP client

**Links:**
- Source: https://github.com/chunk97-bot/bagsx-mcp
- Landing: https://chunk97-bot.github.io/bagsx-mcp

Open source, MIT licensed. Happy to answer questions about MCP implementation patterns!

---

## Post 3: r/CryptoCurrency

### Title:
[Discussion] Built an AI that can trade Solana tokens for you — but you still hold the keys

### Body:
Been working on something that I think shows where DeFi UX is headed.

**The problem:** Trading, launching tokens, claiming fees — it all requires too many clicks, too many tabs, too much copy-pasting.

**The solution:** An MCP server called BAGSX that lets you talk to Claude and have it handle DeFi operations. Real API calls, real transactions.

**How it works:**
1. You tell Claude what you want ("swap 0.5 SOL for this token")
2. Claude generates an unsigned transaction
3. You paste it into your wallet (Phantom, Solflare, etc.)
4. You sign and submit

**The key insight:** AI can do all the PREPARATION, but YOU still hold the keys. Zero custody. The AI never sees your private key.

**Currently supports:**
- Swap quotes and execution
- Token launches with bonding curves
- Creator fee claiming
- Fee share configuration
- Analytics on any token

Built for the Bags Hackathon ($4M prize pool). Open source on GitHub.

What do you think? Is this the future of DeFi, or is it too complex for mainstream adoption?

GitHub: https://github.com/chunk97-bot/bagsx-mcp

---

## Post 4: r/cryptocurrency + r/ethtrader style (shorter)

### Title:
I made Claude trade Solana tokens — 19 tools, zero custody

### Body:
Built an MCP server for the Bags Hackathon. You can now:

- "Swap 0.5 SOL for BAGSX" → Get unsigned TX → Sign in wallet
- "Launch a token called DEMO" → Bonding curve ready
- "What can I claim?" → All fee positions across tokens

No fake data. 19 real API tools. Your keys never leave your wallet.

Open source: https://github.com/chunk97-bot/bagsx-mcp

Token if you want to support it: `BA6ggscnXVgfENwPGk9CXeEqKR67T9z6n64G5ue5BAGS` on Bags.fm

---

## Posting Strategy

### Timing:
- r/solana: Post during US business hours (10 AM - 2 PM EST)
- r/LocalLLaMA: Same, slightly later (they're more global)
- r/CryptoCurrency: Weekend mornings get more traction

### Engagement:
- Respond to EVERY comment in first 2 hours
- Answer technical questions with detail
- If anyone asks about security, emphasize unsigned TX pattern
- Have screenshot/GIF ready to post in comments

### Don'ts:
- Don't shill the token too hard (leads to removal)
- Don't crosspost too fast (looks spammy)
- Don't use price speculation language
