"use client";

export type Finding = {
  id: string;
  framework: "SOC 2" | "HIPAA" | "GDPR" | "General";
  severity: "High" | "Medium" | "Low";
  description: string;
  recommendation: string;
}

export function ReportView({ findings, isLoading }: { findings: Finding[], isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="w-full p-16 flex flex-col items-center justify-center space-y-6 bg-secondary/10 rounded-2xl border-2 border-secondary animate-pulse">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-lg font-medium text-foreground/70">Our AI Agent is analyzing your policy...</p>
      </div>
    );
  }

  if (findings.length === 0) {
    return (
      <div className="w-full p-8 bg-green-500/10 border border-green-500/20 rounded-2xl text-center">
        <h3 className="text-xl font-semibold text-green-600 dark:text-green-400">All Clear!</h3>
        <p className="text-foreground/70 mt-2">No compliance violations found in the provided text.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-end border-b border-secondary pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Compliance Report</h2>
          <p className="text-foreground/60 mt-1">{findings.length} issues detected</p>
        </div>
      </div>
      
      <div className="grid gap-4">
        {findings.map(finding => (
          <div key={finding.id} className="p-6 bg-background border border-secondary rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full tracking-wide
                ${finding.severity === "High" ? "bg-red-500/10 text-red-600 dark:text-red-400" : 
                  finding.severity === "Medium" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : 
                  "bg-blue-500/10 text-blue-600 dark:text-blue-400"}`}>
                {finding.severity} Severity
              </span>
              <span className="text-xs font-bold px-3 py-1 bg-secondary rounded-full text-secondary-foreground uppercase tracking-wide">
                {finding.framework}
              </span>
            </div>
            <p className="text-lg font-medium mb-4 leading-relaxed">{finding.description}</p>
            <div className="p-4 bg-secondary/30 rounded-lg border border-secondary/50">
              <span className="text-xs font-bold uppercase tracking-wide text-primary mb-2 block">Agent Recommendation</span>
              <p className="text-sm text-foreground/80 leading-relaxed">{finding.recommendation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
