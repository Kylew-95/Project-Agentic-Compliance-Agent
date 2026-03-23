"use client";

import { useEffect, useState } from "react";
import { BillDetailsModal } from "./BillDetailsModal";
import { FilterModal } from "./FilterModal";

type Law = {
  id: number;
  title: string;
  status: string;
  impact: string;
  passingProbability: number;
  mpPrediction: string;
  category: string;
  rag_matches?: string[];
};

export function LegislativeTracker() {
  const [laws, setLaws] = useState<Law[]>([]);
  const [filteredLaws, setFilteredLaws] = useState<Law[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLaw, setSelectedLaw] = useState<Law | null>(null);
  
  // Advanced Filtering State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: "All",
    status: "All",
    impact: "All",
    query: ""
  });

  // Pagination State
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    async function fetchLaws() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/legislation");
        const data = await res.json();
        if (data.laws) {
          setLaws(data.laws);
        }
      } catch (error) {
        console.error("Failed to fetch laws", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLaws();
  }, []);

  useEffect(() => {
    let result = laws;
    
    if (filters.category !== "All") result = result.filter(l => l.category === filters.category);
    if (filters.status !== "All") {
       if (filters.status === "Active") result = result.filter(l => !l.status.toLowerCase().includes("royal assent"));
       else if (filters.status === "Enacted") result = result.filter(l => l.status.toLowerCase().includes("royal assent"));
       else result = result.filter(l => l.status.toLowerCase().includes(filters.status.toLowerCase()));
    }
    if (filters.impact !== "All") result = result.filter(l => l.impact === filters.impact);
    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter(l => l.title.toLowerCase().includes(q) || l.mpPrediction.toLowerCase().includes(q));
    }
    
    setFilteredLaws(result);
  }, [filters, laws]);

  if (loading) {
    return (
      <div className="bg-background border border-secondary rounded-3xl shadow-sm p-16 text-center animate-pulse border-dashed">
        <p className="text-foreground/40 text-[10px] font-black uppercase tracking-widest">Predictive Engine Synchronization...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-secondary/10 p-4 rounded-[2.5rem] border border-secondary">
        <div className="flex-1 w-full relative group">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/30 group-focus-within:text-primary transition-colors">🔍</div>
          <input 
            type="text"
            placeholder="Search across 1,400+ live bills..."
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            className="w-full bg-background border border-secondary pl-14 pr-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 ring-primary/20 transition-all placeholder:text-foreground/20"
          />
        </div>
        
        <button 
          onClick={() => setIsFilterOpen(true)}
          className="w-full md:w-auto px-10 py-4 bg-background border border-secondary rounded-2xl flex items-center justify-center gap-3 hover:bg-secondary/20 transition-all group"
        >
          <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60 transition-colors group-hover:text-primary">Advanced Filters</span>
          <div className="w-5 h-5 bg-primary/10 rounded-lg flex items-center justify-center text-[10px] text-primary">⚡</div>
        </button>
      </div>

      <div className="bg-background border border-secondary rounded-[3rem] shadow-sm overflow-hidden border-b-8 border-b-secondary">
        <div className="p-8 border-b border-secondary flex justify-between items-center bg-secondary/5">
          <div className="flex items-center gap-4">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse ring-4 ring-red-500/10"></div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/50">Parliamentary Momentum Feed</h2>
          </div>
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30 px-3 py-1 bg-secondary rounded-full border border-secondary">
               {filteredLaws.length} Results
             </span>
             <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20">
               Live Data
             </span>
          </div>
        </div>
        
        <div className="divide-y divide-secondary">
          {filteredLaws.length === 0 && (
            <div className="p-24 text-center">
              <div className="text-4xl mb-4 opacity-10 grayscale">🏢</div>
              <p className="text-foreground/30 font-black uppercase tracking-widest text-[10px]">No matches in the current legislative cycle</p>
            </div>
          )}
          {filteredLaws.map((law, idx) => (
            <div 
              key={law.id} 
              onClick={() => setSelectedLaw(law)}
              className="p-8 hover:bg-secondary/10 transition-all group relative cursor-pointer flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
              
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-secondary/50 rounded-lg flex items-center justify-center text-xs border border-secondary group-hover:scale-110 transition-transform">
                     {idx + 1}
                   </div>
                   <span className="px-3 py-1 bg-secondary text-[8px] font-black rounded-lg text-foreground/40 uppercase tracking-[0.2em] border border-secondary">
                     {law.category}
                   </span>
                </div>
                
                <h3 className="font-black text-2xl leading-tight tracking-tight group-hover:text-primary transition-colors max-w-2xl">
                  {law.title}
                </h3>
                
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-secondary/50 rounded-full border border-secondary group-hover:border-primary/20 transition-colors">
                    <div className={`w-2 h-2 rounded-full ${law.status.includes('Royal') ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 'bg-green-500 animate-pulse'}`}></div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-foreground/60">{law.status}</span>
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest
                    ${law.impact === 'High' ? 'text-orange-500' : 'text-blue-500'}`}>
                    {law.impact} IMPACT RISK
                  </span>
                </div>

                <div className="bg-background/50 border border-secondary p-4 rounded-2xl group-hover:border-primary/20 transition-all space-y-3">
                   <div className="flex items-start gap-3">
                      <div className="text-primary text-sm">🛡️</div>
                      <p className="text-[10px] leading-relaxed text-foreground/50 font-black uppercase tracking-widest">
                         <span className="text-foreground/80">RISK VECTOR:</span> {law.mpPrediction}
                      </p>
                   </div>
                   
                   {/* RAG-based Match Evidence */}
                   {law.rag_matches && law.rag_matches.length > 0 && (
                     <div className="flex flex-wrap gap-2 pt-1 border-t border-secondary/30">
                        {law.rag_matches.map((match: string, mIdx: number) => (
                          <span key={mIdx} className="text-[7px] font-black uppercase tracking-widest px-2 py-0.5 bg-primary/5 text-primary/70 rounded-md border border-primary/10">
                            Match: {match}
                          </span>
                        ))}
                     </div>
                   )}
                </div>
              </div>

              <div className="flex lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto p-8 bg-secondary/20 lg:bg-transparent rounded-3xl border border-secondary lg:border-none">
                <div className="text-center lg:text-right">
                  <div className={`text-6xl font-black italic tracking-tighter transition-all group-hover:scale-110 ${
                    law.status.includes('Royal') ? 'text-purple-500' :
                    law.passingProbability > 75 ? 'text-red-500' : 
                    law.passingProbability > 40 ? 'text-amber-500' : 'text-green-500'
                  }`}>
                    {law.passingProbability}%
                  </div>
                  <div className="text-[9px] font-black text-foreground/30 uppercase tracking-[0.3em] mt-3">Confidence</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <FilterModal 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        onApply={(newFilters) => setFilters(newFilters)}
        initialFilters={filters}
        resultCount={filteredLaws.length}
      />

      {selectedLaw && (
        <BillDetailsModal 
          law={selectedLaw} 
          onClose={() => setSelectedLaw(null)} 
        />
      )}
    </div>
  );
}
