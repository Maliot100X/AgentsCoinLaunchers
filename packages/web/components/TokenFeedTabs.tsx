'use client';

// Token Feed Tabs Component - Real-time token data by status
import { useEffect, useState } from 'react';
import { RefreshCw, TrendingUp } from 'lucide-react';

interface Token {
  name: string;
  symbol: string;
  description?: string;
  image?: string;
  tokenMint: string;
  status?: string;
  twitter?: string;
  website?: string;
  launchSignature: string;
  createdAt?: string;
  volume24h?: number;
  holders?: number;
  priceChange?: number;
}

export default function TokenFeedTabs() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'new' | 'pregrads' | 'graduated'>('new');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchTokens = async () => {
    try {
      setLoading(true);
      console.log('[TokenFeedTabs] Starting fetch from /api/bags/launch-feed');
      
      const response = await fetch('/api/bags/launch-feed');
      console.log('[TokenFeedTabs] Response status:', response.status);
      
      if (!response.ok) {
        throw new Error('Failed to load tokens');
      }

      const data = await response.json();
      console.log('[TokenFeedTabs] Data received:', data);
      console.log('[TokenFeedTabs] Response array length:', data.response?.length);
      
      const allTokens = data.response || [];
      console.log('[TokenFeedTabs] Setting tokens, count:', allTokens.length);
      
      setTokens(allTokens);
      setLastRefresh(new Date());
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('[TokenFeedTabs] Error:', errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('[TokenFeedTabs] Component mounted, calling fetchTokens');
    fetchTokens();
    
    // Refresh every 5 minutes
    const interval = setInterval(() => {
      console.log('[TokenFeedTabs] 5-minute auto-refresh triggered');
      fetchTokens();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Filter tokens by category
  const newTokens = tokens.filter(t => !t.status || t.status === 'PRE_GRAD').slice(0, 15);
  const preGradTokens = tokens.filter(t => t.status === 'PRE_GRAD').slice(0, 15);
  const graduatedTokens = tokens.filter(t => t.status === 'MIGRATED').slice(0, 15);
  
  console.log('[TokenFeedTabs] Filters: new=', newTokens.length, 'pregrad=', preGradTokens.length, 'graduated=', graduatedTokens.length);

  const activeTokens = 
    activeTab === 'new' ? newTokens :
    activeTab === 'pregrads' ? preGradTokens :
    graduatedTokens;

  const renderTokenCard = (token: Token) => {
    try {
      return (
        <div
          key={token.launchSignature}
          className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-purple-500/50 transition-all"
        >
          {/* Token Image */}
          {token.image && (
            <div className="w-full h-24 bg-slate-700 rounded mb-3 flex items-center justify-center overflow-hidden">
              <img
                src={token.image}
                alt={token.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  try {
                    (e.target as HTMLImageElement).style.display = 'none';
                  } catch (err) {
                    console.error('Image error:', err);
                  }
                }}
              />
            </div>
          )}

          {/* Token Info */}
          <h3 className="font-bold text-sm mb-1 truncate">{token.name}</h3>
          <p className="text-slate-400 text-xs mb-2">{token.symbol}</p>
          
          {token.description && (
            <p className="text-slate-400 text-xs mb-3 line-clamp-2">
              {token.description}
            </p>
          )}

          {/* Token Mint */}
          <div className="bg-slate-900/50 p-2 rounded mb-3">
            <p className="text-xs text-slate-500">Mint</p>
            <p className="text-xs font-mono text-blue-400 break-all">{token.tokenMint.slice(0, 20)}...</p>
          </div>

          {/* Status Badge */}
          {token.status && (
            <div className="mb-3">
              <span className={`text-xs px-2 py-1 rounded ${
                token.status === 'MIGRATED'
                  ? 'bg-green-900/50 text-green-400'
                  : token.status === 'PRE_GRAD'
                  ? 'bg-yellow-900/50 text-yellow-400'
                  : 'bg-blue-900/50 text-blue-400'
              }`}>
                {token.status}
              </span>
            </div>
          )}

          {/* Links */}
          <div className="flex gap-2 pt-2 border-t border-slate-700">
            {token.twitter && (
              <a
                href={token.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-2 py-1 bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 text-xs rounded transition text-center truncate"
              >
                X
              </a>
            )}
            {token.website && (
              <a
                href={token.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-2 py-1 bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 text-xs rounded transition text-center truncate"
              >
                Web
              </a>
            )}
          </div>
        </div>
      );
    } catch (err) {
      console.error('Error rendering token card:', err);
      return null;
    }
  };

  return (
    <div className="w-full">
      {(() => {
        console.log('[TokenFeedTabs] RENDERING COMPONENT, activeTokens length:', activeTokens.length);
        return null;
      })()}
      {/* Mini Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b border-slate-700 pb-4">
        <button
          onClick={() => setActiveTab('new')}
          className={`px-4 py-2 font-medium transition-all rounded-lg whitespace-nowrap ${
            activeTab === 'new'
              ? 'bg-purple-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          🆕 New Launches ({newTokens.length})
        </button>
        <button
          onClick={() => setActiveTab('pregrads')}
          className={`px-4 py-2 font-medium transition-all rounded-lg whitespace-nowrap ${
            activeTab === 'pregrads'
              ? 'bg-yellow-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          📈 About to Graduate ({preGradTokens.length})
        </button>
        <button
          onClick={() => setActiveTab('graduated')}
          className={`px-4 py-2 font-medium transition-all rounded-lg whitespace-nowrap ${
            activeTab === 'graduated'
              ? 'bg-green-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          ✅ Graduated & Trending ({graduatedTokens.length})
        </button>
        
        {/* Refresh Button */}
        <button
          onClick={fetchTokens}
          disabled={loading}
          className="ml-auto px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-medium transition-all rounded-lg flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Last Refresh Time */}
      <div className="mb-4 text-xs text-slate-500">
        Last updated: {lastRefresh.toLocaleTimeString()} • Auto-refresh every 5 minutes
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/30 border border-red-700 p-4 rounded mb-6">
          <p className="text-red-200">Error: {error}</p>
        </div>
      )}

      {/* Token Grid */}
      {loading && activeTokens.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            <p className="mt-4 text-slate-400">Loading tokens...</p>
          </div>
        </div>
      ) : activeTokens.length === 0 ? (
        <div className="bg-slate-800 p-8 rounded border border-slate-700 text-center text-slate-400">
          <p>No tokens in this category yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeTokens.map(renderTokenCard)}
        </div>
      )}

      {/* Token Count */}
      {activeTokens.length > 0 && (
        <div className="mt-6 text-center text-sm text-slate-400">
          Showing {activeTokens.length} of {
            activeTab === 'new' ? newTokens.length :
            activeTab === 'pregrads' ? preGradTokens.length :
            graduatedTokens.length
          } tokens
        </div>
      )}
    </div>
  );
}
