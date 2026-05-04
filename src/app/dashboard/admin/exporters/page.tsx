"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { fetchProfiles } from "@/lib/data/dashboard";
import { getErrorMessage } from "@/lib/utils";

type ExporterRow = { name: string };

export default function AdminExportersPage() {
  const [rows, setRows] = useState<ExporterRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const profiles = await fetchProfiles();
        const exporters = profiles.filter((profile) => profile.role === "exporter");
        setRows(exporters.map((profile) => ({ name: profile.full_name ?? "Unnamed exporter" })));
      } catch (err) {
        setError(getErrorMessage(err, "Unable to load data. Please try again."));
      } finally {
        setLoading(false);
      }
    };
    void loadData();
  }, []);

  return (
    <DashboardShell role="admin" title="Admin • Exporters">
      <Card title="All Exporters">
        {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
        {loading ? (
          <p className="text-sm text-slate-600">Loading...</p>
        ) : (
          <Table rows={rows} emptyMessage="No records found" columns={[{ key: "name", label: "Name" }]} />
        )}
      </Card>
    </DashboardShell>
  );
}
