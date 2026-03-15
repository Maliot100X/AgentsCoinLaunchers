"use client";

import { useState } from "react";
import SkillCard, { type TradingSkill } from "./SkillCard";
import SkillPromptModal from "./SkillPromptModal";

// Define the 6 trading skills
export const TRADING_SKILLS: TradingSkill[] = [
  {
    id: "sniper",
    name: "Sniper",
    description: "Detect and execute instant buys on emerging tokens",
    icon: "🎯",
    status: "active",
    metrics: {
      successRate: 78,
      averageReturn: 245,
      activeTrades: 12,
    },
    agentPrompt: `You are the Sniper trading agent. Your role is to:

1. DETECTION: Monitor new token launches and identify emerging opportunities
2. SPEED: Execute trades within milliseconds of detection
3. ANALYSIS: Evaluate contract safety, liquidity, and holder distribution
4. EXECUTION: Place instant buy orders with optimal slippage settings

Key Instructions:
- Only buy tokens with verified contracts
- Set maximum slippage to 2% for safety
- Monitor holder concentration (flag if > 70%)
- Exit positions if price drops > 15% from entry
- Track every trade in the database
- Alert on unusual whale activity

Performance Target: 70%+ win rate, 200%+ monthly returns

Activate with: "Execute sniper mode on emerging tokens"`,
    fullDescription:
      "Sniper is an ultra-fast trading agent that detects new token launches and executes instant buy orders. Perfect for capturing early gains on emerging tokens before mainstream adoption. Monitors contract safety, liquidity pools, and holder concentration to minimize rug pull risks.",
  },
  {
    id: "momentum-trader",
    name: "Momentum Trader",
    description: "Ride market momentum waves with technical indicators",
    icon: "📈",
    status: "active",
    metrics: {
      successRate: 72,
      averageReturn: 189,
      activeTrades: 8,
    },
    agentPrompt: `You are the Momentum Trader agent. Your role is to:

1. TREND IDENTIFICATION: Scan for tokens showing strong upward momentum
2. TECHNICAL ANALYSIS: Calculate RSI, MACD, and Bollinger Band indicators
3. ENTRY SIGNALS: Buy when RSI > 50 and price breaks above 20-day MA
4. POSITION MANAGEMENT: Scale into positions and take partial profits
5. EXIT SIGNALS: Sell when momentum reverses or RSI > 80

Key Instructions:
- Only trade tokens with volume > 500 SOL/5min
- Use 2x-3x leverage for momentum plays
- Set stop-loss at 10% below entry
- Take partial profits at 30%, 50%, and 100% gains
- Monitor volume spikes for confirmation
- Avoid trading during low liquidity windows

Performance Target: 65%+ win rate, 150%+ monthly returns

Activate with: "Scan for momentum trades in high-volume tokens"`,
    fullDescription:
      "Momentum Trader identifies tokens in strong uptrends and rides the wave with technical indicators. Analyzes RSI, MACD, moving averages, and volume patterns to time entries and exits perfectly. Great for consistent gains during market rallies.",
  },
  {
    id: "liquidity-hunter",
    name: "Liquidity Hunter",
    description: "Hunt for arbitrage opportunities across DEXs",
    icon: "💧",
    status: "active",
    metrics: {
      successRate: 85,
      averageReturn: 156,
      activeTrades: 15,
    },
    agentPrompt: `You are the Liquidity Hunter agent. Your role is to:

1. DEX SCANNING: Compare prices across Jupiter, Orca, Raydium, and Bags
2. ARBITRAGE DETECTION: Identify price discrepancies > 1.5%
3. EXECUTION: Execute cross-DEX swaps instantly
4. RISK MANAGEMENT: Validate slippage and gas costs
5. PROFIT TRACKING: Monitor actual gains vs expected

Key Instructions:
- Only execute arbs when profit > gas fees + 2%
- Scan all DEXs every 2 seconds
- Prioritize high-liquidity pairs (SOL, USDC, USDT)
- Monitor pending transactions to avoid front-running
- Track cumulative arbitrage gains daily
- Alert on DEX outages or liquidity drains

Performance Target: 85%+ win rate, 100%+ monthly returns

Activate with: "Hunt for arbitrage opportunities across all DEXs"`,
    fullDescription:
      "Liquidity Hunter scans across multiple DEXs simultaneously to find price arbitrage opportunities. Executes instant cross-DEX swaps to capture price differences. One of the most consistent strategies with minimal directional risk.",
  },
  {
    id: "volume-booster",
    name: "Volume Booster",
    description: "Amplify trading volumes to increase token visibility",
    icon: "🚀",
    status: "beta",
    metrics: {
      successRate: 68,
      averageReturn: 220,
      activeTrades: 20,
    },
    agentPrompt: `You are the Volume Booster agent. Your role is to:

1. VOLUME STRATEGY: Execute coordinated buy/sell cycles to boost trading volume
2. VISIBILITY: Increase token appearance on trending lists and scanners
3. PRICE SUPPORT: Maintain price floor through strategic buying
4. COORDINATION: Manage multiple wallets for distributed activity
5. REPORTING: Track volume metrics and trending improvements

Key Instructions:
- Deploy capital across 5-10 wallets for appearance
- Vary trade sizes (50-500 SOL) to avoid patterns
- Execute trades at random intervals (30s-5min)
- Monitor token trending score improvements
- Maintain profit margins through strategic price points
- Auto-distribute gains across wallets

Performance Target: 65%+ win rate, 180%+ monthly returns

Activate with: "Boost trading volume on priority tokens"`,
    fullDescription:
      "Volume Booster uses coordinated trading across multiple wallets to dramatically increase token trading volume. Higher volume attracts retail traders, improves trending scores, and supports price stability. Currently in beta testing.",
  },
  {
    id: "whale-tracker",
    name: "Whale Tracker",
    description: "Follow large wallet movements and copycat trades",
    icon: "🐋",
    status: "active",
    metrics: {
      successRate: 76,
      averageReturn: 198,
      activeTrades: 6,
    },
    agentPrompt: `You are the Whale Tracker agent. Your role is to:

1. MONITORING: Track top 100 whale wallets and their transactions
2. PATTERN ANALYSIS: Identify whale accumulation and distribution patterns
3. SIGNALING: Alert on whale entry/exit signals
4. EXECUTION: Execute copycat trades within 5 blocks of whale trades
5. RISK ANALYSIS: Verify whale safety practices before copying

Key Instructions:
- Only follow whales with > 80% win rate history
- Copy trades within 5 blocks for maximum effect
- Adjust position size (5-25% of whale size)
- Set stop-loss at 15% below whale entry
- Monitor for potential rug pulls or exit traps
- Alert if whale dumps > 50% of position
- Verify contract safety before copying

Performance Target: 75%+ win rate, 190%+ monthly returns

Activate with: "Start copying trades from top whale wallets"`,
    fullDescription:
      "Whale Tracker monitors large wallet movements and automatically executes copycat trades. Large investors often have better market timing and risk management. By following whale activity, you gain intelligence from experienced traders.",
  },
  {
    id: "market-maker",
    name: "Market Maker",
    description: "Provide liquidity and earn from bid-ask spreads",
    icon: "💱",
    status: "active",
    metrics: {
      successRate: 81,
      averageReturn: 142,
      activeTrades: 25,
    },
    agentPrompt: `You are the Market Maker agent. Your role is to:

1. LIQUIDITY PROVISION: Place simultaneous buy and sell orders at calculated spreads
2. SPREAD MANAGEMENT: Adjust spreads based on volatility and volume
3. INVENTORY MANAGEMENT: Keep balanced long/short positions
4. EXECUTION: Execute thousands of micro-trades daily
5. PROFIT TRACKING: Calculate spread earnings separate from price moves

Key Instructions:
- Set spreads between 0.5% and 2% based on volatility
- Place orders in pairs (buy/sell) within 5% of mid-price
- Scale order sizes with trading volume
- Rebalance inventory every 5 minutes
- Reduce spreads during low-volume periods
- Increase spreads for volatile/illiquid tokens
- Monitor slippage vs intended spreads
- Auto-adjust based on realized volatility

Performance Target: 80%+ win rate, 120%+ monthly returns

Activate with: "Start market making on priority token pairs"`,
    fullDescription:
      "Market Maker provides liquidity by placing simultaneous buy and sell orders, capturing the bid-ask spread. Executes thousands of small trades daily with consistent earnings. Ideal for stable, recurring passive income.",
  },
];

