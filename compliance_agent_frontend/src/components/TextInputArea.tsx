"use client";

import { useState } from "react";

export function TextInputArea({ onAnalyze }: { onAnalyze: (text: string) => void }) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAnalyze(text);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex md:flex-row flex-col gap-4 p-6 bg-secondary/30 rounded-2xl border border-secondary shadow-sm">
      <div className="flex-1">
        <label htmlFor="policy-text" className="block text-sm font-medium mb-3 text-foreground/80">
          Paste Policy or System Configuration
        </label>
        <textarea
          id="policy-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. 'All user data is stored in an S3 bucket...'"
          className="w-full h-40 p-4 rounded-xl border border-secondary bg-background focus:ring-2 focus:ring-primary focus:outline-none resize-none transition-all placeholder:text-foreground/30"
        />
      </div>
      <div className="flex flex-col justify-end">
        <button 
          type="submit"
          disabled={!text.trim()}
          className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          Run Compliance Check
        </button>
      </div>
    </form>
  );
}
