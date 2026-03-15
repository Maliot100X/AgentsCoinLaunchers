"use client";

import { useState, useEffect } from "react";

interface LeaderboardEntry {
  rank: number;
  username: string;
  tokensLaunched: number;
  feesEarned: number;
  trending: string;
  avatar: string;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      // Mock data - in production, fetch from API
      const mockData: LeaderboardEntry[] = [
        { rank: 1, username: 'TokenMaster', tokensLaunched: 156, feesEarned: 5.99, trending: '🔥🔥🔥', avatar: '👑' },
        { rank: 2, username: 'SolanaPro', tokensLaunched: 143, feesEarned: 5.48, trending: '🔥🔥', avatar: '🚀' },
        { rank: 3, username: 'CryptoBoss', tokensLaunched: 128, feesEarned: 4.91, trending: '🔥', avatar: '💎' },
        { rank: 4, username: 'CosmicLaunch', tokensLaunched: 94, feesEarned: 3.61, trending: '⭐', avatar: '🌟' },
        { rank: 5, username: 'AgentLauncher', tokensLaunched: 87, feesEarned: 3.34, trending: '⭐', avatar: '🤖' },
        { rank: 6, username: 'TokenGod', tokensLaunched: 76, feesEarned: 2.92, trending: '⭐', avatar: '⚡' },
        { rank: 7, username: 'DeFiWizard', tokensLaunched: 65, feesEarned: 2.49, trending: '📈', avatar: '🧙' },
        { rank: 8, username: 'MoonShot', tokensLaunched: 54, feesEarned: 2.07, trending: '📈', avatar: '🌙' },
        { rank: 9, username: 'LaunchPro', tokensLaunched: 43, feesEarned: 1.65, trending: '📈', avatar: '🎯' },
        { rank: 10, username: 'Trader99', tokensLaunched: 32, feesEarned: 1.23, trending: '📊', avatar: '📊' }
      ];

      setLeaderboard(mockData);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg p-8 text-center">
        <h1 className="text-4xl font-bold mb-2">🏆 Top Launchers</h1>
        <p className="text-slate-300">Leaderboard of the most successful token launchers</p>
      </div>

      {/* Period Selector */}
      <div className="flex gap-4 justify-center">
        {(['week', 'month', 'all'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              period === p
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {p === 'week' ? 'This Week' : p === 'month' ? 'This Month' : 'All Time'}
          </button>
        ))}
      </div>

      {/* Leaderboard Table */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">Rank</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">Username</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-slate-300">Tokens Launched</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-slate-300">Fees Earned (SOL)</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-slate-300">Trending</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => (
                <tr
                  key={entry.rank}
                  className={`border-b border-slate-700 hover:bg-slate-700/30 transition-colors ${
                    entry.rank <= 3 ? 'bg-slate-700/20' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{entry.avatar}</span>
                      <span className="font-bold text-lg">
                        {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold">{entry.username}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-bold text-purple-400">{entry.tokensLaunched}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-bold text-pink-400">{entry.feesEarned}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-lg">{entry.trending}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-3">🏅 How to Rank</h3>
          <ul className="space-y-2 text-slate-400 text-sm">
            <li>✅ Launch tokens successfully</li>
            <li>✅ Earn fees from launches</li>
            <li>✅ Create trending tokens</li>
            <li>✅ Build community engagement</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-3">🎁 Top Rewards</h3>
          <ul className="space-y-2 text-slate-400 text-sm">
            <li>🥇 #1: Featured & 2x boost</li>
            <li>🥈 #2: 1.5x boost</li>
            <li>🥉 #3: 1.2x boost</li>
            <li>⭐ Top 10: Special badge</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-3">📊 Updates</h3>
          <ul className="space-y-2 text-slate-400 text-sm">
            <li>📅 Weekly leaderboard refresh</li>
            <li>⏰ Real-time score updates</li>
            <li>🔔 Weekly ranking emails</li>
            <li>🎯 Monthly contests & prizes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
