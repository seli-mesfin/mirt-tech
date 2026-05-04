"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { fetchAllDeals } from "@/lib/data/dashboard";
import { getErrorMessage } from "@/lib/utils";

type DealRowUI = {
  crop: string;
  farmer: string;
  exporter: string;
  amount: string;
  status: string;
};

export default function AdminDealsPage() {
  const [rows, setRows] = useState<DealRowUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const deals = await fetchAllDeals();
        setRows(
          deals.map((deal) => ({
            crop: deal.crop_type,
            farmer: deal.farmer_user_id.slice(0, 8),
            exporter: deal.exporter_user_id.slice(0, 8),
            amount: Number(deal.estimated_value).toLocaleString(),
            status: deal.status,
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

  return (
    <DashboardShell role="admin" title="Admin • Deals">
      <Card title="All Deals">
        {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
        {loading ? (
          <p className="text-sm text-slate-600">Loading...</p>
        ) : (
          <Table
            rows={rows}
            emptyMessage="No records found"
            columns={[
              { key: "crop", label: "Crop" },
              { key: "farmer", label: "Farmer" },
              { key: "exporter", label: "Exporter" },
              { key: "amount", label: "Amount" },
              { key: "status", label: "Status", render: (value) => <Badge>{String(value)}</Badge> },
            ]}
          />
        )}
      </Card>
    </DashboardShell>
  );
}
