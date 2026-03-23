"use client";
import React, { useState, useEffect } from "react";

export function AIChat() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: "Hi! I'm your UK Compliance Agent. Upload your company policy in the 'Context' tab, and I'll provide targeted analysis of live Parliamentary data for your specific business." }
  ]);
  const [loading, setLoading] = useState(false);
  const [sector, setSector] = useState<string | null>(null);

  useEffect(() => {
    async function checkContext() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/company");
        const data = await res.json();
        if (data.sector !== "Legal") setSector(data.sector);
      } catch (e) {}
    }
    checkContext();
  }, [messages]);

  const handleSend = async () => {
    if (!query) return;
    const userMsg = { role: 'user' as const, content: query };
    setMessages(prev => [...prev, userMsg]);
    setQuery("");
    setLoading(true);
    
    try {
      const res = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Connection error. Ensure backend is running." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background border border-secondary rounded-[2.5rem] shadow-2xl relative overflow-hidden">
      {/* Header with Context Status */}
      <div className="p-6 border-b border-secondary flex items-center justify-between bg-secondary/10">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span className="font-black tracking-tight text-sm uppercase">Agent Active</span>
        </div>
        {sector && (
          <div className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black text-primary uppercase tracking-widest animate-in zoom-in">
            🛡️ Context: {sector}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-5 rounded-[2rem] text-sm leading-relaxed shadow-sm transition-all ${
              m.role === 'user' 
                ? 'bg-primary text-primary-foreground rounded-tr-none' 
                : 'bg-secondary/20 border border-secondary text-foreground rounded-tl-none'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-secondary/10 p-5 rounded-[2rem] rounded-tl-none animate-pulse text-xs font-bold uppercase tracking-widest text-foreground/40">
              Analyzing legislative data...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-secondary bg-background/50 backdrop-blur-xl">
        <div className="flex gap-4 items-center bg-secondary/20 p-2 rounded-[2rem] border border-secondary focus-within:border-primary transition-all">
          <input 
            type="text" 
            placeholder="Ask about a bill, MP, or your business impact..." 
            className="flex-1 bg-transparent px-4 py-3 outline-none text-sm font-medium"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-[1.5rem] font-black hover:scale-105 active:scale-95 transition-all disabled:opacity-50 text-xs uppercase tracking-widest"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
