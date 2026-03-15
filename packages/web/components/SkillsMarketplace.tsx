"use client";

import { useState } from "react";

interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  author: string;
  rating: number;
  downloads: number;
  code: string;
  documentation: string;
  usage: string;
}

const SKILLS: Skill[] = [
  {
    id: 'token-launcher',
    name: 'Token Launcher Skill',
    description: 'Create and launch new tokens on Solana instantly',
    category: 'Core',
    author: 'AgentsCoinLaunchers',
    rating: 4.9,
    downloads: 1250,
    usage: 'Used by Claude, Claw Bot, AI Agents',
    documentation: `# Token Launcher Skill

## Overview
Enables AI agents to launch new tokens on Solana with full automation.

## Features
- ✅ Instant token deployment
- ✅ Automatic fee distribution
- ✅ Solscan verification
- ✅ Custom parameters

## API Endpoint
\`POST /api/tokens/launch\`

## Parameters
\`\`\`json
{
  "name": "string",
  "symbol": "string",
  "supply": "number",
  "creator": "string",
  "feeReceiver": "string",
  "transactionHash": "string"
}
\`\`\`

## Response
\`\`\`json
{
  "success": true,
  "token": { ... },
  "fees": {
    "total": 0.055,
    "userFee": 0.0385,
    "platformFee": 0.0165
  }
}
\`\`\`

## Usage Example
For Claude: "Launch a token called MyToken with symbol MT"
For Claw Bot: Set action to "launch" with parameters

## Fee Structure
- User gets 70%: 0.0385 SOL
- Platform gets 30%: 0.0165 SOL

## Success Criteria
✅ Token deployed successfully
✅ Transaction verified on Solscan
✅ Fees distributed within 1 hour`,
    code: `// Token Launcher Implementation
async function launchToken(params) {
  const response = await fetch(
    '${process.env.NEXT_PUBLIC_API_URL}/api/tokens/launch',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    }
  );
  return response.json();
}`
  },
  {
    id: 'fee-claimer',
    name: 'Fee Claimer Skill',
    description: 'Automatically claim and withdraw earned fees',
    category: 'Finance',
    author: 'AgentsCoinLaunchers',
    rating: 4.8,
    downloads: 890,
    usage: 'Used by portfolio managers',
    documentation: `# Fee Claimer Skill

## Overview
Automatically claim accumulated fees from token launches.

## Features
- ✅ Auto-claim feature
- ✅ Batch claiming
- ✅ Transaction verification
- ✅ Wallet management

## API Endpoint
\`POST /api/fees/claim\`

## Parameters
\`\`\`json
{
  "wallet": "string",
  "amount": "number"
}
\`\`\`

## Usage
Perfect for passive income automation.
Claim fees weekly or monthly automatically.`,
    code: `// Fee Claimer
async function claimFees(wallet, amount) {
  return fetch('/api/fees/claim', {
    method: 'POST',
    body: JSON.stringify({ wallet, amount })
  }).then(r => r.json());
}`
  },
  {
    id: 'trending-detector',
    name: 'Trending Detector Skill',
    description: 'Real-time detection of trending tokens on Bags',
    category: 'Analytics',
    author: 'AgentsCoinLaunchers',
    rating: 4.7,
    downloads: 756,
    usage: 'Used by trading bots',
    documentation: `# Trending Detector Skill

## Overview
Detects trending tokens in real-time with scoring.

## Features
- ✅ Real-time detection
- ✅ Trending score calculation
- ✅ Multi-parameter analysis
- ✅ Webhook integration

## API Endpoints
\`GET /api/bags/trending\`
\`GET /api/bags/new\`
\`GET /api/bags/graduating\`

## Trending Score Formula
score = (trades_5m × 0.4) + (volume_5m × 0.4) + (holder_growth × 0.2)

## Response Format
\`\`\`json
{
  "mint": "string",
  "symbol": "string",
  "trending_score": 85,
  "volume_5m": 125.5,
  "trades_5m": 42
}
\`\`\`

## Use Cases
- Scout new opportunities
- Alert on trending tokens
- Portfolio rebalancing signals`,
    code: `// Trending Detector
async function getTrendingTokens() {
  const response = await fetch('/api/bags/trending');
  const tokens = await response.json();
  return tokens.filter(t => t.trending_score > 70);
}`
  },
  {
    id: 'portfolio-manager',
    name: 'Portfolio Manager Skill',
    description: 'Track and manage multiple token portfolios',
    category: 'Management',
    author: 'AgentsCoinLaunchers',
    rating: 4.6,
    downloads: 623,
    usage: 'Used by wealth management',
    documentation: `# Portfolio Manager Skill

## Overview
Comprehensive portfolio tracking and management.

## Features
- ✅ Multi-wallet tracking
- ✅ Performance analytics
- ✅ Risk assessment
- ✅ Rebalancing suggestions

## API Endpoints
\`GET /api/wallet/:address\`
\`GET /api/transactions/:wallet\`
\`GET /api/transactions/:wallet/stats\`

## Data Points Tracked
- Total balance
- Token holdings
- Fee accumulation
- Transaction history
- Performance metrics`,
    code: `// Portfolio Manager
async function getPortfolio(wallet) {
  const stats = await fetch(\`/api/wallet/\${wallet}\`).then(r => r.json());
  const transactions = await fetch(\`/api/transactions/\${wallet}\`).then(r => r.json());
  return { stats, transactions };
}`
  },
  {
    id: 'price-analyzer',
    name: 'Price Analyzer Skill',
    description: 'Analyze token prices and calculate trends',
    category: 'Analytics',
    author: 'AgentsCoinLaunchers',
    rating: 4.5,
    downloads: 512,
    usage: 'Used by analytics engines',
    documentation: `# Price Analyzer Skill

## Overview
Advanced price analysis and trend calculations.

## Features
- ✅ Real-time price feeds
- ✅ Moving averages
- ✅ Volatility analysis
- ✅ Prediction models

## Supported Exchanges
- Bags.fm
- Dexscreener
- Jupiter DEX

## Metrics
- Current price
- 24h change
- 7d trend
- Volume analysis`,
    code: `// Price Analyzer
async function analyzePrices(mint) {
  const current = await getCurrentPrice(mint);
  const history = await getPriceHistory(mint);
  return calculateTrend(history);
}`
  },
  {
    id: 'token-swapper',
    name: 'Token Swapper Skill',
    description: 'Execute token swaps with optimal pricing',
    category: 'Trading',
    author: 'AgentsCoinLaunchers',
    rating: 4.4,
    downloads: 445,
    usage: 'Used by trading bots',
    documentation: `# Token Swapper Skill

## Overview
Execute token swaps with automated optimization.

## Features
- ✅ Multi-DEX routing
- ✅ Slippage optimization
- ✅ Automated execution
- ✅ Price prediction

## Supported Pairs
- SOL ↔ USDC
- SOL ↔ USDT
- Custom token pairs

## API Endpoint
\`POST /api/swap\`

## Response Format
Includes:
- Swap route
- Best price
- Execution details`,
    code: `// Token Swapper
async function swap(fromToken, toToken, amount) {
  return fetch('/api/swap', {
    method: 'POST',
    body: JSON.stringify({ fromToken, toToken, amount })
  }).then(r => r.json());
}`
  }
];

