"use client";

import { useState } from "react";
import SkillsMarketplace from "./SkillsMarketplace";
import SkillsGrid from "./SkillsGrid";

/**
 * SkillsShowcase - Master component that displays BOTH:
 * 1. Original Bags.fm Launch Skills (Token Launcher, Fee Claimer, etc.)
 * 2. New Trading Skills (Sniper, Momentum Trader, etc.)
 */
export default function SkillsShowcase() {
  const [activeTab, setActiveTab] = useState<'bags' | 'trading'>('bags');

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-4 border-b border-slate-700 pb-4">
        <button
          onClick={() => setActiveTab('bags')}
          className={`px-6 py-3 font-bold transition-all rounded-lg ${
            activeTab === 'bags'
              ? 'bg-purple-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          📦 Bags.fm Launch Skills
        </button>
        <button
          onClick={() => setActiveTab('trading')}
          className={`px-6 py-3 font-bold transition-all rounded-lg ${
            activeTab === 'trading'
              ? 'bg-purple-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          🎯 Trading Skills
        </button>
      </div>

      {/* Content */}
      {activeTab === 'bags' && (
        <div>
          <div className="mb-6 p-4 bg-slate-800/30 border border-slate-700 rounded-lg">
            <h2 className="text-xl font-bold mb-2">📦 Bags.fm Launch Skills</h2>
            <p className="text-slate-300 text-sm">
              Professional tools for token launches, fee management, trending detection, and portfolio management on Bags.fm
            </p>
          </div>
          <SkillsMarketplace />
        </div>
      )}

      {activeTab === 'trading' && (
        <div>
          <div className="mb-6 p-4 bg-slate-800/30 border border-slate-700 rounded-lg">
            <h2 className="text-xl font-bold mb-2">🎯 AI Trading Skills</h2>
            <p className="text-slate-300 text-sm">
              Advanced trading agents for sniping, momentum trading, arbitrage, and market making with copyable AI prompts
            </p>
          </div>
          <SkillsGrid showFullPage={false} />
        </div>
      )}
    </div>
  );
}
