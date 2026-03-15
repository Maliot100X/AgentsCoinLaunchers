"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Skill {
  id: string;
  name: string;
  description: string;
  features: number;
  fileName: string;
  size: number;
}

interface SkillDetail {
  id: string;
  name: string;
  content: string;
  overview: string;
  mcp_ready: boolean;
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<SkillDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/skills`);
      if (!response.ok) throw new Error("Failed to fetch skills");
      const data = await response.json();
      setSkills(data.skills || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching skills:", err);
      setError("Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  const loadSkillDetail = async (skillId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/skills/${skillId}`);
      if (!response.ok) throw new Error("Failed to fetch skill details");
      const data = await response.json();
      setSelectedSkill(data);
    } catch (err) {
      console.error("Error fetching skill details:", err);
      setError("Failed to load skill details");
    }
  };

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
        {selectedSkill ? (
          // Skill Detail View
          <div className="grid md:grid-cols-3 gap-8">
            {/* Skills List Sidebar */}
            <div className="md:col-span-1">
              <button
                onClick={() => setSelectedSkill(null)}
                className="mb-6 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors w-full text-left"
              >
                ← Back to List
              </button>
              <div className="space-y-2">
                {loading ? (
                  <p className="text-slate-400">Loading skills...</p>
                ) : (
                  skills.map((skill) => (
                    <button
                      key={skill.id}
                      onClick={() => loadSkillDetail(skill.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                        selectedSkill?.id === skill.id
                          ? "bg-purple-600 border border-purple-400"
                          : "bg-slate-800 border border-slate-700 hover:border-purple-600/50"
                      }`}
                    >
                      <div className="font-semibold text-sm">{skill.name}</div>
                      <div className="text-xs text-slate-400">{skill.features} features</div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Skill Detail View */}
            <div className="md:col-span-2">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-3xl font-bold">{selectedSkill.name}</h1>
                  {selectedSkill.mcp_ready && (
                    <span className="bg-green-600/30 text-green-300 px-3 py-1 rounded-full text-xs border border-green-500/50 whitespace-nowrap">
                      MCP Ready
                    </span>
                  )}
                </div>

                <div className="prose prose-invert max-w-none mb-8">
                  <div className="text-slate-300 space-y-2 whitespace-pre-wrap text-sm">
                    {selectedSkill.content}
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-4 mt-8">
                  <div className="grid grid-cols-2 gap-4 text-sm text-slate-400">
                    <div>
                      <span className="text-slate-300 font-semibold">Skill ID:</span> {selectedSkill.id}
                    </div>
                    <div>
                      <span className="text-slate-300 font-semibold">Size:</span> {(selectedSkill.content.length / 1024).toFixed(2)} KB
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Skills List View
          <div>
            <div className="mb-12">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                🎯 AI Skills Marketplace
              </h1>
              <p className="text-xl text-slate-300">
                Explore powerful AI-ready skills for token launches, trading, and portfolio management
              </p>
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-8 text-red-300">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <p className="text-slate-400">Loading skills...</p>
              </div>
            ) : skills.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400">No skills available</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills.map((skill) => (
                  <button
                    key={skill.id}
                    onClick={() => loadSkillDetail(skill.id)}
                    className="text-left bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-purple-600/50 transition-all hover:shadow-lg hover:shadow-purple-600/20 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold flex-1">{skill.name}</h3>
                      <span className="bg-purple-600/30 text-purple-300 px-2 py-1 rounded text-xs whitespace-nowrap ml-2">
                        MCP
                      </span>
                    </div>

                    <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                      {skill.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-700 pt-3">
                      <span>⚙️ {skill.features} features</span>
                      <span>→ View Details</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-slate-400 text-sm">
          <p>© 2024 AgentsCoinLaunchers. All skills are MCP-ready and AI-compatible.</p>
        </div>
      </footer>
    </div>
  );
}
