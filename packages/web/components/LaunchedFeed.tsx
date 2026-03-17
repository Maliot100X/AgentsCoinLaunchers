'use client';

import { useEffect, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import TokenFeedTabs from './TokenFeedTabs';

interface LaunchFeedToken {
  name: string;
  symbol: string;
  description?: string;
  image?: string;
  tokenMint: string;
  status?: string;
  twitter?: string;
  website?: string;
  launchSignature: string;
  accountKeys?: string[];
  numRequiredSigners?: number;
  uri?: string;
  dbcPoolKey?: string;
  dbcConfigKey?: string;
}

export default function LaunchedFeed() {
  const [tokens, setTokens] = useState<LaunchFeedToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showDetailedView, setShowDetailedView] = useState(false);

  useEffect(() => {
    const fetchLaunchFeed = async () => {
      try {
        setLoading(true);
        // Call our API proxy route (server-side, no CORS issues)
        const response = await fetch('/api/bags/launch-feed');

        if (!response.ok) {
          throw new Error('Failed to load launch feed');
        }

        const data = await response.json();
        // Filter to only launched tokens
        const launchedTokens = data.response || data.data || data.tokens || data || [];
        setTokens(Array.isArray(launchedTokens) ? launchedTokens : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching launch feed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLaunchFeed();
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const shortenSignature = (signature: string) => {
    return `${signature.slice(0, 10)}...${signature.slice(-10)}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-slate-400">Loading launched tokens...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-700 p-6 rounded mb-6">
        <p className="text-red-200">Error: {error}</p>
      </div>
    );
  }

  if (!tokens || tokens.length === 0) {
    return (
      <div className="bg-slate-800 p-8 rounded border border-slate-700 text-center text-slate-400">
        <p>No launched tokens available</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Top Section: All Launched Tokens */}
      <div>
        <h2 className="text-2xl font-bold mb-6">🎉 Recently Launched</h2>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-slate-400">Loading launched tokens...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-900/30 border border-red-700 p-6 rounded mb-6">
            <p className="text-red-200">Error: {error}</p>
          </div>
        ) : !tokens || tokens.length === 0 ? (
          <div className="bg-slate-800 p-8 rounded border border-slate-700 text-center text-slate-400">
            <p>No launched tokens available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tokens.map((token) => (
              <div
                key={token.launchSignature}
                className="bg-slate-800 rounded border border-slate-700 hover:border-blue-500 transition overflow-hidden flex flex-col"
              >
                {/* Token Image */}
                {token.image && (
                  <div className="w-full h-32 bg-slate-700 flex items-center justify-center overflow-hidden">
                    <img
                      src={token.image}
                      alt={token.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23374151" width="100" height="100"/%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                )}

                {/* Token Info */}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="mb-3">
                    <h3 className="font-bold text-lg">{token.name}</h3>
                    <p className="text-slate-400 text-sm">{token.symbol}</p>
                    {token.status && (
                      <p className="text-xs mt-1">
                        <span
                          className={`px-2 py-1 rounded ${
                            token.status === 'LAUNCHED'
                              ? 'bg-green-900 text-green-300'
                              : 'bg-yellow-900 text-yellow-300'
                          }`}
                        >
                          {token.status}
                        </span>
                      </p>
                    )}
                  </div>

                  {token.description && (
                    <p className="text-slate-400 text-xs mb-3 line-clamp-2">
                      {token.description}
                    </p>
                  )}

                  {/* Token Mint */}
                  <div className="mb-3">
                    <p className="text-slate-400 text-xs">Token Mint</p>
                    <p className="text-xs font-mono text-blue-400 break-all">{token.tokenMint}</p>
                  </div>

                  {/* Launch Signature */}
                  <div className="mb-3">
                    <p className="text-slate-400 text-xs">Launch Signature</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs font-mono text-slate-400 flex-1">
                        {shortenSignature(token.launchSignature)}
                      </p>
                      <button
                        onClick={() => copyToClipboard(token.launchSignature, token.launchSignature)}
                        className="p-1 hover:bg-slate-700 rounded transition"
                        title="Copy full signature"
                      >
                        {copiedId === token.launchSignature ? (
                          <Check size={14} className="text-green-400" />
                        ) : (
                          <Copy size={14} className="text-slate-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="flex gap-2 mt-auto pt-3 border-t border-slate-700">
                    {token.twitter && (
                      <a
                        href={token.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-2 py-1 bg-blue-900/50 hover:bg-blue-900 text-blue-300 text-xs rounded transition text-center"
                      >
                        Twitter
                      </a>
                    )}
                    {token.website && (
                      <a
                        href={token.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-2 py-1 bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-xs rounded transition text-center"
                      >
                        Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-slate-700 pt-12">
        <h2 className="text-2xl font-bold mb-6">📊 Token Feed by Status</h2>
        
        {/* Bottom Section: Token Feed Tabs with Real-Time Data */}
        <TokenFeedTabs />
      </div>
    </div>
  );
}
