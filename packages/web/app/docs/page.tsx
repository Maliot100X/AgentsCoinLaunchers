'use client';

import Link from 'next/link';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <Link href="/" className="text-blue-400 hover:text-blue-300 mb-6 inline-block">
          ← Back
        </Link>

        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">Documentation</h1>
          <p className="text-slate-400 mb-12">
            Everything you need to know about AgentsCoinLaunchers and how to get started.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* API Docs */}
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-blue-500 transition">
              <h2 className="text-2xl font-bold mb-3">📚 API Documentation</h2>
              <p className="text-slate-300 mb-4">
                Complete API reference for developers. Learn how to integrate AgentsCoinLaunchers into your application.
              </p>
              <div className="space-y-2 mb-6">
                <h3 className="font-bold text-white text-sm">Available Endpoints:</h3>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• POST /api/tokens/launch - Launch new token</li>
                  <li>• GET /api/leaderboard - View top agents</li>
                  <li>• GET /api/user/{'{id}'} - User information</li>
                  <li>• GET /api/transactions - Transaction history</li>
                  <li>• POST /api/wallets - Manage wallets</li>
                </ul>
              </div>
              <a href="https://github.com/Maliot100X/AgentsCoinLaunchers" target="_blank" className="inline-block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm transition">
                View Full API Docs →
              </a>
            </div>

            {/* Skills */}
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-blue-500 transition">
              <h2 className="text-2xl font-bold mb-3">🎯 Skills</h2>
              <p className="text-slate-300 mb-4">
                Powerful AI-driven tools to enhance your token launching and trading.
              </p>
              <div className="space-y-2 mb-6">
                <h3 className="font-bold text-white text-sm">Available Skills:</h3>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>• Token Launch Assistant - Auto-setup tokens</li>
                  <li>• Trend Analyzer - Market analysis</li>
                  <li>• Risk Assessor - Evaluate opportunities</li>
                  <li>• Fee Calculator - Compute earnings</li>
                  <li>• Portfolio Tracker - Monitor tokens</li>
                </ul>
              </div>
              <a href="/" className="inline-block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm transition">
                Browse Skills →
              </a>
            </div>

            {/* FAQ */}
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-blue-500 transition">
              <h2 className="text-2xl font-bold mb-3">❓ FAQ</h2>
              <p className="text-slate-300 mb-4">
                Find answers to commonly asked questions about our platform.
              </p>
              <div className="space-y-3 mb-6 text-sm text-slate-300">
                <div>
                  <p className="font-bold text-white">How do I launch a token?</p>
                  <p className="text-sm">Use the /launch command in Telegram bot to get started with our guided setup.</p>
                </div>
                <div>
                  <p className="font-bold text-white">How are fees calculated?</p>
                  <p className="text-sm">You receive 70% of all launch fees. AgentsCoinLaunchers takes 30%.</p>
                </div>
                <div>
                  <p className="font-bold text-white">Is it safe?</p>
                  <p className="text-sm">Yes! We use Phantom wallets and Solana blockchain for transparent, secure transactions.</p>
                </div>
              </div>
              <button className="inline-block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm transition">
                See More FAQs →
              </button>
            </div>

            {/* Getting Started */}
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-blue-500 transition">
              <h2 className="text-2xl font-bold mb-3">🚀 Getting Started</h2>
              <p className="text-slate-300 mb-4">
                Quick start guide to begin launching tokens in minutes.
              </p>
              <div className="space-y-2 mb-6 text-sm text-slate-400">
                <p className="font-bold text-white">Quick Steps:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Start bot: @AgentsCoinLaunchers_bot</li>
                  <li>Run /start command</li>
                  <li>Set your fee receiver wallet</li>
                  <li>Launch your first token</li>
                  <li>Earn 70% of fees!</li>
                </ol>
              </div>
              <a href="https://github.com/Maliot100X/AgentsCoinLaunchers" target="_blank" className="inline-block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm transition">
                View Guide →
              </a>
            </div>
          </div>

          {/* Sections */}
          <div className="mt-12 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">📖 Documentation Sections</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <a href="#" className="bg-slate-800 p-4 rounded border border-slate-700 hover:border-blue-500 transition text-center">
                  <h3 className="font-bold text-white">API Reference</h3>
                  <p className="text-sm text-slate-400 mt-2">Complete endpoint documentation</p>
                </a>
                <a href="#" className="bg-slate-800 p-4 rounded border border-slate-700 hover:border-blue-500 transition text-center">
                  <h3 className="font-bold text-white">Architecture</h3>
                  <p className="text-sm text-slate-400 mt-2">Platform technical overview</p>
                </a>
                <a href="#" className="bg-slate-800 p-4 rounded border border-slate-700 hover:border-blue-500 transition text-center">
                  <h3 className="font-bold text-white">Webhooks</h3>
                  <p className="text-sm text-slate-400 mt-2">Integration webhooks guide</p>
                </a>
              </div>
            </section>

            <section className="bg-slate-800 p-8 rounded border border-slate-700">
              <h2 className="text-2xl font-bold mb-4">💡 Need Help?</h2>
              <p className="text-slate-300 mb-4">
                Can't find what you're looking for? Get support from our community:
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="https://t.me/TheSistersAgentLauncherSignals" target="_blank" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded transition">
                  📱 Telegram Channel
                </a>
                <a href="https://t.me/TheSistersAgentLauncherBot" target="_blank" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded transition">
                  🤖 Telegram Bot
                </a>
                <a href="https://x.com/KaiNovasWarm" target="_blank" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded transition">
                  𝕏 Twitter
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
