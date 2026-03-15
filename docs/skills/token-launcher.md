# Token Launcher Skill

## Overview
The Token Launcher Skill enables AI agents and users to deploy new SPL tokens on the Solana blockchain instantly. It handles all aspects of token creation including parameter validation, fee calculation, and transaction verification through Solscan.

## Features
- ✅ Instant token deployment with custom parameters
- ✅ Automatic 70/30 fee distribution (user/platform)
- ✅ Solscan verification for all transactions
- ✅ Batch token creation support
- ✅ Custom supply, decimals, and metadata
- ✅ Webhook notifications on launch
- ✅ Transaction history tracking
- ✅ Real-time status updates

## API Endpoint
```
POST /api/tokens/launch
Content-Type: application/json
```

## Request Parameters
```json
{
  "name": "MyToken",
  "symbol": "MT",
  "supply": 1000000000,
  "decimals": 6,
  "creator": "telegram_user_id",
  "feeReceiver": "9B5X3D4z1QpZ2mL9xK7vN6tF5gH4jS2dW8cE3rU1aV",
  "transactionHash": "hash_from_phantom",
  "description": "Optional token description",
  "imageUrl": "https://example.com/token.png",
  "website": "https://example.com",
  "twitter": "@example"
}
```

## Response Format
```json
{
  "success": true,
  "token": {
    "id": "65abc123def456ghi789jkl0",
    "name": "MyToken",
    "symbol": "MT",
    "mint": "TokenkegQfeZyiNwAJsyFbPVwwQkYk5LWV2PJLpZXqJ",
    "supply": 1000000000,
    "decimals": 6,
    "creator": "telegram_user_id",
    "launchedAt": "2024-03-15T10:30:00Z",
    "status": "ACTIVE"
  },
  "fees": {
    "total": 0.055,
    "userEarnings": 0.0385,
    "platformFee": 0.0165,
    "currency": "SOL"
  },
  "transaction": {
    "hash": "5VNkjJ9...",
    "verified": true,
    "solscanUrl": "https://solscan.io/tx/5VNkjJ9..."
  }
}
```

## Usage Examples

### For Claude
```
Claude: "Launch a token called MyAwesomeToken with symbol MAT. 
Initial supply: 1 billion tokens. 
Send earnings to my wallet."
```

### For Claw Bot
```
Set action: "launch"
Parameters: {
  name: "MyAwesomeToken",
  symbol: "MAT",
  supply: 1000000000
}
```

### For Custom Agents
```javascript
/**
 * Launch a new SPL token on Solana
 * @param {Object} tokenData - Token configuration
 * @param {string} tokenData.name - Token name
 * @param {string} tokenData.symbol - Token symbol
 * @param {number} tokenData.supply - Total supply
 * @param {number} tokenData.decimals - Decimal places
 * @param {string} tokenData.creator - Creator ID
 * @param {string} tokenData.feeReceiver - Fee receiver wallet
 * @param {string} tokenData.transactionHash - Transaction hash
 * @returns {Promise<Object>} Token launch result with mint address
 */
const launchToken = async (tokenData) => {
  // Input validation
  if (!tokenData.name || tokenData.name.trim().length === 0) {
    throw new Error("Token name is required");
  }
  if (!tokenData.symbol || tokenData.symbol.trim().length < 3) {
    throw new Error("Token symbol must be at least 3 characters");
  }
  if (!tokenData.supply || tokenData.supply <= 0) {
    throw new Error("Supply must be greater than 0");
  }
  if (tokenData.supply > 1000000000000) {
    throw new Error("Supply cannot exceed 1 trillion");
  }
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const response = await fetch('http://localhost:3001/api/tokens/launch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tokenData),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Launch failed: ${error.message || response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      transactionSignature: data.transaction?.hash,
      token: data.token,
      fees: data.fees,
      mint: data.token?.mint,
      earnings: data.fees?.userEarnings,
      solscanUrl: data.transaction?.solscanUrl
    };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error("Token launch request timed out after 30 seconds");
    }
    throw error;
  }
};
```

## Fee Structure
- **User Earnings**: 70% (0.0385 SOL per token)
- **Platform Fee**: 30% (0.0165 SOL per token)
- **Total Launch Fee**: 0.055 SOL
- **Fees are non-refundable** once transaction is verified

## Security & Validation
- ✅ Wallet address validation (Solana base58 format)
- ✅ Supply validation (max 1 trillion tokens)
- ✅ Symbol validation (3-10 characters, alphanumeric)
- ✅ Transaction hash verification on Solscan
- ✅ Anti-spam rate limiting (5 launches per hour per user)
- ✅ Slippage protection built-in
- ✅ 30-second timeout on API requests
- ✅ Input sanitization and parameter validation

## Success Criteria
✅ Token deployed to blockchain successfully
✅ Transaction verified on Solscan (confirmed status)
✅ Fees distributed to designated wallets
✅ Mint address recorded in database
✅ User earnings appear in fee tracker
✅ Transaction signature returned in response

## Error Handling
- Invalid wallet format: Returns 400 with error message
- Insufficient SOL for fees: Returns 402 Payment Required
- Transaction failed: Returns 500 with retry instructions
- Rate limit exceeded: Returns 429 with backoff recommendation
- Request timeout: Aborts after 30 seconds

## Best Practices
1. Always verify wallet address before launching
2. Use realistic token supplies (1M - 1B tokens typical)
3. Include metadata (description, image, website) for credibility
4. Monitor trending score after launch
5. Claim fees weekly for better cash flow
6. Implement retry logic with exponential backoff
7. Log transaction signatures for verification

## Integration Webhook
```
POST https://your-webhook-url.com/token-launched
Payload: {
  "tokenId": "id",
  "mint": "address",
  "launched_by": "user_id",
  "timestamp": "2024-03-15T10:30:00Z",
  "transactionSignature": "hash"
}
```

## MCP Tool Definition
```json
{
  "name": "launch_token",
  "description": "Launch a new SPL token on Solana blockchain",
  "inputSchema": {
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "description": "Token name (1-30 characters)"
      },
      "symbol": {
        "type": "string",
        "description": "Token symbol (3-10 alphanumeric characters)"
      },
      "supply": {
        "type": "number",
        "description": "Total token supply (1 to 1,000,000,000,000)"
      },
      "decimals": {
        "type": "integer",
        "description": "Number of decimal places (0-18)",
        "default": 6
      },
      "creator": {
        "type": "string",
        "description": "Creator identifier (telegram_user_id or wallet)"
      },
      "feeReceiver": {
        "type": "string",
        "description": "Solana wallet address for fee distribution"
      },
      "transactionHash": {
        "type": "string",
        "description": "Blockchain transaction hash from wallet"
      },
      "description": {
        "type": "string",
        "description": "Optional token description (max 500 characters)"
      },
      "imageUrl": {
        "type": "string",
        "description": "Optional token image URL"
      },
      "website": {
        "type": "string",
        "description": "Optional project website"
      },
      "twitter": {
        "type": "string",
        "description": "Optional Twitter handle"
      }
    },
    "required": ["name", "symbol", "supply", "creator", "feeReceiver", "transactionHash"]
  }
}
```
