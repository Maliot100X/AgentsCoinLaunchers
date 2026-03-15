# Price Analyzer Skill

## Overview
The Price Analyzer Skill provides advanced price analysis, trend calculations, and technical indicators for tokens on Solana. Real-time data from multiple sources with predictive modeling.

## Features
- ✅ Real-time price feeds (updated every 10 seconds)
- ✅ Moving averages (5, 10, 20, 50, 200 day)
- ✅ Volatility analysis with Bollinger Bands
- ✅ Technical indicators (RSI, MACD, Stochastic)
- ✅ Prediction models and forecasting
- ✅ Support/resistance level detection
- ✅ Multi-timeframe analysis
- ✅ Historical price data (unlimited)

## Supported Data Sources
- Bags.fm (primary Solana DEX)
- Dexscreener (DEX aggregator)
- Jupiter (price feeds)
- Multiple blockchain validators

## API Endpoints
```
GET /api/tokens/:symbol - Current price
GET /api/tokens/:symbol/history - Historical data
POST /api/price/analyze - Advanced analysis
```

## Price Data Response
```json
{
  "mint": "TokenkegQfeZyiNwAJsyFbPVwwQkYk5LWV2PJLpZXqJ",
  "symbol": "TOKEN",
  "price": 0.0000125,
  "timestamp": "2024-03-15T10:30:00Z",
  "change": {
    "change_5m": 0.0025,
    "change_1h": 0.0125,
    "change_24h": 0.0850,
    "change_7d": 0.2500
  },
  "volume": {
    "volume_5m": 125.5,
    "volume_1h": 456.2,
    "volume_24h": 2150.8
  },
  "technical": {
    "rsi_14": 68,
    "macd": 0.0000045,
    "bollinger_upper": 0.0000156,
    "bollinger_middle": 0.0000125,
    "bollinger_lower": 0.0000094,
    "support": 0.0000110,
    "resistance": 0.0000140
  }
}
```

## Moving Averages
```json
{
  "ma_5d": 0.0000124,
  "ma_10d": 0.0000122,
  "ma_20d": 0.0000118,
  "ma_50d": 0.0000110,
  "ma_200d": 0.0000095
}
```

## Usage Examples

### For Claude
```
Claude: "What's the current price of TOKEN?"
Claude: "Is TOKEN trending up or down over 7 days?"
Claude: "Calculate the RSI for TOKEN"
Claude: "Show me support and resistance levels"
```

### For Claw Bot
```
Set action: "analyze_price"
Parameters: {
  token: "TOKEN",
  timeframe: "1h"
}
```

### For Custom Agents
```javascript
/**
 * Get current price for a token
 * @param {string} mint - Token mint address or symbol
 * @returns {Promise<Object>} Current price data with technical indicators
 */
const getPrice = async (mint) => {
  if (!mint || mint.trim().length === 0) {
    throw new Error("Token mint or symbol is required");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`http://localhost:3001/api/tokens/${mint}`, {
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Failed to get price: ${error.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error("Price request timed out after 15 seconds");
    }
    throw error;
  }
};

/**
 * Get historical price data
 * @param {string} mint - Token mint address
 * @param {number} days - Number of days to retrieve
 * @returns {Promise<Object>} Historical price data
 */
const getPriceHistory = async (mint, days = 30) => {
  if (!mint || mint.trim().length === 0) {
    throw new Error("Token mint is required");
  }
  if (days < 1 || days > 730) {
    throw new Error("Days must be between 1 and 730");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(
      `http://localhost:3001/api/tokens/${mint}/history?days=${days}`,
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error("Failed to get price history");
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

/**
 * Analyze price with technical indicators
 * @param {string} mint - Token mint address
 * @returns {Promise<Object>} Full analysis with signals
 */
const analyzePrice = async (mint) => {
  if (!mint || mint.trim().length === 0) {
    throw new Error("Token mint is required");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch('http://localhost:3001/api/price/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mint: mint.trim() }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Analysis failed: ${error.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error("Analysis request timed out after 30 seconds");
    }
    throw error;
  }
};

/**
 * Calculate trend from price history
 * @param {Array} history - Price history data
 * @returns {string} Trend indicator
 */
const calculateTrend = (history) => {
  if (!history || history.length < 2) {
    return 'NEUTRAL';
  }

  const recent = history.slice(-10);
  const older = history.slice(0, 10);

  const recentAvg = recent.reduce((a, p) => a + (p.price || 0), 0) / recent.length;
  const olderAvg = older.reduce((a, p) => a + (p.price || 0), 0) / older.length;

  if (recentAvg > olderAvg * 1.1) {
    return 'UPTREND';
  }
  if (recentAvg < olderAvg * 0.9) {
    return 'DOWNTREND';
  }
  return 'NEUTRAL';
};

/**
 * Generate trading signals from price data
 * @param {Object} price - Price data with technical indicators
 * @returns {Array} Trading signals
 */
const generateSignals = (price) => {
  const signals = [];

  if (price.technical) {
    if (price.technical.rsi_14 > 70) {
      signals.push({
        type: 'OVERBOUGHT',
        level: price.technical.rsi_14,
        description: 'RSI indicates overbought condition'
      });
    }
    if (price.technical.rsi_14 < 30) {
      signals.push({
        type: 'OVERSOLD',
        level: price.technical.rsi_14,
        description: 'RSI indicates oversold condition'
      });
    }
    if (price.price > price.technical.resistance) {
      signals.push({
        type: 'RESISTANCE_BREAKOUT',
        description: 'Price broke above resistance level'
      });
    }
    if (price.price < price.technical.support) {
      signals.push({
        type: 'SUPPORT_BREAKOUT',
        description: 'Price broke below support level'
      });
    }
  }

  return signals;
};
```

## Technical Indicators

### RSI (Relative Strength Index)
- Range: 0-100
- Overbought: > 70
- Oversold: < 30
- Neutral: 40-60

### MACD (Moving Average Convergence Divergence)
- Positive: Bullish
- Negative: Bearish
- Crossover: Trend change signal

### Bollinger Bands
- Price near upper: Potentially overbought
- Price near lower: Potentially oversold
- Width: Volatility measure

## Prediction Models
```json
{
  "forecast_1h": {
    "expected_price": 0.0000126,
    "confidence": 0.75,
    "range": [0.0000120, 0.0000132]
  },
  "forecast_24h": {
    "expected_price": 0.0000135,
    "confidence": 0.62,
    "range": [0.0000110, 0.0000160]
  }
}
```

## Data Updates
- Real-time: < 10 seconds
- Historical: Last 2 years
- Indicators: Updated every 5 minutes
- Predictions: Recalculated hourly

## Best Practices
1. Use multiple indicators for confirmation
2. Consider volume alongside price
3. Monitor RSI extremes for reversals
4. Watch moving average crossovers
5. Set alerts at support/resistance levels
6. Verify with multiple data sources
7. Combine technical with fundamental analysis
8. Use appropriate timeframes for decisions

## MCP Tool Definition
```json
{
  "name": "analyze_price",
  "description": "Analyze token prices with technical indicators",
  "inputSchema": {
    "type": "object",
    "properties": {
      "mint": {
        "type": "string",
        "description": "Token mint address or symbol"
      },
      "days": {
        "type": "integer",
        "description": "Days of historical data (1-730)",
        "default": 30
      },
      "timeframe": {
        "type": "string",
        "enum": ["5m", "1h", "4h", "1d"],
        "description": "Analysis timeframe"
      }
    },
    "required": ["mint"]
  }
}
```
