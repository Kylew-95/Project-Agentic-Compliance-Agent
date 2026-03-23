"use client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useState } from "react";

export default function ContextPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [inferredData, setInferredData] = useState<any>(null);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.inferred_profile) {
        setInferredData(data.inferred_profile);
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to process document. Ensure backend is running.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-black tracking-tighter">Zero-Input Context</h2>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
            Stop filling out forms. Upload your company handbook or policy PDF, and our AI will infer your sector, risks, and compliance needs.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12">
          {/* File Upload Box */}
          <div className="p-12 bg-primary/5 border-2 border-dashed border-primary/20 rounded-[3rem] text-center hover:bg-primary/10 transition-all group relative overflow-hidden">
            <input 
              type="file" 
              className="hidden" 
              id="policy-upload" 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <label htmlFor="policy-upload" className="cursor-pointer block space-y-6">
              <div className="text-7xl group-hover:scale-110 transition-transform duration-500">📄</div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {file ? file.name : "Drop your company documents here"}
                </div>
                <div className="text-sm text-foreground/40 mt-2 font-mono uppercase tracking-widest">
                  PDF or Text File • Max 10MB
                </div>
              </div>
            </label>
            
            {file && !uploading && !inferredData && (
              <button 
                onClick={handleUpload}
                className="mt-8 bg-primary text-primary-foreground px-10 py-4 rounded-2xl font-black text-lg shadow-2xl hover:scale-105 transition-all active:scale-95"
              >
                Start Automated Inference
              </button>
            )}

            {uploading && (
              <div className="mt-8 space-y-4">
                <div className="w-48 h-1 bg-secondary mx-auto rounded-full overflow-hidden">
                  <div className="h-full bg-primary animate-[upload_2s_ease-in-out_infinite]"></div>
                </div>
                <p className="text-xs font-bold text-primary uppercase animate-pulse">AI is reading your documents...</p>
              </div>
            )}
          </div>

          {/* Results Display */}
          {inferredData && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="p-6 bg-background border border-secondary rounded-3xl shadow-sm">
                <div className="text-[10px] font-bold text-foreground/40 uppercase mb-1">Inferred Entity</div>
                <div className="text-xl font-black text-primary">{inferredData.name}</div>
              </div>
              <div className="p-6 bg-background border border-secondary rounded-3xl shadow-sm">
                <div className="text-[10px] font-bold text-foreground/40 uppercase mb-1">Business Sector</div>
                <div className="text-xl font-black">{inferredData.sector}</div>
              </div>
              <div className="p-6 bg-background border border-secondary rounded-3xl shadow-sm">
                <div className="text-[10px] font-bold text-foreground/40 uppercase mb-1">Risk Appetite</div>
                <div className="text-xl font-black text-orange-500">{inferredData.risk_tolerance}</div>
              </div>
              
              <div className="md:col-span-3 p-8 bg-secondary/20 rounded-[2rem] border border-secondary">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Detected Compliance Pillars</h3>
                <div className="flex flex-wrap gap-2">
                  {inferredData.key_policies.map((p: string) => (
                    <span key={p} className="px-4 py-2 bg-background border border-secondary rounded-xl text-sm font-bold shadow-sm">
                      🛡️ {p}
                    </span>
                  ))}
                  {inferredData.key_policies.length === 0 && (
                    <span className="text-foreground/40 italic text-sm">No specific policies detected yet. Try a more detailed document.</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes upload {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </DashboardLayout>
  );
}
