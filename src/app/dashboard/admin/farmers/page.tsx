"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { fetchAllFarmers } from "@/lib/data/dashboard";
import { getErrorMessage } from "@/lib/utils";

type FarmerRowUI = { name: string; phone: string; location: string; status: string };

export default function AdminFarmersPage() {
  const [rows, setRows] = useState<FarmerRowUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const farmers = await fetchAllFarmers();
        setRows(farmers.map((row) => ({ name: row.fullName, phone: row.phone, location: row.location, status: row.status })));
      } catch (err) {
        setError(getErrorMessage(err, "Unable to load data. Please try again."));
      } finally {
        setLoading(false);
      }
    };
    void loadData();
  }, []);

  return (
    <DashboardShell role="admin" title="Admin • Farmers">
      <Card title="All Farmers">
        {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
        {loading ? (
          <p className="text-sm text-slate-600">Loading...</p>
        ) : (
          <Table
            rows={rows}
            emptyMessage="No records found"
            columns={[
              { key: "name", label: "Name" },
              { key: "phone", label: "Phone" },
              { key: "location", label: "Location" },
              {
                key: "status",
                label: "Status",
                render: (value) => <Badge variant={String(value) === "Verified" ? "success" : String(value) === "Rejected" ? "danger" : "warning"}>{String(value)}</Badge>,
              },
            ]}
          />
        )}
      </Card>
    </DashboardShell>
  );
}
