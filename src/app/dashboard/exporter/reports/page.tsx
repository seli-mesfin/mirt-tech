"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Card } from "@/components/ui/Card";
import { fetchDealsForExporter, fetchPaymentsByPayer } from "@/lib/data/dashboard";
import { supabase } from "@/lib/supabase/client";
import { getErrorMessage } from "@/lib/utils";

export default function ExporterReportsPage() {
  const [dealCount, setDealCount] = useState(0);
  const [paymentTotal, setPaymentTotal] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!supabase) throw new Error("Supabase client not configured.");
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error("No active session");
        console.log("[Exporter Reports] userId=", userData.user.id);
        const [deals, payments] = await Promise.all([
          fetchDealsForExporter(userData.user.id),
          fetchPaymentsByPayer(userData.user.id),
        ]);
        console.log("[Exporter Reports] loaded deals", deals.length, "payments", payments.length);
        setDealCount(deals.length);
        setPaymentTotal(payments.reduce((sum, payment) => sum + Number(payment.gross_amount), 0));
        setActiveUsers(new Set([userData.user.id, ...deals.map((deal) => deal.farmer_user_id)]).size);
      } catch (err) {
        setError(getErrorMessage(err, "Unable to load data. Please try again."));
      } finally {
        setLoading(false);
      }
    };
    void loadData();
  }, []);

  return (
    <DashboardShell role="exporter" title="Exporter • Reports">
      {error ? <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
      {loading ? (
        <p className="text-sm text-slate-600">Loading...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <Card title="Deals Distribution">
            <p className="text-3xl font-bold text-teal-700">{dealCount}</p>
            <div className="mt-3 h-3 rounded-full bg-slate-200">
              <div className="h-3 rounded-full bg-teal-700" style={{ width: `${Math.min(100, dealCount * 10)}%` }} />
            </div>
          </Card>
          <Card title="Payments Distribution">
            <p className="text-3xl font-bold text-teal-700">{paymentTotal.toLocaleString()}</p>
            <div className="mt-3 h-3 rounded-full bg-slate-200">
              <div className="h-3 rounded-full bg-blue-700" style={{ width: `${paymentTotal > 0 ? 80 : 0}%` }} />
            </div>
          </Card>
          <Card title="Active Users">
            <p className="text-3xl font-bold text-teal-700">{activeUsers}</p>
            <div className="mt-3 h-3 rounded-full bg-slate-200">
              <div className="h-3 rounded-full bg-indigo-700" style={{ width: `${Math.min(100, activeUsers * 20)}%` }} />
            </div>
          </Card>
        </div>
      )}
    </DashboardShell>
  );
}
