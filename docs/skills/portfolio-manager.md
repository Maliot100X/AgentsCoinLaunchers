# Portfolio Manager Skill

## Overview
The Portfolio Manager Skill provides comprehensive tracking and management of cryptocurrency portfolios across multiple wallets. Monitor holdings, performance, and risk in real-time.

## Features
- ✅ Multi-wallet tracking (unlimited wallets)
- ✅ Real-time balance updates
- ✅ Comprehensive performance analytics
- ✅ Risk assessment and scoring
- ✅ Rebalancing recommendations
- ✅ Transaction history and filtering
- ✅ Export capabilities (CSV, JSON, PDF)
- ✅ Custom alerts and thresholds

## API Endpoints
```
GET /api/wallet/:address - Wallet details
GET /api/transactions/:wallet - Transaction history
GET /api/transactions/:wallet/stats - Performance stats
POST /api/wallet/add - Add wallet for tracking
```

## Wallet Details Response
```json
{
  "wallet": "9B5X3D4z1QpZ2mL9xK7vN6tF5gH4jS2dW8cE3rU1aV",
  "balance": {
    "sol": 5.25,
    "tokens": 42,
    "totalValue": 250.75,
    "currency": "USD"
  },
  "holdings": [
    {
      "mint": "TokenkegQfeZyiNwAJsyFbPVwwQkYk5LWV2PJLpZXqJ",
      "symbol": "TOKEN",
      "amount": 1000000,
      "value": 125.50,
      "percentage": 50.0
    }
  ],
  "performance": {
    "dayChange": 0.025,
    "weekChange": 0.15,
    "monthChange": 0.42,
    "allTimeReturn": 1.25
  }
}
```

## Transaction Stats Response
```json
{
  "wallet": "address",
  "stats": {
    "totalTransactions": 156,
    "totalVolume": 45320.50,
    "averageSize": 290.39,
    "winRate": 0.68,
    "profitFactor": 2.1,
    "bestTrade": 450.25,
    "worstTrade": -125.50
  },
  "period": "30 days"
}
```

## Usage Examples

### For Claude
```
Claude: "What's my current portfolio value?"
Claude: "Show my wallet holdings"
Claude: "Rebalance my portfolio for better diversification"
Claude: "What's my total trading volume this month?"
```

### For Claw Bot
```
Set action: "portfolio_check"
Parameters: {
  wallet: "user_wallet_address"
}
```

### For Custom Agents
```javascript
/**
 * Get portfolio details for a wallet
 * @param {string} wallet - Solana wallet address
 * @returns {Promise<Object>} Portfolio data with holdings and performance
 */
const getPortfolio = async (wallet) => {
  if (!wallet || wallet.trim().length === 0) {
    throw new Error("Wallet address is required");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`http://localhost:3001/api/wallet/${wallet}`, {
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Failed to get portfolio: ${error.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error("Portfolio request timed out after 15 seconds");
    }
    throw error;
  }
};

/**
 * Get transaction statistics for a wallet
 * @param {string} wallet - Solana wallet address
 * @param {number} days - Number of days to analyze
 * @returns {Promise<Object>} Trading statistics
 */
const getStats = async (wallet, days = 30) => {
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
      `http://localhost:3001/api/transactions/${wallet}/stats?days=${days}`,
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error("Failed to get statistics");
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error("Stats request timed out after 15 seconds");
    }
    throw error;
  }
};

/**
 * Calculate risk score for a portfolio
 * @param {Object} portfolio - Portfolio data
 * @returns {number} Risk score (0-100)
 */
const calculateRiskScore = (portfolio) => {
  let risk = 0;

  // Concentration risk
  if (portfolio.holdings && portfolio.holdings.length > 0) {
    const maxHolding = Math.max(...portfolio.holdings.map(h => h.percentage || 0));
    if (maxHolding > 50) {
      risk += 30;
    } else if (maxHolding > 40) {
      risk += 20;
    }
  }

  // Diversification risk
  if (!portfolio.holdings || portfolio.holdings.length < 5) {
    risk += 20;
  }

  return Math.min(risk, 100);
};

/**
 * Get rebalancing suggestions
 * @param {Object} portfolio - Portfolio data
 * @returns {Array} Rebalancing suggestions
 */
const getRebalancingSuggestions = (portfolio) => {
  if (!portfolio.holdings || portfolio.holdings.length === 0) {
    return [];
  }

  const targetAllocation = 100 / portfolio.holdings.length;

  return portfolio.holdings
    .map(holding => ({
      token: holding.symbol,
      current: holding.percentage,
      target: targetAllocation,
      action: holding.percentage > targetAllocation * 1.2 ? 'REDUCE' : 'HOLD'
    }))
    .filter(s => s.action !== 'HOLD');
};
```

## Risk Scoring System
```
Risk Score (0-100):
- Concentration risk: > 50% in single token
- Volatility risk: Token price swings > 50% weekly
- Liquidity risk: Holdings in low-volume tokens
- Smart contract risk: Unaudited contracts
- Market risk: Overall correlation analysis

Score < 30: 🟢 Low Risk
Score 30-60: 🟡 Moderate Risk
Score 60-80: 🔴 High Risk
Score > 80: 🔴🔴 Very High Risk
```

## Rebalancing Suggestions
```json
{
  "suggestions": [
    {
      "action": "REDUCE",
      "token": "CONCENTRATED_TOKEN",
      "current": 0.75,
      "target": 0.40,
      "reason": "Concentration risk too high"
    },
    {
      "action": "INCREASE",
      "token": "STABLE_TOKEN",
      "current": 0.10,
      "target": 0.30,
      "reason": "Better portfolio stability"
    }
  ]
}
```

## Performance Metrics
- Updated: Every 5 minutes
- Historical retention: Unlimited
- Maximum wallets tracked: Unlimited
- Export formats: CSV, JSON, PDF

## Security & Validation
- ✅ Wallet ownership verification
- ✅ Read-only data access
- ✅ No private key storage
- ✅ Encrypted data transmission
- ✅ IP whitelist support
- ✅ Input validation on wallet addresses

## Best Practices
1. Monitor concentration risk monthly
2. Review rebalancing suggestions quarterly
3. Export reports for tax purposes
4. Set alerts for significant changes
5. Track entry/exit points for analysis
6. Diversify across multiple tokens
7. Review performance regularly

## MCP Tool Definition
```json
{
  "name": "manage_portfolio",
  "description": "Track and manage cryptocurrency portfolios",
  "inputSchema": {
    "type": "object",
    "properties": {
      "wallet": {
        "type": "string",
        "description": "Solana wallet address to track"
      },
      "action": {
        "type": "string",
        "enum": ["get_portfolio", "get_stats", "calculate_risk", "rebalance"],
        "description": "Portfolio management action"
      },
      "days": {
        "type": "integer",
        "description": "Number of days to analyze (1-365)",
        "default": 30
      }
    },
    "required": ["wallet", "action"]
  }
}
```
