import { DashboardLayout } from "@/components/DashboardLayout";
import { AnalyticsOverview } from "@/components/AnalyticsOverview";
import { LegislativeTracker } from "@/components/LegislativeTracker";
import Link from "next/link";

export default function Home() {
  return (
    <DashboardLayout>
      <div className="space-y-12 max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight">System Overview</h2>
            <p className="text-foreground/70 mt-2">Aggregate compliance health and live legislative monitoring.</p>
          </div>
          <Link href="/context">
            <button className="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold shadow-lg hover:opacity-90 transition-all">
              Update Business Context
            </button>
          </Link>
        </div>

        {/* Top Section: Analytics */}
        <div className="grid grid-cols-1 gap-8">
          <AnalyticsOverview />
        </div>
        
        {/* Middle Section: Live Tracking */}
        <div className="grid grid-cols-1 gap-8">
          <div className="mb-6">
            <h2 className="text-3xl font-extrabold tracking-tight">Legislative Tracker</h2>
            <p className="text-foreground/70 mt-2">Live UK Parliament monitoring & automated risk predictions.</p>
          </div>
          <LegislativeTracker />
        </div>
      </div>
    </DashboardLayout>
  );
}
