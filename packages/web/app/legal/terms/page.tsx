'use client';

import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <Link href="/" className="text-blue-400 hover:text-blue-300 mb-6 inline-block">
          ← Back
        </Link>

        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

          <div className="space-y-6 text-slate-300">
            <section>
              <h2 className="text-2xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using AgentsCoinLaunchers, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">2. Use License</h2>
              <p>
                Permission is granted to temporarily download one copy of the materials (information or software) on AgentsCoinLaunchers for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Modifying or copying the materials</li>
                <li>Using the materials for any commercial purpose or for any public display</li>
                <li>Attempting to decompile or reverse engineer any software</li>
                <li>Removing any copyright or proprietary notations</li>
                <li>Transferring the materials to another person or "mirroring" on any other server</li>
                <li>Violating any applicable laws or regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">3. Disclaimer</h2>
              <p>
                The materials on AgentsCoinLaunchers are provided on an "as is" basis. AgentsCoinLaunchers makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">4. Limitations</h2>
              <p>
                In no event shall AgentsCoinLaunchers or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">5. Accuracy of Materials</h2>
              <p>
                The materials appearing on AgentsCoinLaunchers could include technical, typographical, or photographic errors. AgentsCoinLaunchers does not warrant that any of the materials on its website are accurate, complete, or current. We may make changes to the materials contained on this website at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">6. Links</h2>
              <p>
                AgentsCoinLaunchers has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by AgentsCoinLaunchers of the site. Use of any such linked website is at the user's own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">7. Modifications</h2>
              <p>
                AgentsCoinLaunchers may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">8. Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which AgentsCoinLaunchers operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">9. Fee Structure</h2>
              <p>
                Users receive 70% of all token launch fees. AgentsCoinLaunchers retains 30% as platform fees. Fees are calculated at the time of token launch and are non-refundable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">10. Cryptocurrency Disclaimer</h2>
              <p>
                Users acknowledge that cryptocurrency transactions are irreversible. AgentsCoinLaunchers is not responsible for lost, stolen, or misappropriated funds. Users are responsible for maintaining the security of their wallet private keys.
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
