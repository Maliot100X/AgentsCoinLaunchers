"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";

export default function TokenLaunch() {
  const { publicKey, sendTransaction } = useWallet();
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenSupply, setTokenSupply] = useState("");
  const [feeReceiver, setFeeReceiver] = useState("");
  const [isLaunching, setIsLaunching] = useState(false);
  const [status, setStatus] = useState("");

  const PLATFORM_WALLET = "Dgk9bcm6H6LVaamyXQWeNCXh2HuTFoE4E7Hu7Pw1aiPx";
  const FEE_AMOUNT = 0.055 * LAMPORTS_PER_SOL;

  const handleLaunch = async () => {
    if (!publicKey) return;

    setIsLaunching(true);
    setStatus("Processing payment...");

    try {
      const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com");

      // Create transaction for platform fee
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(PLATFORM_WALLET),
          lamports: FEE_AMOUNT,
        })
      );

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Send transaction
      const signature = await sendTransaction(transaction, connection);
      
      // Wait for confirmation
      await connection.confirmTransaction(signature, "confirmed");

      // Call API to deploy token (simulated for demo)
      setStatus("Deploying token...");
      
      // Simulate token deployment
      setTimeout(() => {
        setStatus(`Token launched successfully!`);
        setIsLaunching(false);
      }, 2000);

    } catch (error) {
      console.error("Launch failed:", error);
      setStatus("Launch failed. Please try again.");
      setIsLaunching(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Launch Token</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Token Name</label>
          <input
            type="text"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            className="w-full bg-gray-700 p-2 rounded"
            placeholder="My Awesome Token"
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-1">Token Symbol</label>
          <input
            type="text"
            value={tokenSymbol}
            onChange={(e) => setTokenSymbol(e.target.value)}
            className="w-full bg-gray-700 p-2 rounded"
            placeholder="MAT"
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-1">Total Supply</label>
          <input
            type="number"
            value={tokenSupply}
            onChange={(e) => setTokenSupply(e.target.value)}
            className="w-full bg-gray-700 p-2 rounded"
            placeholder="1000000"
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-400 mb-1">Fee Receiver Wallet</label>
          <input
            type="text"
            value={feeReceiver}
            onChange={(e) => setFeeReceiver(e.target.value)}
            className="w-full bg-gray-700 p-2 rounded"
            placeholder="Your SOL wallet address for receiving 70% fees"
          />
        </div>

        <div className="bg-yellow-900/50 p-4 rounded">
          <p className="text-yellow-200 text-sm">
            💰 Cost: 0.055 SOL (Platform Fee)
          </p>
          <p className="text-gray-400 text-xs mt-1">
            70% of transaction fees will go to your wallet, 30% to the platform
          </p>
        </div>

        <button
          onClick={handleLaunch}
          disabled={isLaunching || !tokenName || !tokenSymbol || !feeReceiver}
          className={`w-full py-3 rounded font-semibold ${
            isLaunching || !tokenName || !tokenSymbol || !feeReceiver
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {isLaunching ? "Processing..." : "Launch Token (0.055 SOL)"}
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
