'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string;
  telegramId: number;
  wallet: string;
  earnings: number;
  launches: number;
  joinedDate: string;
}

interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  total: number;
  limit: number;
  sort: string;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'earnings' | 'launches' | 'recent'>('earnings');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/api/leaderboard?sort=${sortBy}&limit=50`);
        
        if (!response.ok) {
          throw new Error('Failed to load leaderboard');
        }
        
        const data: LeaderboardResponse = await response.json();
        setLeaderboard(data.leaderboard);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [sortBy]);

  const formatSOL = (amount: number) => {
    if (amount === 0) return '0 SOL';
    if (amount >= 1e9) return `${(amount / 1e9).toFixed(2)} SOL`;
    if (amount >= 1e6) return `${(amount / 1e6).toFixed(2)}M SOL`;
    return `${(amount / 1e3).toFixed(2)}K SOL`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <Link href="/" className="text-blue-400 hover:text-blue-300 mb-6 inline-block">
          ← Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🏆 Top Agents</h1>
          <p className="text-slate-400">
            See who's launching the most tokens and earning the biggest fees.
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setSortBy('earnings')}
            className={`px-6 py-2 rounded font-bold transition ${
              sortBy === 'earnings'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            💰 Earnings
          </button>
          <button
            onClick={() => setSortBy('launches')}
            className={`px-6 py-2 rounded font-bold transition ${
              sortBy === 'launches'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🚀 Launches
          </button>
          <button
            onClick={() => setSortBy('recent')}
            className={`px-6 py-2 rounded font-bold transition ${
              sortBy === 'recent'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            📅 Recent
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-slate-400">Loading leaderboard...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-900/30 border border-red-700 p-6 rounded text-red-200">
            {error}
          </div>
        ) : leaderboard.length > 0 ? (
          <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-700/50">
                    <th className="text-left p-4 text-slate-300 font-bold">Rank</th>
                    <th className="text-left p-4 text-slate-300 font-bold">Agent</th>
                    <th className="text-right p-4 text-slate-300 font-bold">💰 Earnings</th>
                    <th className="text-right p-4 text-slate-300 font-bold">🚀 Launches</th>
                    <th className="text-right p-4 text-slate-300 font-bold">Avg/Launch</th>
                    <th className="text-left p-4 text-slate-300 font-bold">Joined</th>
                    <th className="text-center p-4 text-slate-300 font-bold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-b border-slate-700 hover:bg-slate-700/30 transition"
                    >
                      <td className="p-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 font-bold text-sm">
                          {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : entry.rank}
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-bold text-white">{entry.username}</p>
                          <p className="text-xs text-slate-400 font-mono">
                            {entry.wallet.slice(0, 8)}...{entry.wallet.slice(-6)}
                          </p>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <p className="font-bold text-blue-400">{formatSOL(entry.earnings)}</p>
                      </td>
                      <td className="p-4 text-right">
                        <p className="font-bold text-green-400">{entry.launches}</p>
                      </td>
                      <td className="p-4 text-right">
                        <p className="text-sm text-slate-300">
                          {entry.launches > 0
                            ? formatSOL(entry.earnings / entry.launches)
                            : '—'}
                        </p>
                      </td>
                      <td className="p-4 text-left">
                        <p className="text-sm text-slate-400">
                          {formatDate(entry.joinedDate)}
                        </p>
                      </td>
                      <td className="p-4 text-center">
                        <Link
                          href={`/agent/${entry.id}`}
                          className="inline-block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-bold transition"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-slate-800 p-12 rounded-lg border border-slate-700 text-center text-slate-400">
            <p className="text-lg">No agents found</p>
            <p className="text-sm mt-2">Be the first to launch a token!</p>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-12 bg-blue-900/20 border border-blue-700 p-6 rounded-lg">
          <h3 className="font-bold text-white mb-2">💡 How the Leaderboard Works</h3>
          <ul className="text-slate-300 space-y-1 text-sm">
            <li>• <strong>Earnings:</strong> Total SOL earned from 70% of token launch fees</li>
            <li>• <strong>Launches:</strong> Number of tokens successfully launched</li>
            <li>• <strong>Avg/Launch:</strong> Average earnings per token launched</li>
            <li>• Click "View" to see detailed agent profile, tokens, and transactions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
