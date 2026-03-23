"use client";
import React, { useState, useEffect } from "react";

export function CompanyProfile() {
  const [profile, setProfile] = useState({ name: "", sector: "", policies: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/company")
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch("http://127.0.0.1:8000/api/company", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    setSaving(false);
    alert("Profile saved! The AI now has your business context.");
  };

  if (loading) return <div className="p-4 text-foreground/50">Loading profile...</div>;

  return (
    <div className="p-6 bg-background border border-secondary rounded-2xl shadow-sm space-y-4">
      <h2 className="text-xl font-bold">Business Context</h2>
      <p className="text-sm text-foreground/60">Provide your details to enable real-time compliance matching.</p>
      
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-bold uppercase text-foreground/50 mb-1">Company Name</label>
          <input 
            type="text" 
            className="w-full bg-secondary/20 border border-secondary p-2 rounded-lg outline-none focus:border-primary transition-colors"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold uppercase text-foreground/50 mb-1">Industry Sector</label>
          <select 
            className="w-full bg-secondary/20 border border-secondary p-2 rounded-lg outline-none focus:border-primary transition-colors"
            value={profile.sector}
            onChange={(e) => setProfile({ ...profile, sector: e.target.value })}
          >
            <option value="None">Select Sector</option>
            <option value="Finance">Finance</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Technology">Technology</option>
            <option value="Legal">Legal</option>
            <option value="Manufacturing">Manufacturing</option>
          </select>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-primary text-primary-foreground font-bold py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Business Context"}
        </button>
      </div>
    </div>
  );
}
