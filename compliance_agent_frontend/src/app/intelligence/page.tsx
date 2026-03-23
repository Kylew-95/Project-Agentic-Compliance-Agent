"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { AIChat } from "@/components/AIChat";
import { ActionStaging } from "@/components/ActionStaging";

export default function IntelligencePage() {
  return (
    <DashboardLayout>
      <div className="space-y-10 animate-in fade-in duration-700">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-black italic tracking-tighter uppercase">Agent Intelligence</h2>
            <p className="text-foreground/50 mt-2 font-medium">
              Consult your Digital Case Clerk squad and verify pending mission executions.
            </p>
          </div>
          <div className="flex gap-4">
             <div className="px-6 py-3 bg-secondary/10 border border-secondary rounded-2xl text-[10px] font-black uppercase tracking-widest">
               Squad Efficiency: <span className="text-primary">94%</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chat Interface */}
          <div className="lg:col-span-2 h-[700px] bg-background border border-secondary rounded-[3rem] shadow-sm overflow-hidden relative">
            <AIChat />
          </div>

          {/* HITL Action Staging Hub */}
          <div className="h-[700px]">
            <ActionStaging />
          </div>
        </div>

        <div className="p-10 bg-secondary/10 border border-secondary rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8 py-12">
           <div className="flex-1 space-y-2">
              <h3 className="text-xl font-black italic tracking-tighter uppercase">Compliance RAG Memory</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 leading-relaxed max-w-xl">
                 Our agents use persistent vector memory to cross-reference your business policy with 1,400+ live Parliamentary tracks.
              </p>
           </div>
           <button className="px-10 py-4 bg-background border border-secondary rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all">
              Index Matter Folders
           </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
