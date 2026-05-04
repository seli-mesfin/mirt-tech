"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { 
  fetchAllProducts, 
  fetchDealsForExporter, 
  createDeal 
} from "@/lib/data/dashboard";
import type { ProductRow, DealRow } from "@/lib/auth/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type Tab = "market" | "my-deals" | "ledger";

export default function ExporterDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("market");
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [deals, setDeals] = useState<DealRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          console.error("Auth Error:", authError);
          setLoading(false);
          return;
        }

        console.log("Logged in User ID:", user.id);

        // Fetching data
        const [marketData, myDeals] = await Promise.all([
          fetchAllProducts(),
          fetchDealsForExporter(user.id)
        ]);

        console.log("Market Data Received:", marketData);
        console.log("Deals Data Received:", myDeals);

        setProducts(marketData || []);
        setDeals(myDeals || []);
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const handleSourcing = async (product: ProductRow) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await createDeal({
        farmer_user_id: product.farmer_user_id,
        exporter_user_id: user.id,
        crop_type: product.crop_type,
        price_per_unit: product.price_per_unit || 4500,
        estimated_quantity: product.quantity,
        estimated_value: product.quantity * (product.price_per_unit || 4500),
        status: "Active"
      });

      alert(`Sourcing for ${product.crop_type} initiated!`);
      
      const updatedDeals = await fetchDealsForExporter(user.id);
      setDeals(updatedDeals);
    } catch (err) {
      console.error("Sourcing Error:", err);
      alert("Failed to initiate sourcing.");
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-slate-900 flex flex-col border-r border-slate-800">
        <div className="p-8">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">
            ምርት <span className="text-teal-500 text-xl">tech</span>
          </h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <SidebarButton 
            label="Marketplace" 
            active={activeTab === "market"} 
            onClick={() => setActiveTab("market")} 
          />
          <SidebarButton 
            label="Active Deals" 
            active={activeTab === "my-deals"} 
            onClick={() => setActiveTab("my-deals")} 
          />
          <SidebarButton 
            label="Financial Ledger" 
            active={activeTab === "ledger"} 
            onClick={() => setActiveTab("ledger")} 
          />
        </nav>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-100 px-12 py-8">
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic">
            {activeTab === "market" ? "Global Market" : activeTab === "my-deals" ? "Contracts" : "Ledger"}
          </h1>
        </header>

        <div className="flex-1 overflow-y-auto p-12">
          {loading ? (
            <p className="text-teal-600 font-black animate-pulse uppercase text-center py-20">Syncing Registry...</p>
          ) : (
            <div className="max-w-5xl mx-auto space-y-4">
              {/* Marketplace View */}
              {activeTab === "market" && products.length > 0 && products.map((p) => (
                <Card key={p.id} className="p-6 bg-white border-none shadow-sm rounded-3xl flex justify-between items-center transition-all hover:shadow-md">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase">{p.crop_type}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                      {p.quantity} QNTL • {p.location || "Location N/A"}
                    </p>
                  </div>
                  <Button 
                    onClick={() => handleSourcing(p)}
                    className="bg-slate-900 text-white hover:bg-teal-600 px-8 py-4 rounded-2xl font-black uppercase text-[10px]"
                  >
                    Initiate Sourcing →
                  </Button>
                </Card>
              ))}

              {/* Deals View */}
              {activeTab === "my-deals" && deals.length > 0 && deals.map((d) => (
                <Card key={d.id} className="p-6 bg-white border-none shadow-sm rounded-3xl">
                   <p className="font-black text-slate-800 uppercase italic">{d.crop_type} Contract</p>
                   <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Status: {d.status}</p>
                </Card>
              ))}

              {/* Empty State: Only shows if NOT loading and array is actually empty */}
              {((activeTab === "market" && products.length === 0) || 
                (activeTab === "my-deals" && deals.length === 0)) && (
                <div className="py-20 text-center">
                  <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em]">
                    No records found in the registry.
                  </p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 text-teal-600 font-bold text-[10px] uppercase underline"
                  >
                    Refresh Sync
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function SidebarButton({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
        active ? "bg-teal-600 text-white shadow-lg" : "text-slate-500 hover:bg-slate-800 hover:text-slate-200"
      }`}
    >
      {label}
    </button>
  );
}