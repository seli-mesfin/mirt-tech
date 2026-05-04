"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

// Reusable Button Component to prevent import errors
const Button = ({ children, className, variant = "primary", ...props }: any) => {
  const base = "px-6 py-4 rounded-2xl font-bold transition-all active:scale-95 text-sm flex items-center justify-center gap-2";
  const styles: any = {
    primary: "bg-teal-700 text-white hover:bg-teal-800 shadow-xl shadow-teal-100",
    outline: "border border-slate-200 text-slate-600 hover:bg-slate-50",
  };
  return <button {...props} className={`${base} ${styles[variant]} ${className}`}>{children}</button>;
};

export default function FarmerPortal() {
  const router = useRouter();
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function checkUserAndFetch() {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push("/auth/login");
          return;
        }

        setUser(session.user);

        // Fetch offers sent specifically TO this farmer
        const { data, error } = await supabase
          .from('contracts')
          .select('*')
          .eq('farmer_id', session.user.id)
          .eq('status', 'pending')
          .order('created_at', { ascending: false });
        
        if (data) setOffers(data);
        if (error) console.error("Database error:", error.message);
      } catch (err) {
        console.error("System error:", err);
      } finally {
        setLoading(false);
      }
    }
    checkUserAndFetch();
  }, [router]);

  const handleDecision = async (id: string, status: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('contracts')
        .update({ status })
        .eq('id', id);

      if (!error) {
        setOffers(prev => prev.filter(o => o.id !== id));
        alert(`Contract ${status === 'accepted' ? 'Accepted' : 'Declined'} successfully.`);
      } else {
        alert("Action failed: " + error.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center italic text-slate-400 font-bold">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        Verifying Producer Credentials...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans p-6 md:p-12 text-slate-900">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-16">
          <div>
            <span className="text-teal-600 font-black uppercase tracking-[0.3em] text-[10px]">Agricultural Producer Portal</span>
            <h1 className="text-4xl font-black tracking-tight mt-1">Farmer <span className="text-teal-600">Portal</span></h1>
            <p className="text-slate-400 text-[10px] mt-2 font-bold uppercase tracking-wider">Account ID: {user?.id.slice(0, 12)}</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/")} className="rounded-full px-8">← Dashboard</Button>
        </header>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* POSTING FORM */}
          <div className="lg:col-span-7">
            <div className="bg-white p-10 md:p-14 rounded-[48px] shadow-2xl shadow-teal-900/5 border border-slate-100">
              <h2 className="text-2xl font-black text-slate-900 mb-8 text-center md:text-left">Publish Harvest Listing</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Crop Variety</label>
                  <select className="w-full p-5 bg-slate-50 rounded-[24px] border-none ring-1 ring-slate-100 outline-none font-bold text-slate-700">
                    <option>Humera Sesame (Grade A)</option>
                    <option>Gondar Soya Bean</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Quantity (Qtl)</label>
                    <input type="number" placeholder="0.00" className="w-full p-5 bg-slate-50 rounded-[24px] border-none ring-1 ring-slate-100 outline-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Price per Qtl (ETB)</label>
                    <input type="number" placeholder="0.00" className="w-full p-5 bg-slate-50 rounded-[24px] border-none ring-1 ring-slate-100 outline-none font-bold text-teal-700" />
                  </div>
                </div>
                <Button className="w-full py-7 rounded-[24px] text-lg shadow-teal-200/50">Broadcast to Exporters</Button>
              </div>
            </div>
          </div>

          {/* OFFERS SIDEBAR */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900 p-10 rounded-[48px] shadow-2xl min-h-[500px]">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-white font-black text-lg uppercase tracking-tight">Active Offers</h3>
                <span className="bg-emerald-500 text-slate-900 text-[10px] font-black px-3 py-1 rounded-full">{offers.length} New</span>
              </div>

              <div className="space-y-4">
                {offers.length === 0 ? (
                  <div className="text-center py-24 bg-white/5 rounded-[32px] border border-white/5">
                    <p className="text-slate-500 font-bold text-sm italic">Waiting for incoming requests...</p>
                  </div>
                ) : (
                  offers.map((offer) => (
                    <div key={offer.id} className="bg-white p-6 rounded-[32px] border border-slate-100">
                      <div className="mb-6">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Proposed Amount</p>
                        <p className="text-slate-900 font-black text-2xl tracking-tighter">{offer.total_amount_etb.toLocaleString()} ETB</p>
                        <p className="text-slate-500 text-xs font-bold mt-1">{offer.quantity_quintals} Quintals Requested</p>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => handleDecision(offer.id, 'accepted')} className="flex-1 bg-teal-700 hover:bg-teal-800 text-white py-4 rounded-2xl font-bold text-xs transition-all">Accept</button>
                        <button onClick={() => handleDecision(offer.id, 'rejected')} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-4 rounded-2xl font-bold text-xs transition-all">Decline</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}