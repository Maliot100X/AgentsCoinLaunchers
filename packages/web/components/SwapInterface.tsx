"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";

export default function SwapInterface() {
  const { publicKey, sendTransaction } = useWallet();
  const [fromToken, setFromToken] = useState("SOL");
  const [toToken, setToToken] = useState("");
  const [amount, setAmount] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);
  const [status, setStatus] = useState("");

  const handleSwap = async () => {
    if (!publicKey) return;

    setIsSwapping(true);
    setStatus("Processing swap...");

    try {
      const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com");

      // For demo, we'll just simulate a swap
      // In production, this would use Jupiter API or similar
      
      // Simulate swap delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStatus(`Swapped ${amount} ${fromToken} to ${toToken}`);
      setIsSwapping(false);
    } catch (error) {
      console.error("Swap failed:", error);
      setStatus("Swap failed. Please try again.");
      setIsSwapping(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Swap Tokens</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">From</label>
          <div className="flex gap-2">
            <select
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
              className="flex-1 bg-gray-700 p-2 rounded"
            >
              <option value="SOL">SOL</option>
              <option value="USDC">USDC</option>
              <option value="USDT">USDT</option>
            </select>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-2 bg-gray-700 p-2 rounded"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button className="bg-gray-700 p-2 rounded-full hover:bg-gray-600">
            ↓
          </button>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">To</label>
          <select
            value={toToken}
            onChange={(e) => setToToken(e.target.value)}
            className="w-full bg-gray-700 p-2 rounded"
          >
            <option value="">Select token</option>
            <option value="USDC">USDC</option>
            <option value="USDT">USDT</option>
            <option value="SOL">SOL</option>
          </select>
        </div>

        <div className="bg-gray-700 p-3 rounded">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Rate</span>
            <span>1 SOL = 150 USDC</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-400">Fee</span>
            <span>0.5%</span>
          </div>
        </div>

        <button
          onClick={handleSwap}
          disabled={isSwapping || !amount || !toToken}
          className={`w-full py-3 rounded font-semibold ${
            isSwapping || !amount || !toToken
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isSwapping ? "Swapping..." : `Swap ${fromToken} to ${toToken || "?"}`}
        </button>

        {status && (
          <div className="text-center text-sm text-gray-400">
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
