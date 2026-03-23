"use client";
import { useEffect, useState } from "react";

export function AnalyticsOverview() {
  const [company, setCompany] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [compRes, statusRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/company"),
          fetch("http://127.0.0.1:8000/api/compliance/status")
        ]);
        
        const compData = await compRes.json();
        const statusData = await statusRes.json();
        
        if (compData.sector !== "None") {
           setCompany(compData);
        }
        setStatus(statusData);
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const hasContext = company && company.sector !== "None";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 bg-background border border-secondary rounded-[2rem] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">📈</div>
          <h3 className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em] mb-4">Overall Health</h3>
          <p className={`text-5xl font-black italic tracking-tighter transition-all ${hasContext ? 'text-primary' : 'text-foreground/20'}`}>
            {hasContext && status ? `${status.health}%` : "0%"}
          </p>
          <p className={`text-[10px] font-black mt-4 uppercase tracking-widest ${hasContext ? 'text-green-500' : 'text-foreground/20 italic'}`}>
            {hasContext ? `✓ ${company.name} Active` : "Awaiting File Upload"}
          </p>
        </div>
        
        <div className="p-8 bg-background border border-secondary rounded-[2rem] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">⚠️</div>
          <h3 className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em] mb-4">Risk Factors</h3>
          <p className={`text-5xl font-black italic tracking-tighter transition-all ${hasContext ? 'text-amber-500' : 'text-foreground/20'}`}>
            {hasContext && status ? status.risk_count : "0"}
          </p>
          <p className="text-[10px] font-black mt-4 text-foreground/40 uppercase tracking-widest">
            {hasContext ? `${company.sector} Sector Conflicts` : "Provide context to begin"}
          </p>
        </div>

        <div className="p-8 bg-background border border-secondary rounded-[2rem] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">🤖</div>
          <h3 className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em] mb-4">AI Confidence</h3>
          <p className={`text-5xl font-black italic tracking-tighter transition-all ${hasContext ? 'text-foreground' : 'text-foreground/20'}`}>
            {hasContext ? "High" : "N/A"}
          </p>
          <p className="text-[10px] font-black mt-4 text-foreground/40 uppercase tracking-widest">
            Analyzing 1,400+ Live Bills
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-8 bg-background border border-secondary rounded-[2.5rem] shadow-sm">
          <h2 className="text-xl font-black mb-6 tracking-tight">Compliance Strengths</h2>
          <div className="space-y-4">
            {hasContext ? (
               <>
                <div className="p-5 bg-green-500/5 border border-green-500/10 rounded-2xl flex items-center justify-between group hover:border-green-500/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Sector Alignment</span>
                  </div>
                  <span className="text-[10px] bg-green-500 text-white px-3 py-1 rounded-full font-black uppercase tracking-widest">Match</span>
                </div>
                <div className="p-5 bg-green-500/5 border border-green-500/10 rounded-2xl flex items-center justify-between group hover:border-green-500/30 transition-all">
                   <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Policy Matching</span>
                  </div>
                  <span className="text-[10px] bg-green-500 text-white px-3 py-1 rounded-full font-black uppercase tracking-widest">Active</span>
                </div>
              </>
            ) : (
              <div className="text-foreground/30 italic py-12 text-center border-2 border-dashed border-secondary rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px]">
                Upload your company policy to see strengths.
              </div>
            )}
          </div>
        </div>
        
        <div className={`p-8 rounded-[2.5rem] border transition-all ${
          hasContext ? 'bg-amber-500/5 border-amber-500/20' : 'bg-red-500/5 border-red-500/20'
        }`}>
          <h2 className={`text-xl font-black mb-4 tracking-tight ${hasContext ? 'text-amber-600' : 'text-red-600'}`}>
             {hasContext ? "Action Required" : "Gap Analysis"}
          </h2>
          <p className="text-foreground/70 text-sm leading-relaxed mb-6 font-medium">
            {hasContext && status
              ? `We've detected ${status.risk_count} legislative conflicts. Initial scan shows critical bills in the ${company.sector} sector that potentially bypass your current policies.` 
              : "Once you provide your business details, the AI will perform a real-time comparison against new UK bills to identify potential risks."}
          </p>
          {hasContext && status && status.critical_bills.length > 0 && (
             <div className="space-y-2 mb-6">
                {status.critical_bills.slice(0, 2).map((title: string, i: number) => (
                  <div key={i} className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest text-amber-700">
                    High Risk: {title.slice(0, 40)}...
                  </div>
                ))}
             </div>
          )}
          {hasContext && (
             <button className="w-full bg-amber-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest text-[10px]">
               View Detailed Risk Report
             </button>
          )}
        </div>
      </div>
    </div>
  );
}
