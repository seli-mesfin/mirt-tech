"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

// Reusable Button Component to prevent import errors
const Button = ({ children, className, variant = "primary", ...props }: any) => {
  const base = "px-6 py-4 rounded-2xl font-bold transition-all active:scale-95 text-sm flex items-center justify-center gap-2";
  const styles: any = {
    primary: "bg-teal-600 text-white hover:bg-teal-700 shadow-xl shadow-teal-900/20",
    outline: "border border-white/20 text-white hover:bg-white/10 backdrop-blur-sm",
  };
  return <button {...props} className={`${base} ${styles[variant]} ${className}`}>{children}</button>;
};

export default function ExporterHub() {
  const router = useRouter();
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function checkUserAndFetch() {
      setLoading(true);
      try {
        // Check Session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push("/auth/login");
          return;
        }
        
        setUser(session.user);

        // Fetch Contracts for this specific exporter
        const { data, error } = await supabase
          .from('contracts')
          .select('*')
          .eq('exporter_id', session.user.id)
          .order('created_at', { ascending: false });
        
        if (data) setContracts(data);
        if (error) console.error("Database error:", error.message);
      } catch (err) {
        console.error("System error:", err);
      } finally {
        setLoading(false);
      }
    }
    checkUserAndFetch();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Securing Connection...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans p-6 md:p-12 text-slate-200">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
              <span className="text-teal-500 font-black uppercase tracking-[0.3em] text-[10px]">Verified Exporter Portal</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">Exporter <span className="text-teal-500">Hub</span></h1>
            <p className="text-slate-500 text-[10px] mt-2 font-bold uppercase tracking-wider">Account: {user?.email}</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/")} className="px-8">← Exit Portal</Button>
        </header>

        <div className="bg-white rounded-[48px] overflow-hidden shadow-2xl">
          <div className="p-8 md:p-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-10">My Negotiated Contracts</h2>
            
            <div className="space-y-6">
              {contracts.length === 0 ? (
                <div className="py-20 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                   <p className="text-slate-400 font-bold text-lg italic">No active negotiations found.</p>
                   <p className="text-slate-300 text-sm mt-2">Contracts will appear here once you initiate a request.</p>
                </div>
              ) : (
                contracts.map((deal) => (
                  <div key={deal.id} className="flex flex-col md:flex-row items-center justify-between p-8 bg-white rounded-[32px] border border-slate-100 hover:border-teal-500/30 transition-all">
                    <div className="mb-6 md:mb-0">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest text-center md:text-left">Batch {deal.id.slice(0, 8)}</p>
                      <p className="text-2xl font-black text-slate-900 leading-tight">
                        {deal.quantity_quintals} Quintals <span className="text-slate-400 font-medium">at</span> <span className="text-teal-600">{deal.total_amount_etb.toLocaleString()} ETB</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-8 border-t md:border-t-0 pt-6 md:pt-0 border-slate-50 w-full md:w-auto justify-between md:justify-end">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Status</p>
                        <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest
                          ${deal.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {deal.status}
                        </span>
                      </div>
                      {deal.status === 'accepted' && (
                        <Button className="bg-teal-600 h-14 px-10 shadow-emerald-900/10">Pay with Chapa</Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}