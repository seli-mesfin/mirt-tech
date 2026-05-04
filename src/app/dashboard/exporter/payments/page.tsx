"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { fetchPaymentsByPayer } from "@/lib/data/dashboard";
import { supabase } from "@/lib/supabase/client";
import { getErrorMessage } from "@/lib/utils";

type PaymentRowUI = {
  deal: string;
  gross: number;
  payout: number;
  status: string;
  created: string;
};

export default function ExporterPaymentsPage() {
  const [rows, setRows] = useState<PaymentRowUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!supabase) throw new Error("Supabase client not configured.");
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error("No active session");
        console.log("[Exporter Payments] userId=", userData.user.id);
        const payments = await fetchPaymentsByPayer(userData.user.id);
        console.log("[Exporter Payments] loaded payments", payments.length);
        setRows(
          payments.map((payment) => ({
            deal: payment.deal_id.slice(0, 8),
            gross: Number(payment.gross_amount),
            payout: Number(payment.payout_amount),
            status: payment.status,
            created: new Date(payment.created_at).toLocaleDateString(),
          })),
        );
      } catch (err) {
        setError(getErrorMessage(err, "Unable to load data. Please try again."));
      } finally {
        setLoading(false);
      }
    };
    void loadData();
  }, []);

  const totals = useMemo(
    () => ({
      gross: rows.reduce((sum, row) => sum + row.gross, 0),
      payout: rows.reduce((sum, row) => sum + row.payout, 0),
    }),
    [rows],
  );

  return (
    <DashboardShell role="exporter" title="Exporter • Payments">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Card title="Gross Payments Total">
            <p className="text-3xl font-bold text-teal-700">{totals.gross.toLocaleString()}</p>
          </Card>
          <Card title="Payout Total">
            <p className="text-3xl font-bold text-teal-700">{totals.payout.toLocaleString()}</p>
          </Card>
        </div>
        <Card title="Payments List">
          {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
          {loading ? (
            <p className="text-sm text-slate-600">Loading...</p>
          ) : (
            <Table
              rows={rows}
              emptyMessage="No records found"
              columns={[
                { key: "deal", label: "Deal" },
                { key: "gross", label: "Gross", render: (value) => Number(value).toLocaleString() },
                { key: "payout", label: "Payout", render: (value) => Number(value).toLocaleString() },
                { key: "status", label: "Status", render: (value) => <Badge>{String(value)}</Badge> },
                { key: "created", label: "Created" },
              ]}
            />
          )}
        </Card>
      </div>
    </DashboardShell>
  );
}
