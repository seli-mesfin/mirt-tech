"use client";

import { useState } from 'react';
import { supabase } from "@/lib/supabase/client";
import { useAuth } from '@/lib/auth/AuthProvider';
import Link from 'next/link';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    crop_type: 'sesame',
    quantity: '',
    location: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // DEMO LOGIC: If no user, we simulate a successful guest post for the UI demo
    if (!user) {
      setLoading(true);
      setTimeout(() => {
        alert("DEMO MODE: If you were logged in, this yield would now be live in the Exporter Market!");
        setLoading(false);
        setFormData({ ...formData, quantity: '', location: '' });
      }, 800);
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from('farmer_posts')
      .insert([{ 
          farmer_id: user.id, 
          crop_type: formData.crop_type, 
          quantity: parseFloat(formData.quantity),
          location: formData.location,
          status: 'available'
      }]);

    setLoading(false);
    if (error) alert(error.message);
    else {
      alert("Success! Your harvest has been logged in the global ledger.");
      setFormData({ ...formData, quantity: '', location: '' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex selection:bg-teal-100">
      {/* Sidebar - XTRA Style */}
      <aside className="w-72 bg-slate-900 text-white p-10 hidden lg:flex flex-col">
        <div className="text-2xl font-black tracking-tighter mb-16 italic">
          ምርት <span className="text-teal-400">FARMER</span>
        </div>
        
        <nav className="space-y-8 flex-1">
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Management</p>
            <div className="space-y-4">
              <button className="flex items-center gap-4 text-teal-400 font-black text-sm tracking-tight">
                <span className="h-8 w-8 rounded-lg bg-teal-400/10 flex items-center justify-center text-lg">⊕</span> 
                New Market Post
              </button>
              <button className="flex items-center gap-4 text-slate-400 hover:text-white transition-all font-black text-sm tracking-tight">
                <span className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-lg">☷</span> 
                Yield Inventory
              </button>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Communications</p>
            <button className="flex items-center gap-4 text-slate-400 hover:text-white transition-all font-black text-sm tracking-tight">
              <span className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-lg">✉</span> 
              Trade Requests
            </button>
          </div>
        </nav>

        <div className="mt-auto pt-10 border-t border-slate-800">
           <div className="flex items-center gap-3">
             <span className="h-2 w-2 bg-green-500 rounded-full animate-ping"></span>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Market Core Active</span>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-16 overflow-y-auto">
        <header className="flex justify-between items-end mb-16">
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-2">Publish Yield.</h1>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Gondar Agricultural District • Portal v3.0</p>
          </div>
          
          <div className="flex items-center gap-5 bg-white p-3 pr-6 rounded-full shadow-sm border border-slate-100">
            <div className="h-10 w-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-black text-xs">
              {user ? user.email?.[0].toUpperCase() : "G"}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity</p>
              <p className="text-xs font-black text-slate-900">{user ? user.email : "Guest Producer"}</p>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Post Form */}
          <div className="lg:col-span-8">
            <div className="bg-white p-12 rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.04)] border border-slate-100">
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid md:grid-cols-2 gap-10">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Crop Variety</label>
                    <select 
                      className="w-full p-5 bg-slate-50 border-none rounded-2xl font-black text-slate-700 focus:ring-2 focus:ring-teal-500 transition-all outline-none appearance-none"
                      value={formData.crop_type}
                      onChange={(e) => setFormData({...formData, crop_type: e.target.value})}
                    >
                      <option value="sesame">Sesame (ሰሊጥ)</option>
                      <option value="soya_bean">Soya Bean (አኩሪ አተር)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Volume (Quintals)</label>
                    <input 
                      type="number" 
                      placeholder="0.00" 
                      className="w-full p-5 bg-slate-50 border-none rounded-2xl font-black text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Collection Point / Location</label>
                  <input 
                    type="text" 
                    placeholder="e.g. West Gondar Storage" 
                    className="w-full p-5 bg-slate-50 border-none rounded-2xl font-black text-slate-900 placeholder:text-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    required
                  />
                </div>

                <button className="w-full bg-slate-900 text-white p-6 rounded-3xl font-black text-sm tracking-[0.3em] uppercase shadow-2xl shadow-slate-200 hover:bg-teal-600 active:scale-[0.97] transition-all duration-500">
                  {loading ? "COMMITTING DATA..." : "Confirm Market Listing →"}
                </button>
              </form>
            </div>
          </div>

          {/* Market Insights Side */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-teal-600 p-10 rounded-[3rem] text-white shadow-2xl shadow-teal-100 relative overflow-hidden group">
               <div className="relative z-10">
                 <h4 className="text-[10px] font-black text-teal-200 uppercase tracking-[0.3em] mb-6">Price Index</h4>
                 <div className="space-y-6">
                   <div className="flex justify-between border-b border-white/10 pb-4">
                     <span className="text-xs font-bold opacity-80">High-Grade Sesame</span>
                     <span className="font-black">$118/Q</span>
                   </div>
                   <div className="flex justify-between border-b border-white/10 pb-4">
                     <span className="text-xs font-bold opacity-80">Standard Soya</span>
                     <span className="font-black">$94/Q</span>
                   </div>
                 </div>
               </div>
               <div className="absolute -bottom-6 -right-6 text-9xl opacity-10 group-hover:rotate-12 transition-transform duration-700">📉</div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Export Status</h4>
               <p className="text-xs font-bold text-slate-600 leading-relaxed">
                 Demand for Humera Sesame is currently <span className="text-teal-600">High</span>. Listings usually receive trade requests within 4 hours.
               </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}