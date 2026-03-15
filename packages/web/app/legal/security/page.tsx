'use client';

import Link from 'next/link';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <Link href="/" className="text-blue-400 hover:text-blue-300 mb-6 inline-block">
          ← Back
        </Link>

        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-8">Security</h1>

          <div className="space-y-6 text-slate-300">
            <section>
              <h2 className="text-2xl font-bold text-white mb-3">🔒 Security at AgentsCoinLaunchers</h2>
              <p>
                We take security seriously and implement multiple layers of protection to keep your data and assets safe.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Infrastructure Security</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-bold text-white">✓ Encrypted Communication</h3>
                  <p>All data transmissions use TLS 1.3 encryption to protect against eavesdropping.</p>
                </div>
                <div>
                  <h3 className="font-bold text-white">✓ Secure Servers</h3>
                  <p>Our infrastructure is hosted on secure, regularly audited servers with DDoS protection.</p>
                </div>
                <div>
                  <h3 className="font-bold text-white">✓ Database Security</h3>
                  <p>Sensitive data is encrypted at rest and monitored for unauthorized access.</p>
                </div>
                <div>
                  <h3 className="font-bold text-white">✓ Regular Backups</h3>
                  <p>We maintain redundant backups in geographically distributed locations.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Wallet Security</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-bold text-white">Non-Custodial Wallets</h3>
                  <p>
                    We use Phantom wallet integration. You maintain full control of your private keys. We never store or have access to your private keys.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-white">Transaction Verification</h3>
                  <p>
                    All transactions are verified on the Solana blockchain before being processed. We use Solscan for independent verification.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-white">Protected Addresses</h3>
                  <p>
                    Your Solana addresses are validated and verified before being stored in our system.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Smart Contract Safety</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-bold text-white">Contract Verification</h3>
                  <p>All token contracts are deployed using verified, audited mechanisms.</p>
                </div>
                <div>
                  <h3 className="font-bold text-white">Bag.fm Integration</h3>
                  <p>We track tokens through Bag.fm, a trusted third-party verification service.</p>
                </div>
                <div>
                  <h3 className="font-bold text-white">Transparent Transactions</h3>
                  <p>All transactions are recorded on the Solana blockchain and publicly verifiable.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Best Practices for Users</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Never share your Phantom wallet seed phrase</li>
                <li>Use a strong, unique password for your accounts</li>
                <li>Enable two-factor authentication where available</li>
                <li>Verify wallet addresses before confirming transactions</li>
                <li>Keep your browser and wallet extension updated</li>
                <li>Avoid public WiFi when accessing sensitive information</li>
                <li>Report suspicious activity immediately</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Reporting Security Issues</h2>
              <p>
                If you discover a security vulnerability, please report it confidentially to our team via:
              </p>
              <div className="bg-slate-800 p-4 rounded mt-2">
                <p className="font-mono text-sm">
                  Telegram: <a href="https://t.me/TheSistersAgentLauncherSignals" target="_blank" className="text-blue-400 hover:text-blue-300">
                    @TheSistersAgentLauncherSignals
                  </a>
                </p>
              </div>
              <p className="mt-2">
                We take all security reports seriously and will investigate and respond promptly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Compliance & Audits</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Regular security audits and penetration testing</li>
                <li>Compliance with industry security standards</li>
                <li>Transparent fee structure and transaction logging</li>
                <li>Public leaderboard for accountability</li>
              </ul>
            </section>

            <section className="bg-blue-900/30 border border-blue-700 p-4 rounded">
              <h3 className="font-bold text-white mb-2">⚠️ Important Disclaimer</h3>
              <p className="text-sm">
                While we implement comprehensive security measures, cryptocurrency transactions on public blockchains carry inherent risks. Users are responsible for the security of their own assets and should never store significant funds in hot wallets.
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
