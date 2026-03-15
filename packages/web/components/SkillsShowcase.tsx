"use client";

import { useState } from "react";
import SkillsMarketplaceImproved from "./SkillsMarketplaceImproved";
import SkillsGrid from "./SkillsGrid";

/**
 * SkillsShowcase - Master component that displays BOTH:
 * 1. Original Bags.fm Launch Skills (Token Launcher, Fee Claimer, etc.) - with elite UI improvements
 * 2. New Trading Skills (Sniper, Momentum Trader, etc.) - with elite UI
 */
export default function SkillsShowcase() {
  const [activeTab, setActiveTab] = useState<'all' | 'bags' | 'trading'>('all');

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-700 pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-6 py-3 font-bold transition-all rounded-lg whitespace-nowrap ${
            activeTab === 'all'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          ⭐ All Skills (12)
        </button>
        <button
          onClick={() => setActiveTab('bags')}
          className={`px-6 py-3 font-bold transition-all rounded-lg whitespace-nowrap ${
            activeTab === 'bags'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          📦 Bags.fm Skills (6)
        </button>
        <button
          onClick={() => setActiveTab('trading')}
          className={`px-6 py-3 font-bold transition-all rounded-lg whitespace-nowrap ${
            activeTab === 'trading'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          🎯 Trading Skills (6)
        </button>
      </div>

      {/* Content */}
      {activeTab === 'all' && (
        <div>
          <div className="mb-6 p-4 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 border border-cyan-600/30 rounded-lg">
            <h2 className="text-xl font-bold mb-2">⭐ All Skills Unified</h2>
            <p className="text-slate-300 text-sm">
              All 12 master-level skills for token launching, trading, analytics, and portfolio management. All with copyable agent prompts and elite UI.
            </p>
          </div>
          <SkillsMarketplaceImproved maxDisplayed={12} />
        </div>
      )}

      {activeTab === 'bags' && (
        <div>
          <div className="mb-6 p-4 bg-cyan-600/10 border border-cyan-600/30 rounded-lg">
            <h2 className="text-xl font-bold mb-2">📦 Bags.fm Launch Skills</h2>
            <p className="text-slate-300 text-sm">
              Professional tools for token launches, fee management, trending detection, portfolio management, price analysis, and trading on Bags.fm. All with improved elite UI and copyable agent prompts.
            </p>
          </div>
          <SkillsMarketplaceImproved maxDisplayed={6} />
        </div>
      )}

      {activeTab === 'trading' && (
        <div>
          <div className="mb-6 p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg">
            <h2 className="text-xl font-bold mb-2">🎯 AI Trading Skills</h2>
            <p className="text-slate-300 text-sm">
              Advanced trading agents for sniping, momentum trading, arbitrage hunting, volume boosting, whale tracking, and market making with copyable AI prompts.
            </p>
          </div>
          <SkillsGrid showFullPage={false} />
        </div>
      )}
    </div>
  );
}
