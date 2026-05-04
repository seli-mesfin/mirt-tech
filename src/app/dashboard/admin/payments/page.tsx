"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { fetchAllPayments } from "@/lib/data/dashboard";
import { getErrorMessage } from "@/lib/utils";

type PaymentRowUI = {
  deal: string;
  gross: number;
  payout: number;
  status: string;
};

export default function AdminPaymentsPage() {
  const [rows, setRows] = useState<PaymentRowUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const payments = await fetchAllPayments();
        setRows(
          payments.map((payment) => ({
            deal: payment.deal_id.slice(0, 8),
            gross: Number(payment.gross_amount),
            payout: Number(payment.payout_amount),
            status: payment.status,
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

  const totalGross = useMemo(() => rows.reduce((sum, row) => sum + row.gross, 0), [rows]);

  return (
    <DashboardShell role="admin" title="Admin • Payments">
      <div className="space-y-6">
        <Card title="Total Payments">
          <p className="text-3xl font-bold text-teal-700">{totalGross.toLocaleString()}</p>
        </Card>
        <Card title="All Payments">
          {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
          {loading ? (
            <p className="text-sm text-slate-600">Loading...</p>
          ) : (
            <Table
              rows={rows}
              emptyMessage="No records found"
              columns={[
                { key: "deal", label: "Deal" },
                { key: "gross", label: "Gross Amount", render: (value) => Number(value).toLocaleString() },
                { key: "payout", label: "Payout", render: (value) => Number(value).toLocaleString() },
                { key: "status", label: "Status", render: (value) => <Badge>{String(value)}</Badge> },
              ]}
            />
          )}
        </Card>
      </div>
    </DashboardShell>
  );
}
