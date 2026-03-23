"use client";

import { useEffect, useState } from "react";

type Action = {
  id: string;
  agent: string;
  type: string;
  description: string;
  timestamp: string;
  status: "pending" | "approved" | "rejected";
};

export function ActionStaging() {
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActions() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/actions");
        const data = await res.json();
        setActions(data);
      } catch (error) {
        console.error("Failed to fetch actions", error);
      } finally {
        setLoading(false);
      }
    }
    fetchActions();
    const interval = setInterval(fetchActions, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = (id: string, newStatus: "approved" | "rejected") => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  const pending = actions.filter(a => a.status === "pending");

  return (
    <div className="bg-background border border-secondary rounded-[3rem] shadow-sm overflow-hidden flex flex-col h-full border-b-8 border-b-primary/10">
      <div className="p-8 border-b border-secondary flex justify-between items-center bg-secondary/10">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/50">Action Staging Area</h3>
          <p className="text-xl font-black italic tracking-tighter uppercase mt-1">Human-In-The-Loop Approval</p>
        </div>
        <div className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
          {pending.length} Pending
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
        {pending.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center opacity-20 grayscale">
            <div className="text-4xl mb-4 text-primary">🛡️</div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">All agent actions verified</p>
          </div>
        ) : (
          pending.map(action => (
            <div key={action.id} className="p-6 bg-secondary/5 border border-secondary rounded-[2rem] space-y-4 hover:border-primary/30 transition-all group animate-in slide-in-from-right-4 duration-500">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-secondary text-foreground/40 rounded-lg border border-secondary mb-2 block w-fit">
                    {action.agent}
                  </span>
                  <h4 className="text-sm font-black uppercase tracking-widest">{action.type}</h4>
                </div>
                <span className="text-[8px] font-black text-foreground/20 italic">{action.timestamp}</span>
              </div>
              
              <p className="text-[10px] leading-relaxed text-foreground/60 font-medium">
                {action.description}
              </p>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => handleAction(action.id, "approved")}
                  className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Approve Execution
                </button>
                <button 
                  onClick={() => handleAction(action.id, "rejected")}
                  className="px-6 bg-background border border-secondary py-3 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-6 border-t border-secondary bg-secondary/5 text-center">
        <p className="text-[8px] font-black uppercase tracking-widest text-foreground/30 italic">
          Agents are on standby awaiting command verification
        </p>
      </div>
    </div>
  );
}
