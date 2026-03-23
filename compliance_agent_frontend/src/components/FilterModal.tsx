"use client";

import { useState } from "react";

const CATEGORIES = ["All", "Financial", "Tech", "ESG", "Education", "Healthcare", "Legal", "General"];
const STATUSES = ["All", "Active", "Enacted", "Failed"];
const IMPACTS = ["All", "High", "Medium", "Low"];

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  initialFilters: any;
  resultCount: number;
}

const SECTOR_ICONS: Record<string, string> = {
  "All": "📋",
  "Financial": "💰",
  "Tech": "💻",
  "ESG": "🍃",
  "Education": "🎓",
  "Healthcare": "🏥",
  "Legal": "⚖️",
  "General": "🏢"
};

export function FilterModal({ isOpen, onClose, onApply, initialFilters, resultCount }: FilterModalProps) {
  const [filters, setFilters] = useState(initialFilters);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-background border border-secondary w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ring-1 ring-white/10">
        <div className="p-10 border-b border-secondary flex justify-between items-center bg-secondary/10">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs">⚡</div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">Legislative Configurator</h2>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mt-2 ml-11">Advanced Filtering System v2.0</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-full border border-secondary flex items-center justify-center hover:bg-secondary/50 transition-all hover:rotate-90">✕</button>
        </div>

        <div className="p-10 space-y-12 overflow-y-auto no-scrollbar">
          {/* Category Section */}
          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Select Sector</h3>
              <span className="text-[8px] font-black text-primary uppercase">Required Selection</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilters({ ...filters, category: cat })}
                  className={`px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border flex flex-col items-center gap-2 group ${
                    filters.category === cat 
                      ? "bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/20 scale-[1.05]" 
                      : "bg-secondary/5 text-foreground/60 border-secondary hover:border-primary/50 hover:bg-secondary/20"
                  }`}
                >
                  <span className="text-lg grayscale-0 group-hover:scale-110 transition-transform">{SECTOR_ICONS[cat] || "📄"}</span>
                  {cat}
                </button>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Status Section */}
            <section className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Legislative Status</h3>
              <div className="grid grid-cols-2 gap-2">
                {STATUSES.map(status => (
                  <button
                    key={status}
                    onClick={() => setFilters({ ...filters, status: status })}
                    className={`px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                      filters.status === status 
                        ? "bg-primary text-primary-foreground border-primary" 
                        : "bg-secondary/5 text-foreground/60 border-secondary hover:border-primary/20"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </section>

            {/* Impact Section */}
            <section className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Impact Risk</h3>
              <div className="grid grid-cols-2 gap-2">
                {IMPACTS.map(impact => (
                  <button
                    key={impact}
                    onClick={() => setFilters({ ...filters, impact: impact })}
                    className={`px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                      filters.impact === impact 
                        ? "bg-primary text-primary-foreground border-primary" 
                        : "bg-secondary/5 text-foreground/60 border-secondary hover:border-primary/20"
                    }`}
                  >
                    {impact}
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Search Input */}
          <section className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Keyword Override</h3>
            <div className="relative group">
               <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary opacity-50 group-focus-within:opacity-100 transition-opacity">⚡</div>
               <input 
                type="text"
                placeholder="Search across title & summary..."
                value={filters.query || ""}
                onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                className="w-full bg-secondary/10 border border-secondary pl-14 pr-6 py-6 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] focus:ring-4 ring-primary/10 outline-none transition-all placeholder:text-foreground/20"
              />
            </div>
          </section>
        </div>

        <div className="p-10 border-t border-secondary bg-secondary/5 flex items-center justify-between gap-6">
          <button 
            onClick={() => setFilters({ category: "All", status: "All", impact: "All", query: "" })}
            className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors hover:bg-primary/5 rounded-2xl"
          >
            Reset Filters
          </button>
          <button 
            onClick={() => { onApply(filters); onClose(); }}
            className="flex-1 bg-primary text-primary-foreground py-6 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:translate-y-[-2px] active:translate-y-[1px] transition-all"
          >
            Show {resultCount} Legislative Results
          </button>
        </div>
      </div>
    </div>
  );
}
