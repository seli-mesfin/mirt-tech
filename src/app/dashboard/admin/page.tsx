"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { fetchAllDeals, fetchAllFarmers, fetchProfiles } from "@/lib/data/dashboard";
import { getErrorMessage } from "@/lib/utils";

type Summary = {
  totalUsers: number;
  totalFarmers: number;
  totalExporters: number;
  totalDeals: number;
};

type RecentUser = {
  name: string;
  role: string;
};

type RecentActivity = {
  action: string;
  entity: string;
  date: string;
};

export default function DashboardAdminPage() {
  const [summary, setSummary] = useState<Summary>({ totalUsers: 0, totalFarmers: 0, totalExporters: 0, totalDeals: 0 });
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [profiles, farmers, deals] = await Promise.all([fetchProfiles(), fetchAllFarmers(), fetchAllDeals()]);

        setSummary({
          totalUsers: profiles.length,
          totalFarmers: farmers.length,
          totalExporters: profiles.filter((profile) => profile.role === "exporter").length,
          totalDeals: deals.length,
        });

        setRecentUsers(
          profiles.slice(0, 5).map((profile) => ({
            name: profile.full_name ?? "Unnamed user",
            role: profile.role,
          })),
        );

        setRecentActivity([
          { action: "Profiles synced", entity: `${profiles.length} users`, date: "Now" },
          { action: "Farmers synced", entity: `${farmers.length} records`, date: "Now" },
          { action: "Deals synced", entity: `${deals.length} records`, date: "Now" },
        ]);
      } catch (err) {
        setError(getErrorMessage(err, "Unable to load data. Please try again."));
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, []);

  return (
    <DashboardShell role="admin" title="Admin Dashboard">
      {error ? <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
      {loading ? (
        <p className="text-sm text-slate-600">Loading...</p>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card title="Total Users">
              <p className="text-3xl font-bold text-teal-700">{summary.totalUsers}</p>
            </Card>
            <Card title="Total Farmers">
              <p className="text-3xl font-bold text-teal-700">{summary.totalFarmers}</p>
            </Card>
            <Card title="Total Exporters">
              <p className="text-3xl font-bold text-teal-700">{summary.totalExporters}</p>
            </Card>
            <Card title="Total Deals">
              <p className="text-3xl font-bold text-teal-700">{summary.totalDeals}</p>
            </Card>
          </div>
          <Card title="Recent Users">
            <Table
              rows={recentUsers}
              emptyMessage="No records found"
              columns={[
                { key: "name", label: "Name" },
                { key: "role", label: "Role", render: (value) => <Badge>{String(value)}</Badge> },
              ]}
            />
          </Card>
          <Card title="Recent Activity">
            <Table
              rows={recentActivity}
              emptyMessage="No records found"
              columns={[
                { key: "action", label: "Action" },
                { key: "entity", label: "Entity" },
                { key: "date", label: "Date" },
              ]}
            />
          </Card>
        </div>
      )}
    </DashboardShell>
  );
}
