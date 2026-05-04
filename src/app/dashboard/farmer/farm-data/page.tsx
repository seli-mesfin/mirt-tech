"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Table } from "@/components/ui/Table";
import type { FarmerRow } from "@/lib/auth/types";
import { fetchFarmersByUser } from "@/lib/data/dashboard";
import { supabase } from "@/lib/supabase/client";
import { getErrorMessage } from "@/lib/utils";

type FarmerTableRow = {
  fullName: string;
  phone: string;
  location: string;
  status: string;
  created: string;
};

export default function FarmerDataPage() {
  const [farmers, setFarmers] = useState<FarmerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ fullName: "", phone: "", location: "" });

  const loadData = async () => {
    if (!supabase) throw new Error("Supabase client not configured.");
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("No active session");
    console.log("[Farmer Records] userId=", userData.user.id);
    const rows = await fetchFarmersByUser(userData.user.id);
    console.log("[Farmer Records] loaded rows", rows.length);
    setFarmers(rows);
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await loadData();
      } catch (err) {
        setError(getErrorMessage(err, "Unable to load data. Please try again."));
      } finally {
        setLoading(false);
      }
    };
    void bootstrap();
  }, []);

  const createFarmer = async () => {
    try {
      setSaving(true);
      setError(null);
      if (!supabase) throw new Error("Supabase client not configured.");
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("No active session");
      if (!form.fullName || !form.phone || !form.location) throw new Error("All fields are required.");
      const { error: insertError } = await supabase.from("farmers").insert({
        user_id: userData.user.id,
        full_name: form.fullName,
        phone: form.phone,
        location: form.location,
        status: "Pending",
      });
      if (insertError) throw insertError;
      await loadData();
      setForm({ fullName: "", phone: "", location: "" });
    } catch (err) {
      setError(getErrorMessage(err, "Unable to save data. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  const rows: FarmerTableRow[] = farmers.map((farmer) => ({
    fullName: farmer.fullName,
    phone: farmer.phone,
    location: farmer.location,
    status: farmer.status,
    created: new Date(farmer.created_at).toLocaleDateString(),
  }));

  return (
    <DashboardShell role="farmer" title="Farmer • My Farmers Data">
      <div className="space-y-6">
        <Card title="Add Farmer Record">
          {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
          <div className="grid gap-3 md:grid-cols-3">
            <Input placeholder="Full Name" value={form.fullName} onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))} />
            <Input placeholder="Phone Number" value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} />
            <Input placeholder="Location" value={form.location} onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))} />
          </div>
          <Button className="mt-4" onClick={createFarmer} disabled={saving}>
            {saving ? "Saving..." : "Submit Registration"}
          </Button>
        </Card>
        <Card title="Farmer Records">
          {loading ? (
            <p className="text-sm text-slate-600">Loading...</p>
          ) : (
            <Table
              rows={rows}
              emptyMessage="No records found"
              columns={[
                { key: "fullName", label: "Name" },
                { key: "phone", label: "Phone" },
                { key: "location", label: "Location" },
                {
                  key: "status",
                  label: "Status",
                  render: (value) => <Badge variant={String(value) === "Verified" ? "success" : String(value) === "Rejected" ? "danger" : "warning"}>{String(value)}</Badge>,
                },
                { key: "created", label: "Created" },
              ]}
            />
          )}
        </Card>
      </div>
    </DashboardShell>
  );
}
