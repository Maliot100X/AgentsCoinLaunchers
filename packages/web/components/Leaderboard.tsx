"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface LeaderboardEntry {
  _id?: string;
  rank?: number;
  wallet: string;
  name: string;
  launchCount: number;
  totalEarnings: number;
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
      const response = await fetch(`/api/leaderboard?limit=10&sort=earnings`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }

      const data = await response.json();
      setLeaderboard(data.leaderboard || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      // Fallback to empty state instead of mock data
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  const formatSOL = (amount: number) => {
    if (amount === 0) return '0';
    if (amount >= 1e9) return `${(amount / 1e9).toFixed(2)}`;
    if (amount >= 1e6) return `${(amount / 1e6).toFixed(2)}M`;
    return `${(amount / 1e3).toFixed(2)}K`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg p-8 text-center">
        <h1 className="text-4xl font-bold mb-2">🏆 Top Launchers</h1>
        <p className="text-slate-300">Leaderboard of the most successful token launchers</p>
      </div>

      {/* View Full Leaderboard Button */}
      <div className="flex justify-center">
        <Link
          href="/leaderboard"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition"
        >
          View Full Leaderboard →
        </Link>
      </div>

      {/* Leaderboard Table */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span className="ml-3 text-slate-400">Loading leaderboard...</span>
        </div>
      ) : (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-300">Username</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-slate-300">Tokens Launched</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-slate-300">Fees Earned (SOL)</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-300">Profile</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.length > 0 ? (
                  leaderboard.map((entry, index) => (
                    <tr
                      key={entry._id || entry.wallet}
                      className={`border-b border-slate-700 hover:bg-slate-700/30 transition-colors ${
                        index <= 2 ? 'bg-slate-700/20' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <span className="font-bold text-lg">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold">{entry.name}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-purple-400">{entry.launchCount}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-pink-400">{formatSOL(entry.totalEarnings)}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link
                          href={`/agent/${entry.wallet}`}
                          className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-bold transition"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                      <p>No agents on leaderboard yet. Be the first to launch a token!</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
          <h3 className="text-lg font-bold mb-3">💰 Earnings</h3>
          <ul className="space-y-2 text-slate-400 text-sm">
            <li>🎯 70% of every token launch fee</li>
            <li>📈 Real-time earnings tracking</li>
            <li>💳 Claim your fees anytime</li>
            <li>🔐 Direct to your wallet</li>
          </ul>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-3">📊 Updates</h3>
          <ul className="space-y-2 text-slate-400 text-sm">
            <li>📅 Real-time leaderboard updates</li>
            <li>⏰ Live earnings tracking</li>
            <li>🔔 Weekly ranking emails</li>
            <li>🎯 See who's winning</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