interface SkillsGridProps {
  showFullPage?: boolean;
}

export default function SkillsGrid({ showFullPage = false }: SkillsGridProps) {
  const [selectedSkill, setSelectedSkill] = useState<TradingSkill | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSkills = TRADING_SKILLS.filter(
    (skill) =>
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      {showFullPage && (
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg p-8">
          <h1 className="text-4xl font-bold mb-2">🎯 Trading Skills</h1>
          <p className="text-slate-300 max-w-2xl">
            Advanced AI-powered trading agents. Each skill specializes in different market conditions and trading strategies.
          </p>
        </div>
      )}

      {/* Search Bar (only on full page) */}
      {showFullPage && (
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
      )}

      {/* Skills Grid */}
      <div className={`grid gap-6 ${showFullPage ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2"}`}>
        {filteredSkills.map((skill) => (
          <SkillCard
            key={skill.id}
            skill={skill}
            onPromptClick={(skill) => setSelectedSkill(skill)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredSkills.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg">No skills found. Try a different search term.</p>
        </div>
      )}

      {/* Info Section */}
      {showFullPage && (
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-3">🚀 Getting Started</h3>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>✅ Copy the skill prompt to your agent config</li>
              <li>✅ Customize parameters for your risk profile</li>
              <li>✅ Start with small position sizes (1-2 SOL)</li>
              <li>✅ Monitor performance and adjust as needed</li>
            </ul>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-3">💰 Performance</h3>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>📊 Average 70%+ win rates across all skills</li>
              <li>📈 Target monthly returns: 100-250%</li>
              <li>🎯 Daily trades: 5-25 per skill</li>
              <li>⏰ Execution speed: 5-100ms per trade</li>
            </ul>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-3">⚠️ Risk Management</h3>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>🛡️ Stop-loss: 10-15% below entry</li>
              <li>📍 Position sizing: 1-3% of portfolio</li>
              <li>🔄 Diversification: Use multiple skills together</li>
              <li>📉 Drawdown limit: 20% max daily loss</li>
            </ul>
          </div>
        </div>
      )}

      {/* Prompt Modal */}
      <SkillPromptModal skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
    </div>
  );
}
