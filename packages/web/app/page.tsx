"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import TokenLaunch from "../components/TokenLaunch";
import SwapInterface from "../components/SwapInterface";
import SkillsMarketplace from "../components/SkillsMarketplace";
import Dashboard from "../components/Dashboard";

export default function Home() {
  const { connected } = useWallet();
  const [activeTab, setActiveTab] = useState("launch");

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">AgentsCoinLaunchers</h1>
          <WalletMultiButton />
        </div>
      </nav>

      {connected ? (
        <main className="container mx-auto p-4">
          <div className="flex border-b border-gray-700 mb-6">
            {["launch", "swap", "skills", "dashboard"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 ${
                  activeTab === tab
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === "launch" && <TokenLaunch />}
          {activeTab === "swap" && <SwapInterface />}
          {activeTab === "skills" && <SkillsMarketplace />}
          {activeTab === "dashboard" && <Dashboard />}
        </main>
      ) : (
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <h2 className="text-3xl mb-4">Connect your wallet to continue</h2>
            <p className="text-gray-400 mb-6">
              Use Phantom or Solflare to access the platform
            </p>
            <WalletMultiButton />
          </div>
        </div>
      )}
    </div>
  );
}
