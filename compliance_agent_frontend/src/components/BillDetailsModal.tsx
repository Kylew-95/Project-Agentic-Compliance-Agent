"use client";
import React, { useEffect, useState } from "react";

type VoteBreakdown = {
  bill_title: string;
  division_title: string;
  date: string;
  ayes: number;
  noes: number;
  margin: number;
  recorded_votes: { MemberName: string; Vote: string; Party: string }[];
};

export function BillDetailsModal({ law, onClose }: { law: any; onClose: () => void }) {
  const [votes, setVotes] = useState<VoteBreakdown | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVotes() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/legislation/votes?title=${encodeURIComponent(law.title)}`);
        const data = await res.json();
        setVotes(data);
      } catch (e) {
        console.error("Failed to fetch votes", e);
      } finally {
        setLoading(false);
      }
    }
    fetchVotes();
  }, [law]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-background border border-secondary w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-8 border-b border-secondary flex justify-between items-start bg-secondary/5">
          <div className="space-y-2">
            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/20">
              Legislative Drill-Down
            </span>
            <h2 className="text-3xl font-black tracking-tight">{law.title}</h2>
            <p className="text-foreground/40 text-xs font-mono uppercase tracking-widest">{law.status} • CID: {law.id}</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-secondary rounded-full transition-colors text-2xl">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-12">
          {loading ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-foreground/40">Aggregating Division Data...</p>
            </div>
          ) : votes ? (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 bg-green-500/5 border border-green-500/20 rounded-3xl text-center">
                  <div className="text-5xl font-black text-green-500 italic mb-1">{votes.ayes}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Ayes (Support)</div>
                </div>
                <div className="p-8 bg-red-500/5 border border-red-500/20 rounded-3xl text-center">
                  <div className="text-5xl font-black text-red-500 italic mb-1">{votes.noes}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Noes (Oppose)</div>
                </div>
                <div className="p-8 bg-primary/5 border border-primary/20 rounded-3xl text-center">
                  <div className="text-5xl font-black text-primary italic mb-1">+{votes.margin}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Net Majority</div>
                </div>
              </div>

              {/* Voting Context */}
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/60 border-l-4 border-primary pl-4">Voting Records</h3>
                <div className="bg-secondary/10 rounded-[2rem] border border-secondary overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-secondary/20 border-b border-secondary">
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Member Name</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Party</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Vote</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary">
                      {votes.recorded_votes.map((v, i) => (
                        <tr key={i} className="hover:bg-secondary/10 transition-colors">
                          <td className="px-6 py-4 text-sm font-bold">{v.MemberName}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-background border border-secondary rounded text-[10px] font-bold opacity-70">
                                {v.Party}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm border ${
                              v.Vote === 'Aye' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                            }`}>
                              {v.Vote}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="py-20 text-center opacity-40 italic">No voting data found for this specific bill version.</div>
          )}
        </div>

        <div className="p-8 border-t border-secondary bg-secondary/5 text-center">
            <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.3em]">Live Feed: commonsvotes-api.parliament.uk</p>
        </div>
      </div>
    </div>
  );
}
