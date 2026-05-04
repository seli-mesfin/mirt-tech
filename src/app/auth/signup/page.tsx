"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

function AuthSignupPageContent() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'farmer' | 'exporter'>('farmer');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // PREFETCH: Optimizing for a fast transition after profile creation
  useEffect(() => {
    router.prefetch('/dashboard/farmer');
    router.prefetch('/dashboard/exporter');
  }, [router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      // 1. Create the Auth User with Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData?.user) {
        // 2. Profile Injection (Matches ምርት tech database schema)
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ 
            id: authData.user.id, 
            role: role,
            email: email 
          }]);

        if (profileError) throw profileError;

        // 3. Automated Routing to designated dashboard
        const redirectTo = role === 'farmer' ? '/dashboard/farmer' : '/dashboard/exporter';
        router.replace(redirectTo);
      }
    } catch (error: any) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8 selection:bg-teal-100">
      {/* Structural Accent */}
      <div className="fixed top-0 left-0 w-full h-2 bg-slate-900"></div>

      <div className="w-full max-w-xl">
        <div className="mb-12 text-center">
          <Link href="/" className="text-5xl font-black text-slate-900 uppercase tracking-tighter italic">
            ምርት <span className="text-teal-600">tech</span>
          </Link>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-4">New Account Registration</p>
        </div>

        <form onSubmit={handleSignup} className="bg-white p-0 w-full">
          <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Select Your Role</h2>
          <p className="text-slate-400 text-sm mb-10 font-medium italic">Define your position in the agricultural value chain.</p>

          {errorMessage && (
            <div className="mb-8 p-5 bg-red-50 text-red-600 text-[10px] font-black rounded-2xl border border-red-100 uppercase tracking-widest animate-pulse">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Role Selector Cards: High-Contrast Design */}
          <div className="grid grid-cols-2 gap-6 mb-12">
            <button
              type="button"
              onClick={() => setRole('farmer')}
              className={`p-8 rounded-[2.5rem] border-2 transition-all duration-500 text-left ${
                role === 'farmer' 
                ? 'border-teal-500 bg-teal-50/20 ring-8 ring-teal-500/5' 
                : 'border-slate-50 bg-slate-50 hover:border-slate-200'
              }`}
            >
              <span className="text-3xl mb-4 block">🌿</span>
              <p className={`font-black text-xs uppercase tracking-widest ${role === 'farmer' ? 'text-teal-700' : 'text-slate-400'}`}>Farmer</p>
              <p className="text-[9px] font-bold text-slate-500 mt-2 leading-relaxed uppercase opacity-60">Inventory & Harvest Management</p>
            </button>

            <button
              type="button"
              onClick={() => setRole('exporter')}
              className={`p-8 rounded-[2.5rem] border-2 transition-all duration-500 text-left ${
                role === 'exporter' 
                ? 'border-teal-500 bg-teal-50/20 ring-8 ring-teal-500/5' 
                : 'border-slate-100 bg-slate-50 hover:border-slate-200'
              }`}
            >
              <span className="text-3xl mb-4 block">🚢</span>
              <p className={`font-black text-xs uppercase tracking-widest ${role === 'exporter' ? 'text-teal-700' : 'text-slate-400'}`}>Exporter</p>
              <p className="text-[9px] font-bold text-slate-500 mt-2 leading-relaxed uppercase opacity-60">Logistics & Purchase Requests</p>
            </button>
          </div>

          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="group">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1 group-focus-within:text-teal-600 transition-colors">Work Email</label>
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  className="w-full p-5 bg-slate-50 border-none rounded-3xl font-black text-slate-900 focus:ring-2 focus:ring-teal-500 outline-none transition-all duration-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="group">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1 group-focus-within:text-teal-600 transition-colors">Access Key</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full p-5 bg-slate-50 border-none rounded-3xl font-black text-slate-900 focus:ring-2 focus:ring-teal-500 outline-none transition-all duration-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <button 
            disabled={loading}
            className={`w-full mt-14 p-6 rounded-[2rem] font-black text-xs tracking-[0.3em] uppercase transition-all duration-700 shadow-2xl ${
              loading 
                ? "bg-slate-200 text-slate-400 cursor-wait shadow-none" 
                : "bg-slate-900 text-white hover:bg-teal-600 shadow-slate-200 active:scale-[0.96]"
            }`}
          >
            {loading ? "Inscribing Data..." : "Finalize Registration →"}
          </button>

          <p className="mt-12 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
            Already verified? {' '}
            <Link href="/auth/login" className="text-teal-600 hover:text-slate-900 transition-colors ml-2 underline decoration-teal-100 underline-offset-4">Return to Login</Link>
          </p>
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

export default function AuthSignupPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-6 w-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <AuthSignupPageContent />
    </Suspense>
  );
}