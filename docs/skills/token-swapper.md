# Token Swapper Skill

## Overview
The Token Swapper Skill executes token swaps with automated optimization, multi-DEX routing, and slippage protection. Seamlessly trade tokens on Solana DEXs.

## Features
- ✅ Multi-DEX routing (Jupiter, Orca, Raydium)
- ✅ Slippage optimization and protection
- ✅ Automated best-price execution
- ✅ Price impact calculation
- ✅ Limit orders with timeout
- ✅ Batch swaps for efficiency
- ✅ Transaction history tracking
- ✅ Fee optimization

## Supported Trading Pairs
- SOL ↔ USDC
- SOL ↔ USDT
- SOL ↔ COPE
- Custom token pairs
- Any SPL token pair on supported DEXs

## API Endpoint
```
POST /api/swap
GET /api/swap/quote
```

## Quote Request
```json
{
  "inputMint": "So11111111111111111111111111111111111111112",
  "outputMint": "EPjFWaJB1qwgKBCb1e7YjKKLj1hhH5gMHsB1zZ2m9tU",
  "amount": 1000000000,
  "slippageBps": 50
}
```

## Quote Response
```json
{
  "quote": {
    "inputMint": "...",
    "outputMint": "...",
    "inputAmount": "1000000000",
    "outputAmount": "9850000",
    "priceImpact": 0.015,
    "routePlan": [
      { "swapInfo": {...}, "percent": 100 }
    ]
  },
  "bestRoute": "Jupiter"
}
```

## Swap Execution
```json
{
  "inputMint": "So11111...",
  "outputMint": "EPjFW...",
  "amount": 1000000000,
  "slippageBps": 50,
  "userPublicKey": "user_address",
  "destinationToken": "destination_address",
  "wrapUnwrapSol": true
}
```

## Swap Response
```json
{
  "success": true,
  "transaction": {
    "hash": "TxHash123...",
    "status": "CONFIRMED",
    "timestamp": "2024-03-15T10:30:00Z"
  },
  "swap": {
    "inputAmount": "1000000000",
    "outputAmount": "9850000",
    "executedPrice": 0.009850,
    "priceImpact": 0.015,
    "fees": 0.00025
  },
  "balances": {
    "inputBefore": 5000000000,
    "inputAfter": 4000000000,
    "outputBefore": 0,
    "outputAfter": 9850000
  }
}
```

## Usage Examples

### For Claude
```
Claude: "Swap 1 SOL for USDC with 0.5% slippage"
Claude: "Execute a limit order to swap SOL for COPE at 0.01"
Claude: "What's the best route to swap SOL for USDT?"
```

### For Claw Bot
```
Set action: "swap"
Parameters: {
  from: "SOL",
  to: "USDC",
  amount: 1,
  slippage: 0.5
}
```

