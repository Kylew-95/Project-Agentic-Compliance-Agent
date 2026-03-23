"use client";

import { useEffect, useState } from "react";

export function NotificationList() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/notifications");
        const data = await res.json();
        setNotifications(data);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    }
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Polling every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-secondary/50 transition-colors group"
      >
        <div className="text-xl group-hover:scale-110 transition-transform">🔔</div>
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-[8px] font-black text-white flex items-center justify-center rounded-full border-2 border-background animate-bounce">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-4 w-80 bg-background border border-secondary rounded-[2rem] shadow-2xl overflow-hidden z-[100] animate-in slide-in-from-top-2 duration-300">
          <div className="p-5 border-b border-secondary bg-secondary/10 flex justify-between items-center">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground/60">System Alerts</h3>
            <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-primary/10 text-primary rounded-full">Live Feed</span>
          </div>
          <div className="max-h-[400px] overflow-y-auto no-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-10 text-center opacity-30 text-[10px] font-black uppercase tracking-widest">No active alerts</div>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className="p-5 border-b border-secondary hover:bg-secondary/5 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-[10px] font-black uppercase tracking-widest group-hover:text-primary transition-colors">{notif.title}</h4>
                    <span className="text-[8px] text-foreground/30 font-black">{notif.timestamp}</span>
                  </div>
                  <p className="text-[10px] leading-relaxed text-foreground/50 font-medium">{notif.message}</p>
                </div>
              ))
            )}
          </div>
          <div className="p-4 bg-secondary/5 text-center">
             <button className="text-[8px] font-black uppercase tracking-widest text-primary hover:underline">Mark all as read</button>
          </div>
        </div>
      )}
    </div>
  );
}
