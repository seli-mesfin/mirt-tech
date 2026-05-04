"use client";

import { useAuth } from "./AuthProvider";
import { useEffect, useState } from "react";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Small delay to allow XTRA theme styles to settle
    if (!isLoading) {
      const timer = setTimeout(() => setShowContent(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // If the app is still identifying the database connection
  if (isLoading && !showContent) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          {/* Custom XTRA Spinner */}
          <div className="h-10 w-10 border-[3px] border-slate-100 border-t-teal-600 rounded-full animate-spin" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">
            Initializing ምርት tech
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`transition-opacity duration-700 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
      {children}
    </div>
  );
}