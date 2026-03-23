"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { NotificationList } from "./NotificationList";

export function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard Overview", href: "/" },
    { label: "Agent Intelligence", href: "/intelligence" },
    { label: "Business Context", href: "/context" },
    { label: "Assign Agents", href: "/agents" },
  ];

  return (
    <div className="flex bg-background min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary/10 hidden md:flex flex-col border-r border-secondary sticky top-0 h-screen">
        <div className="p-8">
          <Link href="/">
            <h2 className="text-xl font-black italic tracking-tighter text-primary cursor-pointer hover:scale-105 transition-transform uppercase">Compliance AI</h2>
          </Link>
          <p className="text-[10px] font-black text-foreground/40 tracking-[0.2em] uppercase mt-2">Predictive HQ</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={`block px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                pathname === item.href 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "text-foreground/50 hover:bg-secondary/30 hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-6 border-t border-secondary">
          <button className="w-full py-4 bg-background border border-secondary text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-secondary/30 transition shadow-sm">
            Terminal Lock
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-20 border-b border-secondary flex items-center justify-between px-10 bg-background/80 backdrop-blur-sm sticky top-0 z-[50]">
          <h1 className="text-sm font-black uppercase tracking-widest opacity-80 italic">UK Compliance Monitoring v2.0</h1>
          <div className="flex items-center gap-6">
            <NotificationList />
            <div className="w-px h-6 bg-secondary mx-2"></div>
            <span className="px-5 py-2 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-xl tracking-widest border border-primary/20 animate-pulse shadow-sm">
              Squad: Active
            </span>
          </div>
        </header>
        <div className="p-10 max-w-[1400px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
