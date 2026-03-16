'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Agent {
  id: string;
  username: string;
  telegramId: number;
  wallet: string;
  joinedDate: string;
  totalEarnings: number;
  tokensLaunched: number;
  tokens: Array<{
    id: string;
    name: string;
    symbol: string;
    mint: string;
    launchedAt: string;
    supply: number;
    price: number;
    volume: number;
    holders: number;
  }>;
  recentTransactions: Array<{
    id: string;
    type: string;
    amount: number;
    fromWallet: string;
    toWallet: string;
    timestamp: string;
  }>;
}

export default function AgentProfilePage() {
  const params = useParams();
  const agentId = params?.agentId as string;
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        setLoading(true);
        // Use leaderboard API to get agent data
        const response = await fetch(`/api/leaderboard?limit=1000`);
        
        if (!response.ok) {
          throw new Error('Failed to load agent profile');
        }
        
        const data = await response.json();
        // Find agent by wallet ID
        const foundAgent = data.leaderboard.find((agent: any) => agent.wallet === agentId);
        
        if (!foundAgent) {
          throw new Error('Agent not found');
        }
        
        // Map API data to Agent interface
        setAgent({
          id: foundAgent.wallet,
          username: foundAgent.name,
          telegramId: 0,
          wallet: foundAgent.wallet,
          joinedDate: foundAgent.lastLaunchDate || new Date().toISOString(),
          totalEarnings: foundAgent.totalEarnings || 0,
          tokensLaunched: foundAgent.launchCount || 0,
          tokens: foundAgent.tokens || [],
          recentTransactions: []
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching agent:', err);
      } finally {
        setLoading(false);
      }
    };

    if (agentId && agentId !== 'undefined') {
      fetchAgent();
    }
  }, [agentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-slate-400">Loading agent profile...</p>
        </div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <Link href="/" className="text-blue-400 hover:text-blue-300 mb-6 inline-block">
            ← Back
          </Link>
          <div className="bg-red-900/30 border border-red-700 p-6 rounded">
            <p className="text-red-200">{error || 'Agent not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatSOL = (amount: number) => {
    return (amount / 1e9).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <Link href="/" className="text-blue-400 hover:text-blue-300 mb-6 inline-block">
          ← Back to Home
        </Link>

        {/* Agent Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-8 rounded-lg border border-slate-700 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{agent.username}</h1>
              <p className="text-slate-400 text-sm">Telegram ID: {agent.telegramId}</p>
              <p className="text-slate-400 text-sm mt-1">
                Joined: {formatDate(agent.joinedDate)}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-8">
            <div className="bg-slate-900/50 p-4 rounded">
              <p className="text-slate-400 text-sm">Total Earnings</p>
              <p className="text-2xl font-bold text-blue-400 mt-1">
                {formatSOL(agent.totalEarnings)} SOL
              </p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded">
              <p className="text-slate-400 text-sm">Tokens Launched</p>
              <p className="text-2xl font-bold text-green-400 mt-1">
                {agent.tokensLaunched}
              </p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded">
              <p className="text-slate-400 text-sm">Avg Earnings/Token</p>
              <p className="text-2xl font-bold text-purple-400 mt-1">
                {agent.tokensLaunched > 0 
                  ? formatSOL(agent.totalEarnings / agent.tokensLaunched)
                  : '0'} SOL
              </p>
            </div>
          </div>

          {/* Wallet */}
          <div className="mt-6 p-4 bg-slate-900/50 rounded">
            <p className="text-slate-400 text-sm">Fee Receiver Wallet</p>
            <p className="font-mono text-sm mt-2 break-all">{agent.wallet}</p>
          </div>
        </div>

        {/* Tokens Launched */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Tokens Launched ({agent.tokens.length})</h2>
          {agent.tokens.length > 0 ? (
            <div className="grid gap-4">
              {agent.tokens.map((token) => (
                <div key={token.id} className="bg-slate-800 p-4 rounded border border-slate-700 hover:border-blue-500 transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{token.name}</h3>
                      <p className="text-slate-400 text-sm">Symbol: {token.symbol}</p>
                      <p className="text-slate-500 text-xs font-mono mt-1">
                        Mint: {token.mint.slice(0, 10)}...{token.mint.slice(-6)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-400">Launched</p>
                      <p className="text-sm">{formatDate(token.launchedAt)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-slate-400 text-xs">Supply</p>
                      <p className="text-sm font-bold">
                        {(token.supply / 1e9).toFixed(2)}B
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">Price</p>
                      <p className="text-sm font-bold">
                        ${token.price.toFixed(6)}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">Volume</p>
                      <p className="text-sm font-bold">
                        {formatSOL(token.volume)} SOL
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">Holders</p>
                      <p className="text-sm font-bold">
                        {token.holders}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-800 p-8 rounded border border-slate-700 text-center text-slate-400">
              <p>No tokens launched yet</p>
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Transactions ({agent.recentTransactions.length})</h2>
          {agent.recentTransactions.length > 0 ? (
            <div className="bg-slate-800 rounded border border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700 bg-slate-700/50">
                      <th className="text-left p-4">Type</th>
                      <th className="text-left p-4">Amount</th>
                      <th className="text-left p-4">From Wallet</th>
                      <th className="text-left p-4">To Wallet</th>
                      <th className="text-left p-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agent.recentTransactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-slate-700 hover:bg-slate-700/30 transition">
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            tx.type === 'LAUNCH' 
                              ? 'bg-blue-900 text-blue-300'
                              : tx.type === 'FEE_EARNED'
                              ? 'bg-green-900 text-green-300'
                              : 'bg-slate-700 text-slate-300'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="p-4 font-bold">{formatSOL(tx.amount)} SOL</td>
                        <td className="p-4 text-xs font-mono text-slate-400">
                          {tx.fromWallet.slice(0, 6)}...
                        </td>
                        <td className="p-4 text-xs font-mono text-slate-400">
                          {tx.toWallet.slice(0, 6)}...
                        </td>
                        <td className="p-4 text-slate-400">
                          {formatDate(tx.timestamp)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-slate-800 p-8 rounded border border-slate-700 text-center text-slate-400">
              <p>No transactions yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
