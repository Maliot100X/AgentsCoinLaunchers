"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Dashboard() {
  const { publicKey } = useWallet();
  const [activeView, setActiveView] = useState("overview");

  // Mock data
  const stats = {
    tokensLaunched: 3,
    totalVolume: "12,450 SOL",
    feesEarned: "45.2 SOL",
    currentBalance: "150.5 SOL",
  };

  const transactions = [
    { id: 1, type: "Launch", token: "MYTOKEN", amount: "0.055 SOL", date: "2024-01-15" },
    { id: 2, type: "Swap", token: "SOL->USDC", amount: "10 SOL", date: "2024-01-14" },
    { id: 3, type: "Fee Claim", token: "SOL", amount: "5.2 SOL", date: "2024-01-13" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6">
        {["overview", "history", "settings"].map((view) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`px-4 py-2 rounded ${
              activeView === view
                ? "bg-purple-600 text-white"
                : "bg-gray-700 text-gray-400"
            }`}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>

      {activeView === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Tokens Launched</p>
            <p className="text-2xl font-bold">{stats.tokensLaunched}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Total Volume</p>
            <p className="text-2xl font-bold">{stats.totalVolume}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Fees Earned</p>
            <p className="text-2xl font-bold text-green-400">{stats.feesEarned}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Wallet Balance</p>
            <p className="text-2xl font-bold">{stats.currentBalance}</p>
          </div>
        </div>
      )}

      {activeView === "history" && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="font-semibold mb-4">Transaction History</h3>
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex justify-between items-center p-3 bg-gray-700 rounded">
                <div>
                  <span className="text-purple-400">{tx.type}</span>
                  <span className="text-gray-400 ml-2">{tx.token}</span>
                </div>
                <div className="text-right">
                  <p>{tx.amount}</p>
                  <p className="text-gray-500 text-xs">{tx.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeView === "settings" && (
        <div className="bg-gray-800 p-6 rounded-lg space-y-4">
          <h3 className="font-semibold">Settings</h3>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Wallet Address</label>
            <input
              type="text"
              value={publicKey?.toString() || ""}
              readOnly
              className="w-full bg-gray-700 p-2 rounded text-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Fee Receiver Wallet</label>
            <input
              type="text"
              placeholder="Enter your SOL wallet for receiving fees"
              className="w-full bg-gray-700 p-2 rounded"
            />
          </div>
          <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded">
            Save Settings
          </button>
        </div>
      )}
    </div>
  );
}
