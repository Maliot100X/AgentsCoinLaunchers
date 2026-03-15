"use client";

import { useState } from "react";
import ImprovedSkillCard, { type ImprovedSkill } from "./ImprovedSkillCard";
import SkillPromptModal from "./SkillPromptModal";
import { IMPROVED_SKILLS } from "./ImprovedSkillsData";

interface SkillsMarketplaceImprovedProps {
  maxDisplayed?: number;
}

export default function SkillsMarketplaceImproved({ maxDisplayed = 12 }: SkillsMarketplaceImprovedProps) {
  const [selectedSkill, setSelectedSkill] = useState<ImprovedSkill | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Filter skills based on search and category
  const filteredSkills = IMPROVED_SKILLS.filter((skill) => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || skill.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ["all", ...new Set(IMPROVED_SKILLS.map((s) => s.category))];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-5xl font-bold text-white mb-3">Bags.fm Launch Skills</h1>
        <p className="text-lg text-slate-400 mb-8">
          Master-level skills for token launching, fee management, trending detection, portfolio management, price analysis, and trading
        </p>

        {/* Search and Filter Bar */}
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search skills by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-600/60 focus:bg-slate-800/80 transition-all"
            />
            <span className="absolute right-4 top-3 text-slate-500">🔍</span>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  categoryFilter === category
                    ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/30"
                    : "bg-slate-800/60 text-slate-300 border border-slate-700 hover:border-cyan-600/40 hover:text-cyan-400"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-slate-400 mt-4">
          {filteredSkills.length} skill{filteredSkills.length !== 1 ? "s" : ""} available
        </p>
      </div>

      {/* Skills Grid */}
      <div className="max-w-7xl mx-auto">
        {filteredSkills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.slice(0, maxDisplayed).map((skill) => (
              <ImprovedSkillCard
                key={skill.id}
                skill={skill}
                onPromptClick={setSelectedSkill}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">No skills found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Prompt Modal */}
      <SkillPromptModal skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
    </div>
  );
}
