"use client";

import { useState } from "react";

const skills = [
  {
    id: 1,
    name: "Token Launcher",
    description: "Launch new Solana tokens with configurable fees",
    category: "launch",
    author: "Platform",
    price: "Free",
  },
  {
    id: 2,
    name: "Token Swapper",
    description: "Swap tokens using Jupiter API",
    category: "swap",
    author: "Platform",
    price: "Free",
  },
  {
    id: 3,
    name: "Fee Claimer",
    description: "Claim accumulated transaction fees",
    category: "claim",
    author: "Platform",
    price: "Free",
  },
  {
    id: 4,
    name: "Price Analyzer",
    description: "Analyze token prices and trends",
    category: "analytics",
    author: "Community",
    price: "Free",
  },
  {
    id: 5,
    name: "Wallet Watcher",
    description: "Monitor wallet activities",
    category: "analytics",
    author: "Community",
    price: "Free",
  },
];

export default function SkillsMarketplace() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [copiedSkill, setCopiedSkill] = useState<number | null>(null);

  const categories = ["all", "launch", "swap", "claim", "analytics"];

  const filteredSkills = selectedCategory === "all" 
    ? skills 
    : skills.filter(skill => skill.category === selectedCategory);

  const copyToClipboard = (skill: { id: number; name: string; description: string; category: string; author: string; price: string }) => {
    const mcpConfig = `{
  "mcpServers": {
    "agentscoinlaunchers": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-${skill.name.toLowerCase().replace(" ", "-")}"],
      "env": {
        "BAGS_API_KEY": "bags_prod_YhTVMoennloNU06kSEDqQ8g_Bdd7_5g7RdcMT1EBr4o"
      }
    }
  }
}`;
    
    navigator.clipboard.writeText(mcpConfig);
    setCopiedSkill(skill.id);
    setTimeout(() => setCopiedSkill(null), 2000);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Skills Marketplace</h2>
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded text-sm ${
                selectedCategory === cat
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-400 hover:text-white"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => (
          <div key={skill.id} className="bg-gray-700 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{skill.name}</h3>
              <span className="text-xs bg-gray-600 px-2 py-1 rounded">
                {skill.category}
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-3">{skill.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">by {skill.author}</span>
              <button
                onClick={() => copyToClipboard(skill)}
                className={`px-3 py-1 rounded text-xs ${
                  copiedSkill === skill.id
                    ? "bg-green-600"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                {copiedSkill === skill.id ? "Copied!" : "Copy for Claude"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-700 rounded-lg">
        <h3 className="font-semibold mb-2">How to use with Claude</h3>
        <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
          <li>Click "Copy for Claude" on any skill</li>
          <li>Paste into Claude's MCP configuration</li>
          <li>Use the skill in your conversations</li>
        </ol>
      </div>
    </div>
  );
}
