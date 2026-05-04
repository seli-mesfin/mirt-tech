"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { fetchProfiles } from "@/lib/data/dashboard";
import { getErrorMessage } from "@/lib/utils";

type UserRow = { name: string; role: string };

export default function AdminUsersPage() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const profiles = await fetchProfiles();
        setRows(profiles.map((profile) => ({ name: profile.full_name ?? "Unnamed user", role: profile.role })));
      } catch (err) {
        setError(getErrorMessage(err, "Unable to load data. Please try again."));
      } finally {
        setLoading(false);
      }
    };
    void loadData();
  }, []);

  return (
    <DashboardShell role="admin" title="Admin • Users">
      <Card title="All Users">
        {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
        {loading ? (
          <p className="text-sm text-slate-600">Loading...</p>
        ) : (
          <Table
            rows={rows}
            emptyMessage="No records found"
            columns={[
              { key: "name", label: "Name" },
              { key: "role", label: "Role", render: (value) => <Badge>{String(value)}</Badge> },
            ]}
          />
        )}
      </Card>
    </DashboardShell>
  );
}
