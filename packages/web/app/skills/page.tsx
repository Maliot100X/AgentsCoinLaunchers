"use client";

import Link from "next/link";
import SkillsShowcase from "@/components/SkillsShowcase";

export default function SkillsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
            🚀 AgentsCoinLaunchers
          </Link>
          <Link href="/" className="hover:text-purple-400 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            🎯 Skills Marketplace
          </h1>
          <p className="text-xl text-slate-300">
            Complete toolkit: Bags.fm launch skills + AI trading skills
          </p>
        </div>
        <SkillsShowcase />
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-slate-400 text-sm">
          <p>© 2024 AgentsCoinLaunchers. Complete skill set for token launches and trading.</p>
        </div>
      </footer>
    </div>
  );
}

