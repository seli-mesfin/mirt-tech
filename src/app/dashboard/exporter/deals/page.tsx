"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Table } from "@/components/ui/Table";
import type { DealRow, FarmerRow } from "@/lib/auth/types";
import { fetchAllFarmers, fetchDealsForExporter } from "@/lib/data/dashboard";
import { supabase } from "@/lib/supabase/client";
import { getErrorMessage } from "@/lib/utils";

type DealRowUI = { crop: string; farmer: string; amount: string; status: string };

export default function ExporterDealsPage() {
  const [farmers, setFarmers] = useState<FarmerRow[]>([]);
  const [deals, setDeals] = useState<DealRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    farmerUserId: "",
    cropType: "",
    pricePerUnit: "",
    quantity: "",
  });

  const loadData = async () => {
    if (!supabase) throw new Error("Supabase client not configured.");
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("No active session");
    console.log("[Exporter Deals] userId=", userData.user.id);
    const [farmerData, dealData] = await Promise.all([
      fetchAllFarmers(),
      fetchDealsForExporter(userData.user.id),
    ]);
    console.log("[Exporter Deals] loaded farmers", farmerData.length, "deals", dealData.length);
    setFarmers(farmerData);
    setDeals(dealData);
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

  const createDeal = async () => {
    try {
      setSaving(true);
      setError(null);
      if (!supabase) throw new Error("Supabase client not configured.");
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("No active session");
      if (!form.farmerUserId || !form.cropType || !form.pricePerUnit || !form.quantity) {
        throw new Error("Fill all deal fields before submitting.");
      }

      const price = Number(form.pricePerUnit);
      const quantity = Number(form.quantity);
      const estimatedValue = price * quantity;

      const { error: insertError } = await supabase.from("deals").insert({
        farmer_user_id: form.farmerUserId,
        exporter_user_id: userData.user.id,
        crop_type: form.cropType,
        price_per_unit: price,
        estimated_quantity: quantity,
        estimated_value: estimatedValue,
        status: "Active",
      });

      if (insertError) throw insertError;
      await loadData();
      setForm({ farmerUserId: "", cropType: "", pricePerUnit: "", quantity: "" });
    } catch (err) {
      setError(getErrorMessage(err, "Unable to save deal. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  const dealRows: DealRowUI[] = deals.map((deal) => ({
    crop: deal.crop_type,
    farmer: deal.farmer_user_id.slice(0, 8),
    amount: Number(deal.estimated_value).toLocaleString(),
    status: deal.status,
  }));

  return (
    <DashboardShell role="exporter" title="Exporter • Deals">
      <div className="space-y-6">
        <Card title="Create Deal">
          {error ? <p className="mb-3 text-sm text-red-700">{error}</p> : null}
          <div className="grid gap-3 md:grid-cols-2">
            <select
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              value={form.farmerUserId}
              onChange={(e) => setForm((prev) => ({ ...prev, farmerUserId: e.target.value }))}
            >
              <option value="">Select farmer</option>
              {farmers.map((farmer) => (
                <option key={farmer.id} value={farmer.user_id}>
                  {farmer.fullName} ({farmer.user_id.slice(0, 8)})
                </option>
              ))}
            </select>
            <Input placeholder="Crop type" value={form.cropType} onChange={(e) => setForm((prev) => ({ ...prev, cropType: e.target.value }))} />
            <Input
              placeholder="Price per unit"
              type="number"
              value={form.pricePerUnit}
              onChange={(e) => setForm((prev) => ({ ...prev, pricePerUnit: e.target.value }))}
            />
            <Input
              placeholder="Estimated quantity"
              type="number"
              value={form.quantity}
              onChange={(e) => setForm((prev) => ({ ...prev, quantity: e.target.value }))}
            />
          </div>
          <Button className="mt-4" onClick={createDeal} disabled={saving}>
            {saving ? "Saving..." : "Create Deal"}
          </Button>
        </Card>

        <Card title="Deals List">
          {loading ? (
            <p className="text-sm text-slate-600">Loading...</p>
          ) : (
            <Table
              rows={dealRows}
              emptyMessage="No records found"
              columns={[
                { key: "crop", label: "Crop" },
                { key: "farmer", label: "Farmer" },
                { key: "amount", label: "Amount" },
                { key: "status", label: "Status", render: (value) => <Badge>{String(value)}</Badge> },
              ]}
            />
          )}
        </Card>
      </div>
    </DashboardShell>
  );
}
