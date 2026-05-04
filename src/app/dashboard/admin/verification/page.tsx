"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { fetchAllFarmers } from "@/lib/data/dashboard";
import { supabase } from "@/lib/supabase/client";
import { getErrorMessage } from "@/lib/utils";
import type { FarmerRow } from "@/lib/auth/types";

type VerificationRow = { id: string; name: string; location: string; status: string; actions?: string };

export default function AdminVerificationPage() {
  const [farmers, setFarmers] = useState<FarmerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAllFarmers();
        setFarmers(data);
      } catch (err) {
        setError(getErrorMessage(err, "Unable to load data. Please try again."));
      } finally {
        setLoading(false);
      }
    };
    void loadData();
  }, []);

  const updateStatus = async (id: string, status: FarmerRow["status"]) => {
    try {
      const { error } = await supabase
        .from("farmers")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
      setFarmers(farmers.map(f => f.id === id ? { ...f, status } : f));
    } catch (err) {
      setError(getErrorMessage(err, "Unable to update status."));
    }
  };

  const rows: VerificationRow[] = farmers.map((row) => ({
    id: row.id,
    name: row.fullName,
    location: row.location,
    status: row.status,
    actions: "",
  }));

  return (
    <DashboardShell role="admin" title="Admin • Verification">
      <Card title="Verification Queue">
        {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
        {loading ? (
          <p className="text-sm text-slate-600">Loading...</p>
        ) : (
          <Table
            rows={rows}
            emptyMessage="No records found"
            columns={[
              { key: "name", label: "Farmer" },
              { key: "location", label: "Location" },
              {
                key: "status",
                label: "Status",
                render: (value) => <Badge variant={String(value) === "Verified" ? "success" : String(value) === "Rejected" ? "danger" : "warning"}>{String(value)}</Badge>,
              },
              {
                key: "actions",
                label: "Actions",
                render: (value, row) => (
                  <div className="flex gap-2">
                    {row.status === "Pending" && (
                      <>
                        <Button className="rounded-full px-3 py-2 text-sm" onClick={() => updateStatus(row.id, "Verified")}>Approve</Button>
                        <Button className="rounded-full bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700" onClick={() => updateStatus(row.id, "Rejected")}>Reject</Button>
                      </>
                    )}
                  </div>
                ),
              },
            ]}
          />
        )}
      </Card>
    </DashboardShell>
  );
}
