"use client";
import { JikanNewsSection } from "@/components/news/JikanNewsSection";

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-orange-400/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-red-400/30 rounded-full animate-ping"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-orange-300/25 rounded-full animate-bounce"></div>
        <div className="absolute top-60 right-1/3 w-1 h-1 bg-red-300/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-orange-500/15 rounded-full animate-ping"></div>
      </div>

      <div className="max-w-6xl mx-auto p-6 relative z-10">
        <JikanNewsSection />
      </div>
    </div>
  );
} 