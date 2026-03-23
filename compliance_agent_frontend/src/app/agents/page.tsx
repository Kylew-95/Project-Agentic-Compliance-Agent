"use client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useState } from "react";

const INITIAL_AGENTS = [
  { id: "sorter", name: "Case Sorter", desc: "Monitors folders to categorize legal docs & identify matter types.", status: "Active", icon: "📂" },
  { id: "deadline", name: "Deadline Sentinel", desc: "Scans filings for court dates and auto-populates calendars.", status: "Idle", icon: "📅" },
  { id: "update", name: "Client Messenger", desc: "Drafts 3-sentence status updates for clients in plain English.", status: "Idle", icon: "✉️" },
  { id: "legis", name: "Legislation Monitor", desc: "Tracks live UK bills and identifies risks to active matters.", status: "Active", icon: "⚖️" },
];

export default function AgentsPage() {
  const [agents, setAgents] = useState(INITIAL_AGENTS);

  const toggleAgent = (id: string) => {
    setAgents(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, status: a.status === "Idle" ? "Active" : "Idle" };
      }
      return a;
    }));
  };

  const activeCount = agents.filter(a => a.status === "Active").length;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-12 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-secondary/20 p-8 rounded-[2.5rem] border border-secondary shadow-sm">
          <div>
            <h2 className="text-4xl font-black tracking-tighter italic uppercase text-foreground">Digital Case Clerk <span className="text-primary not-italic">Squad</span></h2>
            <p className="text-foreground/50 mt-2 font-medium">
              Scale your firm with specialized AI agents handling document sorting, deadlines, and client comms.
            </p>
          </div>
          <div className="flex items-center gap-4 px-6 py-3 bg-background rounded-2xl border border-secondary shadow-inner">
            <div className="text-2xl font-black text-primary">{activeCount}/{agents.length}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-foreground/40 leading-none">Agents<br/>Deployed</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {agents.map((agent) => (
            <div key={agent.id} className={`p-8 bg-background border rounded-[2.5rem] transition-all group relative overflow-hidden ${
              agent.status === "Active" ? "border-primary/30 shadow-lg shadow-primary/5" : "border-secondary hover:border-primary/20"
            }`}>
              {/* Status Glow */}
              {agent.status === "Active" && (
                <div className="absolute -right-12 -top-12 w-24 h-24 bg-primary/10 blur-3xl animate-pulse"></div>
              )}
              
              <div className="flex justify-between items-start mb-8">
                <div className="w-16 h-16 bg-secondary/50 rounded-2xl flex items-center justify-center text-3xl border border-secondary group-hover:scale-110 transition-transform">
                  {agent.icon}
                </div>
                <div 
                  onClick={() => toggleAgent(agent.id)}
                  className={`w-14 h-8 rounded-full border p-1 cursor-pointer transition-all flex items-center ${
                    agent.status === "Active" ? "bg-primary/20 border-primary" : "bg-secondary border-secondary-foreground/10"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full shadow-sm transition-transform ${
                    agent.status === "Active" ? "bg-primary translate-x-6" : "bg-foreground/20 translate-x-0"
                  }`}></div>
                </div>
              </div>

              <h3 className="text-2xl font-black mb-3 italic uppercase tracking-tight group-hover:text-primary transition-colors">
                {agent.name}
              </h3>
              <p className="text-sm text-foreground/50 font-medium mb-12 leading-relaxed">
                {agent.desc}
              </p>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${agent.status === "Active" ? "bg-green-500 animate-pulse" : "bg-foreground/20"}`}></div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${
                    agent.status === "Active" ? "text-green-500" : "text-foreground/30"
                  }`}>
                    {agent.status === "Active" ? "Mission Ongoing" : "Standby Mode"}
                  </span>
                </div>
                <button 
                  onClick={() => toggleAgent(agent.id)}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    agent.status === "Active"
                      ? "text-red-500 hover:bg-red-500/10"
                      : "bg-primary text-primary-foreground hover:shadow-lg shadow-primary/20"
                  }`}
                >
                  {agent.status === "Active" ? "Terminate" : "Deploy"}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Verification Card */}
        <div className="bg-secondary/10 border border-dashed border-secondary rounded-[2.5rem] p-12 text-center">
          <div className="text-4xl mb-4">🛡️</div>
          <h3 className="text-xl font-bold mb-2">Human-In-The-Loop Security</h3>
          <p className="text-sm text-foreground/50 max-w-md mx-auto">
            All agent actions (Drafting updates, setting deadlines) are staged for your review. Agents cannot execute external actions without your explicit 1-click approval.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
