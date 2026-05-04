"use client";

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Premium Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-black text-teal-800 tracking-tighter uppercase italic">
            ምርት <span className="text-slate-900">tech</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-8 text-[10px] font-black tracking-[0.2em] text-slate-400">
              <a href="#features" className="hover:text-teal-600 transition-colors">SYSTEM</a>
              <a href="#market" className="hover:text-teal-600 transition-colors">LIVE DATA</a>
            </div>
            
            <div className="h-6 w-px bg-slate-200 hidden md:block mx-2"></div>
            
            {/* DIRECT ACCESS BUTTONS: No more Auth checks */}
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard/farmer" 
                className="text-[10px] font-black bg-slate-100 text-slate-600 px-6 py-3 rounded-full hover:bg-slate-200 transition-all tracking-widest uppercase"
              >
                Farmer Portal
              </Link>
              <Link 
                href="/dashboard/exporter" 
                className="text-[10px] font-black bg-slate-900 text-white px-6 py-3 rounded-full hover:bg-teal-600 transition-all shadow-xl shadow-slate-200 tracking-widest uppercase"
              >
                Marketplace
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section: XTRA Style */}
      <header className="relative pt-24 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative z-10">
            <span className="inline-block px-4 py-1.5 bg-teal-50 text-teal-700 text-[10px] font-black rounded-full mb-8 tracking-[0.3em] uppercase">
              Bahir Dar University • IS Project
            </span>
            <h1 className="text-7xl md:text-8xl font-black leading-[0.9] mb-8 text-slate-900 tracking-tight">
              Direct Access <br />
              to <span className="text-teal-600">Premium</span> <br />
              Harvest.
            </h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed mb-12 max-w-lg">
              The primary digital ledger for Ethiopia's Sesame and Soya supply chain. 
              Connecting Gondar's fields to global trade hubs with zero friction.
            </p>

            {/* Interactive Role Selectors */}
            <div className="flex flex-col sm:flex-row gap-5">
              <Link 
                href="/dashboard/farmer" 
                className="group relative flex-1 bg-slate-900 text-white p-8 rounded-[2.5rem] overflow-hidden hover:-translate-y-2 transition-all duration-500 shadow-2xl shadow-slate-200"
              >
                <div className="relative z-10">
                  <span className="text-[10px] font-black opacity-40 uppercase mb-3 block tracking-[0.2em]">Producer Entry</span>
                  <p className="text-2xl font-black italic">I am a Farmer →</p>
                </div>
                <div className="absolute -bottom-4 -right-4 text-8xl opacity-10 group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-700">🌱</div>
              </Link>

              <Link 
                href="/dashboard/exporter" 
                className="group relative flex-1 bg-teal-600 text-white p-8 rounded-[2.5rem] overflow-hidden hover:-translate-y-2 transition-all duration-500 shadow-2xl shadow-teal-100"
              >
                <div className="relative z-10">
                  <span className="text-[10px] font-black opacity-40 uppercase mb-3 block tracking-[0.2em]">Trade Entry</span>
                  <p className="text-2xl font-black italic">I am an Exporter →</p>
                </div>
                <div className="absolute -bottom-4 -right-4 text-8xl opacity-10 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-700">🚢</div>
              </Link>
            </div>
          </div>

          {/* Decorative Live Widget Side */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-teal-500/10 blur-[120px] rounded-full"></div>
            <div className="relative bg-white border border-slate-100 p-10 rounded-[3.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)]">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h3 className="font-black text-2xl text-slate-900 tracking-tighter">Market Watch</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Gondar Region Live</p>
                </div>
                <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-ping"></span>
                  <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Active</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  { label: "Humera Sesame", price: "115.40", trend: "+2.4%" },
                  { label: "Gondar Soya", price: "98.20", trend: "-0.8%" },
                  { label: "Metema Sesame", price: "112.10", trend: "+1.2%" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl border border-transparent hover:border-teal-100 hover:bg-white transition-all cursor-default">
                    <span className="font-bold text-sm text-slate-700">{item.label}</span>
                    <div className="text-right">
                      <p className="font-black text-slate-900">${item.price}</p>
                      <p className={`text-[10px] font-black ${item.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{item.trend}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-10 pt-8 border-t border-slate-100 flex justify-center">
                 <Link href="/dashboard/exporter" className="text-[10px] font-black text-teal-600 hover:text-slate-900 uppercase tracking-[0.3em] transition-colors">
                    View Full Marketplace ↗
                 </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Modern Footer */}
      <footer className="border-t border-slate-100 py-16 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-xl font-black text-slate-300 tracking-tighter uppercase italic">
            ምርት <span className="text-slate-200">tech</span>
          </div>
          <p className="text-slate-400 text-[10px] font-black tracking-[0.4em] uppercase">
            © 2026 SELAMAWIT MESFIN • BDU IS PROJECT
          </p>
        </div>
      </footer>
    </div>
  );
}