### For Custom Agents
```javascript
/**
 * Get a quote for a token swap
 * @param {string} inputMint - Input token mint address
 * @param {string} outputMint - Output token mint address
 * @param {number} amount - Amount to swap (in smallest unit)
 * @param {number} slippageBps - Slippage in basis points (default: 50)
 * @returns {Promise<Object>} Quote with price impact and best route
 */
const getSwapQuote = async (inputMint, outputMint, amount, slippageBps = 50) => {
  // Input validation
  if (!inputMint || inputMint.trim().length === 0) {
    throw new Error("Input mint address is required");
  }
  if (!outputMint || outputMint.trim().length === 0) {
    throw new Error("Output mint address is required");
  }
  if (typeof amount !== 'number' || amount <= 0) {
    throw new Error("Amount must be a positive number");
  }
  if (slippageBps < 0 || slippageBps > 500) {
    throw new Error("Slippage must be between 0 and 500 basis points");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch('http://localhost:3001/api/swap/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inputMint: inputMint.trim(),
        outputMint: outputMint.trim(),
        amount,
        slippageBps
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Quote failed: ${error.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error("Quote request timed out after 30 seconds");
    }
    throw error;
  }
};

/**
 * Execute a token swap
 * @param {string} inputMint - Input token mint address
 * @param {string} outputMint - Output token mint address
 * @param {number} amount - Amount to swap
 * @param {number} slippageBps - Slippage in basis points
 * @returns {Promise<Object>} Swap result with transaction hash
 */
const executeSwap = async (inputMint, outputMint, amount, slippageBps = 50) => {
  // Input validation
  if (!inputMint || inputMint.trim().length === 0) {
    throw new Error("Input mint address is required");
  }
  if (!outputMint || outputMint.trim().length === 0) {
    throw new Error("Output mint address is required");
  }
  if (typeof amount !== 'number' || amount <= 0) {
    throw new Error("Amount must be a positive number");
  }
  if (slippageBps < 0 || slippageBps > 500) {
    throw new Error("Slippage must be between 0 and 500 basis points");
  }

  // Get quote first
  let quote;
  try {
    quote = await getSwapQuote(inputMint, outputMint, amount, slippageBps);
  } catch (error) {
    throw new Error(`Failed to get swap quote: ${error.message}`);
  }

  // Check price impact
  if (quote.quote && quote.quote.priceImpact > 0.05) {
    console.warn(`Warning: High price impact detected (${(quote.quote.priceImpact * 100).toFixed(2)}%)`);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch('http://localhost:3001/api/swap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inputMint: inputMint.trim(),
        outputMint: outputMint.trim(),
        amount,
        slippageBps,
        route: quote.bestRoute
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Swap execution failed: ${error.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error("Swap request timed out after 60 seconds");
    }
    throw error;
  }
};

/**
 * Setup a limit order for a token swap
 * @param {string} inputMint - Input token mint
 * @param {string} outputMint - Output token mint
 * @param {number} inputAmount - Amount to swap
 * @param {number} minOutputAmount - Minimum output required
 * @param {number} expiresInSeconds - Order expiration time
 * @returns {Promise<Object>} Limit order details
 */
const setupLimitOrder = async (inputMint, outputMint, inputAmount, minOutputAmount, expiresInSeconds = 3600) => {
  // Input validation
  if (!inputMint || !outputMint) {
    throw new Error("Both input and output mint addresses are required");
  }
  if (inputAmount <= 0 || minOutputAmount <= 0) {
    throw new Error("Amounts must be positive");
  }
  if (expiresInSeconds < 60 || expiresInSeconds > 86400) {
    throw new Error("Expiration must be between 60 seconds and 24 hours");
  }

  return {
    type: 'LIMIT',
    inputMint: inputMint.trim(),
    outputMint: outputMint.trim(),
    inputAmount,
    minOutputAmount,
    expiresIn: expiresInSeconds,
    createdAt: new Date().toISOString(),
    status: 'PENDING',
    transactionSignature: null
  };
};

/**
 * Validate slippage is within acceptable range
 * @param {number} slippageBps - Slippage in basis points
 * @returns {boolean} Whether slippage is valid
 */
const isValidSlippage = (slippageBps) => {
  return slippageBps >= 0 && slippageBps <= 500;
};
```

## DEX Routing Logic
1. **Jupiter** (Recommended): Best prices, most liquidity
2. **Orca**: Good for stablecoin pairs
3. **Raydium**: Lower slippage for AMM pairs
4. System automatically selects best route

## Slippage Protection
- Default: 50 basis points (0.5%)
- Minimum recommended: 25 bps (0.25%)
- Maximum: 500 bps (5%)
- Prevents sandwich attacks

## Price Impact
- Low: < 1% (most trades)
- Medium: 1-5% (larger amounts)
- High: > 5% (significant slippage)

## Gas Fees
- Included in output calculation
- Typically 0.00025 SOL per swap
- Optimized for batch efficiency

## Limit Orders
```json
{
  "type": "LIMIT",
  "inputMint": "...",
  "outputMint": "...",
  "inputAmount": 1000000000,
  "minOutputAmount": 9500000,
  "expiresIn": 3600
}
```

## Security & Validation
- ✅ Wallet ownership verification
- ✅ Balance validation before swap
- ✅ Slippage protection enabled
- ✅ Price sanity checks
- ✅ Rate limiting (10 swaps/min per user)
- ✅ Input validation on all parameters
- ✅ 60-second timeout on swap execution

## Best Practices
1. Always get quote before executing
2. Use reasonable slippage (0.25-0.5%)
3. Verify price impact < 1%
4. Monitor market conditions
5. Use limit orders for better prices
6. Execute during liquid market hours
7. Set timeouts for limit orders
8. Implement exponential backoff for retries
9. Log all swap transactions

## MCP Tool Definition
```json
{
  "name": "swap_tokens",
  "description": "Execute token swaps with optimized routing",
  "inputSchema": {
    "type": "object",
    "properties": {
      "inputMint": {
        "type": "string",
        "description": "Input token mint address"
      },
      "outputMint": {
        "type": "string",
        "description": "Output token mint address"
      },
      "amount": {
        "type": "number",
        "description": "Amount to swap in smallest unit"
      },
      "slippageBps": {
        "type": "integer",
        "description": "Slippage in basis points (0-500)",
        "default": 50
      },
      "action": {
        "type": "string",
        "enum": ["quote", "execute", "limit_order"],
        "description": "Swap action to perform"
      }
    },
    "required": ["inputMint", "outputMint", "amount", "action"]
  }
}
```
