'use client';

import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <Link href="/" className="text-blue-400 hover:text-blue-300 mb-6 inline-block">
          ← Back
        </Link>

        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

          <div className="space-y-6 text-slate-300">
            <section>
              <h2 className="text-2xl font-bold text-white mb-3">1. Introduction</h2>
              <p>
                AgentsCoinLaunchers ("we," "us," "our," or "Company") respects the privacy of our users ("User" or "you"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">2. Information We Collect</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-bold text-white">2.1 Personal Information</h3>
                  <p>We collect information you voluntarily provide, including but not limited to:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Telegram username and user ID</li>
                    <li>Solana wallet addresses</li>
                    <li>Email addresses (if provided)</li>
                    <li>Token launch details and descriptions</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-white">2.2 Automatically Collected Information</h3>
                  <p>When you interact with our platform, we automatically collect:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>IP addresses and location data</li>
                    <li>Device information and browser type</li>
                    <li>Transaction history and token launches</li>
                    <li>Usage patterns and analytics</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">3. How We Use Your Information</h2>
              <p>We use collected information for:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Processing and completing token launches</li>
                <li>Calculating and distributing fees</li>
                <li>Improving platform functionality</li>
                <li>Preventing fraud and security issues</li>
                <li>Complying with legal obligations</li>
                <li>Sending updates and notifications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">4. Information Sharing</h2>
              <p>
                We do not sell your personal information to third parties. We may share information with:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Service providers who assist in platform operations</li>
                <li>Solana blockchain networks (wallet addresses are public)</li>
                <li>Law enforcement when legally required</li>
                <li>Other users (publicly visible leaderboard data)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">5. Data Security</h2>
              <p>
                We implement industry-standard security measures including encryption, secure servers, and access controls. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">7. Contact Us</h2>
              <p>
                For privacy concerns or inquiries, contact us via our Telegram channel:
                <br />
                <a href="https://t.me/TheSistersAgentLauncherSignals" target="_blank" className="text-blue-400 hover:text-blue-300">
                  @TheSistersAgentLauncherSignals
                </a>
              </p>
            </section>

            <section className="text-sm text-slate-500 pt-8">
              <p>Last updated: March 15, 2026</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
