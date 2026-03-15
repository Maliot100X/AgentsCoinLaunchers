"use client";

import { useState } from "react";

export interface TradingSkill {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: "active" | "inactive" | "beta";
  metrics: {
    successRate: number;
    averageReturn: number;
    activeTrades: number;
  };
  agentPrompt: string;
  fullDescription: string;
}

interface SkillCardProps {
  skill: TradingSkill;
  onPromptClick: (skill: TradingSkill) => void;
}

export default function SkillCard({ skill, onPromptClick }: SkillCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 border-green-500/50 text-green-400";
      case "beta":
        return "bg-blue-500/20 border-blue-500/50 text-blue-400";
      case "inactive":
        return "bg-slate-500/20 border-slate-500/50 text-slate-400";
      default:
        return "bg-slate-500/20 border-slate-500/50 text-slate-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "🟢 Active";
      case "beta":
        return "🔵 Beta";
      case "inactive":
        return "⚪ Inactive";
      default:
        return "Unknown";
    }
  };

  return (
    <div
      className={`relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700 rounded-lg p-6 transition-all duration-300 cursor-pointer transform ${
        isHovered ? "scale-105 border-purple-600/60 shadow-xl shadow-purple-600/20" : "hover:border-purple-600/30"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Section: Icon and Title */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="text-4xl">{skill.icon}</div>
          <div className="flex-1">
            <h3 className={`text-lg font-bold mb-1 transition-colors ${isHovered ? "text-purple-400" : "text-white"}`}>
              {skill.name}
            </h3>
            <p className="text-sm text-slate-400">{skill.description}</p>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className={`inline-block px-3 py-1 border rounded-full text-xs font-bold mb-4 ${getStatusColor(skill.status)}`}>
        {getStatusLabel(skill.status)}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6 py-4 border-y border-slate-700/50">
        <div className="text-center">
          <div className="text-xs text-slate-400 mb-1">Success Rate</div>
          <div className={`text-sm font-bold ${skill.metrics.successRate >= 70 ? "text-green-400" : "text-yellow-400"}`}>
            {skill.metrics.successRate}%
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-slate-400 mb-1">Avg Return</div>
          <div className="text-sm font-bold text-cyan-400">{skill.metrics.averageReturn}%</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-slate-400 mb-1">Active</div>
          <div className="text-sm font-bold text-pink-400">{skill.metrics.activeTrades}</div>
        </div>
      </div>

      {/* Full Description */}
      <p className="text-sm text-slate-300 mb-6 line-clamp-3">{skill.fullDescription}</p>

      {/* Copy Prompt Button */}
      <button
        onClick={() => onPromptClick(skill)}
        className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
          isHovered
            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30"
            : "bg-slate-700/60 text-slate-200 hover:bg-slate-700"
        }`}
      >
        📋 Copy Skill Prompt
      </button>

      {/* Optional: Enable/Disable Toggle */}
      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <span>Enable Skill</span>
        <div className="w-10 h-6 bg-slate-700 rounded-full cursor-pointer relative transition-colors hover:bg-slate-600">
          {skill.status === "active" && (
            <div className="absolute right-1 top-1 w-4 h-4 bg-green-500 rounded-full transition-all"></div>
          )}
        </div>
      </div>
    </div>
  );
}
