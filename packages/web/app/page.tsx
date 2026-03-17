"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import TokenLaunch from "../components/TokenLaunch";
import SwapInterface from "../components/SwapInterface";
import SkillsShowcase from "../components/SkillsShowcase";
import Dashboard from "../components/Dashboard";
import Leaderboard from "../components/Leaderboard";
import LaunchedFeed from "../components/LaunchedFeed";
import Link from "next/link";

interface HomeProps {
  initialTab?: string;
}

export default function Home() {
  const { connected } = useWallet();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  
  // Determine tab from pathname
  const getTabFromPath = (path: string): string => {
    const segment = path.split('/')[1] || 'home';
    const tabMap: { [key: string]: string } = {
      '': 'home',
      'home': 'home',
      'launch': 'launch',
      'launched': 'launched',
      'swap': 'swap',
      'dashboard': 'dashboard',
      'leaderboard': 'leaderboard',
      'skills': 'skills',
    };
    return tabMap[segment] || 'home';
  };
  
  const [activeTab, setActiveTab] = useState('home');
  
  // Initialize from pathname on client mount
  useEffect(() => {
    setMounted(true);
    setActiveTab(getTabFromPath(pathname));
  }, [pathname]);
  const [stats, setStats] = useState({
    totalLaunches: 0,
    totalVolume: 0,
    totalUsers: 0,
    activeTrendingTokens: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      setStats({
        totalLaunches: data.tokens || 0,
        totalVolume: (data.totalVolume || 0).toFixed(2),
        totalUsers: data.users || 0,
        activeTrendingTokens: Math.floor(Math.random() * 50) + 10
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              🚀 AgentsCoinLaunchers
            </div>
            <span className="text-xs bg-purple-600/30 text-purple-300 px-3 py-1 rounded-full border border-purple-500/50">
              Beta
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://t.me/TheSistersAgentLauncherSignals" target="_blank" rel="noopener noreferrer"
              className="hover:text-purple-400 transition-colors text-sm">
              📡 Telegram Channel
            </a>
            <WalletMultiButton />
          </div>
        </div>
      </nav>

      {/* Application Interface - Always Visible */}
      <main className="container mx-auto px-4 py-8">
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-4 border-b border-slate-700">
            {[
              { id: 'home', label: '🏠 Home', icon: '🏠' },
              { id: 'launch', label: '🚀 Launch', icon: '🚀' },
              { id: 'launched', label: '🪙 Launched', icon: '🪙' },
              { id: 'swap', label: '🔄 Swap', icon: '🔄' },
              { id: 'skills', label: '📚 Skills', icon: '📚' },
              { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
              { id: 'leaderboard', label: '🏆 Leaderboard', icon: '🏆' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 whitespace-nowrap font-medium transition-all rounded-lg ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="animate-fade-in">
            {activeTab === 'home' && (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
                  <h2 className="text-2xl font-bold mb-4">👋 Welcome!</h2>
                  <p className="text-slate-300 mb-6">
                    Launch tokens, earn fees, and manage your portfolio all from one platform.
                  </p>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="text-2xl">🚀</div>
                      <div>
                        <h3 className="font-bold">Quick Launch</h3>
                        <p className="text-sm text-slate-400">Create tokens in seconds</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="text-2xl">💰</div>
                      <div>
                        <h3 className="font-bold">Earn Fees</h3>
                        <p className="text-sm text-slate-400">70% of launch fees directly to you</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="text-2xl">⚡</div>
                      <div>
                        <h3 className="font-bold">Real-Time Tracking</h3>
                        <p className="text-sm text-slate-400">Monitor trending tokens live</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
                  <h2 className="text-2xl font-bold mb-4">📊 Quick Stats</h2>
                  <div className="space-y-4">
                    <div className="bg-slate-700/30 p-4 rounded-lg">
                      <div className="text-sm text-slate-400">Your Tokens Launched</div>
                      <div className="text-3xl font-bold text-purple-400">0</div>
                    </div>
                    <div className="bg-slate-700/30 p-4 rounded-lg">
                      <div className="text-sm text-slate-400">Total Fees Earned</div>
                      <div className="text-3xl font-bold text-pink-400">0 SOL</div>
                    </div>
                    <div className="bg-slate-700/30 p-4 rounded-lg">
                      <div className="text-sm text-slate-400">Unclaimed Fees</div>
                      <div className="text-3xl font-bold text-cyan-400">0 SOL</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'launch' && <TokenLaunch />}
            {activeTab === 'launched' && <LaunchedFeed />}
            {activeTab === 'swap' && <SwapInterface />}
            {activeTab === 'skills' && <SkillsShowcase />}
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'leaderboard' && <Leaderboard />}
          </div>
        </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="/#launch" className="hover:text-white transition">Launch Token</a></li>
                <li><a href="/#swap" className="hover:text-white transition">Swap</a></li>
                <li><a href="/skills" className="hover:text-white transition">Skills</a></li>
                <li><a href="/docs" className="hover:text-white transition">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Community</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="https://t.me/TheSistersAgentLauncherSignals" target="_blank" className="hover:text-white transition">Telegram Channel</a></li>
                <li><a href="https://t.me/TheSistersAgentLauncherBot" target="_blank" className="hover:text-white transition">Telegram Bot</a></li>
                <li><a href="https://x.com/KaiNovasWarm" target="_blank" className="hover:text-white transition">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition">Discord</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Docs</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="/docs" className="hover:text-white transition">API Docs</a></li>
                <li><a href="/skills" className="hover:text-white transition">Skills</a></li>
                <li><a href="/docs#faq" className="hover:text-white transition">FAQ</a></li>
                <li><a href="/docs#guide" className="hover:text-white transition">Guide</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="/legal/privacy" className="hover:text-white transition">Privacy</a></li>
                <li><a href="/legal/terms" className="hover:text-white transition">Terms</a></li>
                <li><a href="/legal/security" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-8 text-center text-slate-400 text-sm">
            <p>© 2024 AgentsCoinLaunchers. Built on Solana & Bags.fm</p>
            <p className="mt-2">🚀 Earn 70% of all token launch fees. No limits.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
