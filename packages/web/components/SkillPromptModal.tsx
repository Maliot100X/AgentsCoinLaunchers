"use client";

import { useState } from "react";
import type { TradingSkill } from "./SkillCard";

interface SkillPromptModalProps {
  skill: TradingSkill | null;
  onClose: () => void;
}

export default function SkillPromptModal({ skill, onClose }: SkillPromptModalProps) {
  const [copied, setCopied] = useState(false);

  if (!skill) return null;

  const copyPrompt = () => {
    navigator.clipboard.writeText(skill.agentPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-slate-700 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-3xl">{skill.icon}</span>
            <div>
              <h2 className="text-2xl font-bold">{skill.name}</h2>
              <p className="text-sm text-slate-400 mt-1">Agent Prompt Configuration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-2xl hover:text-purple-400 transition-colors w-10 h-10 flex items-center justify-center hover:bg-slate-700/50 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-lg font-bold mb-2">📝 Description</h3>
            <p className="text-slate-300 leading-relaxed">{skill.fullDescription}</p>
          </div>

          {/* Metrics */}
          <div>
            <h3 className="text-lg font-bold mb-4">📊 Performance Metrics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div className="text-sm text-slate-400 mb-2">Success Rate</div>
                <div className={`text-2xl font-bold ${skill.metrics.successRate >= 70 ? "text-green-400" : "text-yellow-400"}`}>
                  {skill.metrics.successRate}%
                </div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div className="text-sm text-slate-400 mb-2">Avg Return</div>
                <div className="text-2xl font-bold text-cyan-400">{skill.metrics.averageReturn}%</div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div className="text-sm text-slate-400 mb-2">Active Trades</div>
                <div className="text-2xl font-bold text-pink-400">{skill.metrics.activeTrades}</div>
              </div>
            </div>
          </div>

          {/* Agent Prompt */}
          <div>
            <h3 className="text-lg font-bold mb-3">🤖 Agent Prompt</h3>
            <p className="text-sm text-slate-400 mb-3">
              Copy this prompt and paste it into your AI agent configuration. It provides all necessary instructions for optimal performance.
            </p>
            <div className="bg-slate-900/60 border border-slate-700 rounded-lg p-6 font-mono text-sm">
              <div className="text-slate-300 whitespace-pre-wrap break-words max-h-[300px] overflow-y-auto leading-relaxed">
                {skill.agentPrompt}
              </div>
            </div>
          </div>

          {/* Usage Examples */}
          <div>
            <h3 className="text-lg font-bold mb-3">💡 Usage Examples</h3>
            <div className="space-y-2 text-sm text-slate-300">
              <div className="bg-slate-900/40 p-3 rounded border border-slate-700/50">
                <span className="text-purple-400 font-bold">Claude:</span> "Use the {skill.name} skill to identify the next high-potential trade"
              </div>
              <div className="bg-slate-900/40 p-3 rounded border border-slate-700/50">
                <span className="text-purple-400 font-bold">Claw Bot:</span> "Set action: {skill.id.toLowerCase()}, execute with live market data"
              </div>
              <div className="bg-slate-900/40 p-3 rounded border border-slate-700/50">
                <span className="text-purple-400 font-bold">Custom Agent:</span> "POST /api/skills/{skill.id}/execute with your parameters"
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700 bg-slate-900/50 px-8 py-4 flex gap-3">
          <button
            onClick={copyPrompt}
            className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
              copied
                ? "bg-green-600 text-white"
                : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-600/30"
            }`}
          >
            📋
            {copied ? "Copied to Clipboard!" : "Copy Full Prompt"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