export default function SkillsMarketplace() {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Core', 'Finance', 'Analytics', 'Management', 'Trading'];

  const filteredSkills = SKILLS.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          skill.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg p-8">
        <h1 className="text-4xl font-bold mb-2">📚 Skills Marketplace</h1>
        <p className="text-slate-300">AI-powered tools for Claude, Claw Bot, and other agents</p>
      </div>

      {/* Search & Filter */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Search skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors"
        />

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredSkills.map((skill) => (
          <div
            key={skill.id}
            className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-purple-600/50 transition-all cursor-pointer group"
            onClick={() => setSelectedSkill(skill)}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-1 group-hover:text-purple-400 transition-colors">{skill.name}</h3>
                <p className="text-sm text-slate-400">{skill.category}</p>
              </div>
              <div className="text-2xl ml-4">🎯</div>
            </div>

            <p className="text-slate-300 mb-4 text-sm">{skill.description}</p>

            <div className="flex gap-4 mb-4 text-sm">
              <div>
                <div className="text-slate-400">Rating</div>
                <div className="font-bold text-yellow-400">⭐ {skill.rating}</div>
              </div>
              <div>
                <div className="text-slate-400">Downloads</div>
                <div className="font-bold text-cyan-400">{skill.downloads}</div>
              </div>
            </div>

            <div className="text-xs text-slate-400 mb-4 bg-slate-900/50 p-2 rounded">
              {skill.usage}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(skill.code, skill.id);
              }}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              📋
              {copiedId === skill.id ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
        ))}
      </div>

      {/* Skill Detail Modal */}
      {selectedSkill && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{selectedSkill.name}</h2>
                  <p className="text-slate-400">by {selectedSkill.author}</p>
                </div>
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="text-2xl hover:text-purple-400 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-700/30 p-4 rounded-lg">
                  <div className="text-sm text-slate-400">Rating</div>
                  <div className="text-2xl font-bold text-yellow-400">⭐ {selectedSkill.rating}</div>
                </div>
                <div className="bg-slate-700/30 p-4 rounded-lg">
                  <div className="text-sm text-slate-400">Downloads</div>
                  <div className="text-2xl font-bold text-cyan-400">{selectedSkill.downloads}</div>
                </div>
                <div className="bg-slate-700/30 p-4 rounded-lg">
                  <div className="text-sm text-slate-400">Category</div>
                  <div className="text-2xl font-bold text-purple-400">{selectedSkill.category}</div>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-6">
                <h3 className="text-xl font-bold mb-4">📖 Documentation</h3>
                <div className="bg-slate-900/50 p-4 rounded-lg text-sm text-slate-300 whitespace-pre-wrap font-mono overflow-x-auto max-h-[300px] overflow-y-auto">
                  {selectedSkill.documentation}
                </div>
              </div>

              <div className="border-t border-slate-700 pt-6">
                <h3 className="text-xl font-bold mb-4">💻 Code Implementation</h3>
                <div className="bg-slate-900/50 p-4 rounded-lg text-sm text-slate-300 font-mono overflow-x-auto">
                  <pre>{selectedSkill.code}</pre>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => copyToClipboard(selectedSkill.code, selectedSkill.id)}
                  className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  📋
                  Copy Code
                </button>
                <button
                  onClick={() => copyToClipboard(selectedSkill.documentation, selectedSkill.id)}
                  className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  📖
                  Copy Docs
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
