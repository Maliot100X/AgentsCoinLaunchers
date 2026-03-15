"use client";

import { useState } from "react";

export interface ImprovedSkill {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rating: number;
  downloads: number;
  status: "active" | "beta";
  metrics: {
    successRate: number;
    adoptionRate: number;
    userCount: number;
  };
  agentPrompt: string;
  documentation: string;
  code: string;
  usage: string;
}

interface ImprovedSkillCardProps {
  skill: ImprovedSkill;
  onPromptClick: (skill: ImprovedSkill) => void;
}

export default function ImprovedSkillCard({ skill, onPromptClick }: ImprovedSkillCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700 rounded-lg p-6 transition-all duration-300 cursor-pointer transform ${
        isHovered ? "scale-105 border-cyan-600/60 shadow-xl shadow-cyan-600/20" : "hover:border-cyan-600/30"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Section: Icon and Title */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="text-4xl">{skill.icon}</div>
          <div className="flex-1">
            <h3 className={`text-lg font-bold mb-1 transition-colors ${isHovered ? "text-cyan-400" : "text-white"}`}>
              {skill.name}
            </h3>
            <p className="text-sm text-slate-400">{skill.description}</p>
          </div>
        </div>
      </div>

      {/* Category & Rating */}
      <div className="flex items-center gap-3 mb-4">
        <span className="px-2 py-1 bg-slate-700/60 text-slate-300 text-xs rounded border border-slate-600">
          {skill.category}
        </span>
        <span className="text-sm font-bold text-yellow-400">⭐ {skill.rating}</span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6 py-4 border-y border-slate-700/50">
        <div className="text-center">
          <div className="text-xs text-slate-400 mb-1">Success Rate</div>
          <div className="text-sm font-bold text-green-400">{skill.metrics.successRate}%</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-slate-400 mb-1">Adoption</div>
          <div className="text-sm font-bold text-blue-400">{skill.metrics.adoptionRate}%</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-slate-400 mb-1">Users</div>
          <div className="text-sm font-bold text-pink-400">{skill.metrics.userCount}K</div>
        </div>
      </div>

      {/* Full Description */}
      <p className="text-sm text-slate-300 mb-6 line-clamp-2">{skill.usage}</p>

      {/* Copy Prompt Button */}
      <button
        onClick={() => onPromptClick(skill)}
        className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
          isHovered
            ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30"
            : "bg-slate-700/60 text-slate-200 hover:bg-slate-700"
        }`}
      >
        📋 Copy Agent Prompt
      </button>

      {/* Stats */}
      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <span>📥 {skill.downloads} downloads</span>
        <span className="text-green-400">✓ {skill.status === "active" ? "Active" : "Beta"}</span>
      </div>
    </div>
  );
}
