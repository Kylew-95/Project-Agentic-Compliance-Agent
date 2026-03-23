"use client";

import { useState } from "react";
import { TextInputArea } from "./TextInputArea";
import { ReportView, Finding } from "./ReportView";

export default function ComplianceAnalyzer() {
  const [analyzing, setAnalyzing] = useState(false);
  const [findings, setFindings] = useState<Finding[] | null>(null);

  const handleAnalyze = async (text: string) => {
    setAnalyzing(true);
    setFindings(null);
    
    // Simulate AI Agent processing time
    setTimeout(() => {
      // Mocked findings to demonstrate the core MVP feature
      const mockFindings: Finding[] = [
        {
          id: "1",
          framework: "SOC 2",
          severity: "High",
          description: "Database configurations appear to lack explicit references to encryption at rest for sensitive customer data.",
          recommendation: "Ensure all persistent storage volumes are configured with AES-256 encryption. For AWS, enforce KMS key usage on RDS instances."
        },
        {
          id: "2",
          framework: "GDPR",
          severity: "Medium",
          description: "Data retention policy does not clearly specify a deletion protocol for inactive user accounts.",
          recommendation: "Update the policy to include an explicit 30-day hard-deletion window upon user request or after 2 years of inactivity."
        }
      ];
      
      setFindings(mockFindings);
      setAnalyzing(false);
    }, 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          1. Submit Policy
        </h2>
        <TextInputArea onAnalyze={handleAnalyze} />
      </div>
      
      {(analyzing || findings) && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <h2 className="text-xl font-semibold flex items-center gap-2">
            2. AI Agent Findings
          </h2>
          <ReportView findings={findings || []} isLoading={analyzing} />
        </div>
      )}
    </div>
  );
}
