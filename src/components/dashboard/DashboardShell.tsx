"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import Link from "next/link";

type DashboardShellProps = {
  children: ReactNode;
  title: string;
  role: 'farmer' | 'exporter';
};

export function DashboardShell({ children, title, role }: DashboardShellProps) {
  const router = useRouter();
  const { session, isLoading } = useAuth();

  useEffect(() => {
    // Redirect to login if session is lost
    if (!isLoading && !session?.user) {
      router.replace("/auth/login");
    }
  }, [isLoading, session, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="h-8 w-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Verifying Credentials...</p>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white selection:bg-teal-100" aria-label={`${title} ${role}`}>
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href={`/dashboard/${role}`} className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">
            ምርት <span className="text-teal-600 text-lg">tech</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Authenticated {role}</p>
              <p className="text-[11px] font-bold text-slate-900">{session.user.email}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-xs">
              {session.user.email?.[0].toUpperCase()}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-8 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-2 italic">
            {title}
          </h1>
          <div className="h-1 w-12 bg-teal-500 rounded-full" />
        </header>

        {children}
      </main>

      {/* Footer Branding */}
      <footer className="max-w-7xl mx-auto px-8 py-12 border-t border-slate-50">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">
          © 2026 SELAMAWIT MESFIN • ENTERPRISE CORE v1.0
        </p>
      </footer>
    </div>
  );
}

export default DashboardShell;