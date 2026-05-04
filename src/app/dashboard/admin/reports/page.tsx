"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Card } from "@/components/ui/Card";
import { fetchAllDeals, fetchAllPayments, fetchProfiles } from "@/lib/data/dashboard";
import { getErrorMessage } from "@/lib/utils";

export default function AdminReportsPage() {
  const [dealsCount, setDealsCount] = useState(0);
  const [paymentsTotal, setPaymentsTotal] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [deals, payments, profiles] = await Promise.all([fetchAllDeals(), fetchAllPayments(), fetchProfiles()]);
        console.log("[Admin Reports] loaded deals", deals.length, "payments", payments.length, "profiles", profiles.length);
        setDealsCount(deals.length);
        setPaymentsTotal(payments.reduce((sum, payment) => sum + Number(payment.gross_amount), 0));
        setActiveUsers(profiles.length);
      } catch (err) {
        setError(getErrorMessage(err, "Unable to load data. Please try again."));
      } finally {
        setLoading(false);
      }
    };
    void loadData();
  }, []);

  return (
    <DashboardShell role="admin" title="Admin • Reports">
      {error ? <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
      {loading ? (
        <p className="text-sm text-slate-600">Loading...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <Card title="Deals Volume">
            <div className="space-y-2">
              <p className="text-3xl font-bold text-teal-700">{dealsCount}</p>
              <div className="h-3 rounded-full bg-slate-200">
                <div className="h-3 rounded-full bg-teal-700" style={{ width: `${Math.min(100, dealsCount * 8)}%` }} />
              </div>
            </div>
          </Card>
          <Card title="Payments Volume">
            <div className="space-y-2">
              <p className="text-3xl font-bold text-teal-700">{paymentsTotal.toLocaleString()}</p>
              <div className="h-3 rounded-full bg-slate-200">
                <div className="h-3 rounded-full bg-blue-700" style={{ width: `${Math.min(100, paymentsTotal > 0 ? 80 : 0)}%` }} />
              </div>
            </div>
          </Card>
          <Card title="Active Users">
            <div className="space-y-2">
              <p className="text-3xl font-bold text-teal-700">{activeUsers}</p>
              <div className="h-3 rounded-full bg-slate-200">
                <div className="h-3 rounded-full bg-indigo-700" style={{ width: `${Math.min(100, activeUsers * 10)}%` }} />
              </div>
            </div>
          </Card>
        </div>
      )}
    </DashboardShell>
  );
}
