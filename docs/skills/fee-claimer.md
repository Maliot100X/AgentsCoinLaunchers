# Fee Claimer Skill

## Overview
The Fee Claimer Skill automates the process of claiming and withdrawing accumulated SOL fees from your token launches. It provides real-time fee tracking, batch claiming, and secure wallet transfers.

## Features
- ✅ Real-time fee accumulation tracking
- ✅ Batch claiming support (claim multiple fees at once)
- ✅ Scheduled automatic claiming (weekly, monthly, custom)
- ✅ Transaction verification and security checks
- ✅ Wallet-to-wallet direct transfers
- ✅ Fee history and analytics
- ✅ Webhook notifications on claims
- ✅ CSV export capabilities
- ✅ Two-factor confirmation available
- ✅ IP whitelist support

## API Endpoints
```
GET /api/fees/:wallet - Get accumulated fees
GET /api/fees/:wallet/history - Fee history
POST /api/fees/claim - Claim fees
POST /api/fees/claim/batch - Batch claim multiple fees
```

## Request Format - Claim Single Fee
```json
{
  "wallet": "9B5X3D4z1QpZ2mL9xK7vN6tF5gH4jS2dW8cE3rU1aV",
  "amount": 0.5,
  "transactionHash": "hash_from_phantom"
}
```

## Response Format
```json
{
  "success": true,
  "claim": {
    "id": "claim_65abc123",
    "wallet": "9B5X3D4z1QpZ2mL9xK7vN6tF5gH4jS2dW8cE3rU1aV",
    "amount": 0.5,
    "currency": "SOL",
    "status": "COMPLETED",
    "claimedAt": "2024-03-15T10:30:00Z",
    "transactionHash": "4xH2K9..."
  },
  "remaining": {
    "unclaimed": 2.3,
    "previouslyClaimed": 5.8,
    "totalEarned": 8.1
  }
}
```

## Batch Claim Request
```json
{
  "wallet": "9B5X3D4z1QpZ2mL9xK7vN6tF5gH4jS2dW8cE3rU1aV",
  "claimAll": true
}
```

## Usage Examples

### For Claude
```
Claude: "Claim all my accumulated fees and send to my wallet"
Claude: "Show me my fee history for the last 30 days"
Claude: "Claim 0.5 SOL in fees"
```

### For Claw Bot
```
Set action: "claim"
Parameters: {
  wallet: "user_wallet_address",
  amount: 0.5
}
```

### For Custom Agents
```javascript
/**
 * Claim accumulated fees from token launches
 * @param {string} wallet - Solana wallet address
 * @param {number} amount - Amount to claim (null = claim all)
 * @param {string} transactionHash - Blockchain transaction hash
 * @returns {Promise<Object>} Claim result with transaction details
 */
const claimFees = async (wallet, amount, transactionHash) => {
  // Input validation
  if (!wallet || wallet.trim().length === 0) {
    throw new Error("Wallet address is required");
  }
  if (amount !== null && typeof amount === 'number' && amount <= 0) {
    throw new Error("Amount must be greater than 0");
  }
  if (!transactionHash || transactionHash.trim().length === 0) {
    throw new Error("Transaction hash is required");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch('http://localhost:3001/api/fees/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wallet: wallet.trim(),
        amount: amount || null,
        transactionHash: transactionHash.trim()
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Claim failed: ${error.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error("Claim request timed out after 30 seconds");
    }
    throw error;
  }
};

/**
 * Claim all accumulated fees
 * @param {string} wallet - Solana wallet address
 * @param {string} transactionHash - Blockchain transaction hash
 * @returns {Promise<Object>} Claim all result
 */
const claimAllFees = async (wallet, transactionHash) => {
  return await claimFees(wallet, null, transactionHash);
};

/**
 * Get fee balance for a wallet
 * @param {string} wallet - Solana wallet address
 * @returns {Promise<Object>} Fee balance details
 */
const getFeeBalance = async (wallet) => {
  if (!wallet || wallet.trim().length === 0) {
    throw new Error("Wallet address is required");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`http://localhost:3001/api/fees/${wallet}`, {
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Failed to get balance: ${error.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error("Balance request timed out after 15 seconds");
    }
    throw error;
  }
};

/**
 * Get fee history for a wallet
 * @param {string} wallet - Solana wallet address
 * @param {number} days - Number of days to retrieve
 * @returns {Promise<Object>} Fee history data
 */
const getFeeHistory = async (wallet, days = 30) => {
  if (!wallet || wallet.trim().length === 0) {
    throw new Error("Wallet address is required");
  }
  if (days < 1 || days > 365) {
    throw new Error("Days must be between 1 and 365");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(
      `http://localhost:3001/api/fees/${wallet}/history?days=${days}`,
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Failed to get history: ${error.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error("History request timed out after 15 seconds");
    }
    throw error;
  }
};
```

## Fee Accumulation Details
- Fees accumulate in real-time as tokens launch
- Your wallet receives 70% of all launch fees (0.0385 SOL per token)
- No minimum claim amount required
- Claims are irreversible (sent directly to your wallet)
- Network fees (gas) deducted from claim amount

## Security & Validation
- ✅ Wallet ownership verification
- ✅ Transaction hash verification
- ✅ Rate limiting (max 10 claims per hour)
- ✅ Amount validation (cannot exceed available balance)
- ✅ Two-factor confirmation available
- ✅ IP whitelist support

## Automatic Scheduling
Set recurring claims:
```json
{
  "wallet": "address",
  "schedule": "weekly",
  "day": "friday",
  "time": "15:00",
  "minAmount": 0.1
}
```

## Fee History & Export
```
GET /api/fees/:wallet/history?format=csv&days=30
```

## Best Practices
1. Claim fees weekly for steady cash flow
2. Keep track of tax implications
3. Monitor historical data for patterns
4. Set minimum thresholds to reduce gas fees
5. Use batch claiming for multiple wallets
6. Enable 2FA for additional security
7. Whitelist trusted IP addresses

## Webhook Notifications
```
POST https://your-webhook/fee-claimed
Payload: {
  "amount": 0.5,
  "wallet": "address",
  "timestamp": "2024-03-15T10:30:00Z",
  "transactionSignature": "hash"
}
```

## MCP Tool Definition
```json
{
  "name": "claim_fees",
  "description": "Claim accumulated SOL fees from token launches",
  "inputSchema": {
    "type": "object",
    "properties": {
      "wallet": {
        "type": "string",
        "description": "Solana wallet address to claim fees to"
      },
      "amount": {
        "type": "number",
        "description": "Amount to claim in SOL (null to claim all)"
      },
      "transactionHash": {
        "type": "string",
        "description": "Blockchain transaction hash for verification"
      },
      "claimAll": {
        "type": "boolean",
        "description": "Claim all accumulated fees"
      }
    },
    "required": ["wallet", "transactionHash"]
  }
}
```
