"use client";

import { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase/client";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  // SYSTEM OPTIMIZATION: Prefetching internal portals for a near-instant transition
  useEffect(() => {
    router.prefetch('/dashboard/farmer');
    router.prefetch('/dashboard/exporter');
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      // 1. Primary Authentication
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (authError) throw authError;

      if (authData?.user) {
        // 2. Role-Based Routing Logic
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authData.user.id)
          .single();

        if (profileError || !profile) {
          throw new Error("Identity verification failed. Please contact BDU Support.");
        }

        // 3. Dynamic Redirect based on student-defined roles
        const destination = profile.role === 'farmer' ? '/dashboard/farmer' : '/dashboard/exporter';
        router.push(destination);
      }
    } catch (error: any) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-8 selection:bg-teal-100">
      {/* Structural Accent: XTRA Border */}
      <div className="fixed top-0 left-0 w-full h-2 bg-slate-900"></div>
      
      <div className="w-full max-w-sm">
        <div className="text-center mb-16">
          <Link href="/" className="text-5xl font-black text-slate-900 uppercase tracking-tighter italic">
            ምርት <span className="text-teal-600">tech</span>
          </Link>
          <div className="flex items-center justify-center gap-3 mt-6">
             <span className="h-px w-8 bg-slate-200"></span>
             <p className="text-slate-400 text-[10px] font-black tracking-[0.4em] uppercase">Enterprise Login</p>
             <span className="h-px w-8 bg-slate-200"></span>
          </div>
        </div>

        <form 
          onSubmit={handleLogin} 
          className="bg-white p-0 rounded-none border-none"
        >
          {errorMessage && (
            <div className="mb-8 p-5 bg-red-50 text-red-600 text-[10px] font-black rounded-2xl border border-red-100 uppercase tracking-widest animate-pulse">
              ⚠️ {errorMessage}
            </div>
          )}

          <div className="space-y-8">
            <div className="group">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1 transition-colors group-focus-within:text-teal-600">Corporate Email</label>
              <input 
                type="email" 
                placeholder="name@market.et" 
                className="w-full p-5 bg-slate-50 border-none rounded-3xl font-black text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-teal-500 outline-none transition-all duration-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="group">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1 transition-colors group-focus-within:text-teal-600">Security Key</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full p-5 bg-slate-50 border-none rounded-3xl font-black text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-teal-500 outline-none transition-all duration-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className={`w-full mt-12 p-6 rounded-[2rem] font-black text-xs tracking-[0.3em] uppercase transition-all duration-700 shadow-2xl ${
              loading 
                ? "bg-slate-200 text-slate-400 cursor-wait shadow-none" 
                : "bg-slate-900 text-white hover:bg-teal-600 shadow-slate-200 active:scale-[0.96]"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-4">
                <div className="h-3 w-3 border-2 border-slate-400 border-t-white rounded-full animate-spin"></div>
                <span>Syncing...</span>
              </div>
            ) : "Establish Connection →"}
          </button>

          <div className="mt-12 text-center">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
              New to the platform? {' '}
              <Link href="/auth/signup" className="text-teal-600 hover:text-slate-900 transition-colors ml-2 underline decoration-teal-100 underline-offset-4">Register Harvest</Link>
            </p>
          </div>
        </form>

        <footer className="mt-20 text-center">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">
            © 2026 SELAMAWIT MESFIN • BDU-IS-DEPT
          </p>
        </footer>
      </div>
    </div>
  );
}