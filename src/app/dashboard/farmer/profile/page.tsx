"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Card } from "@/components/ui/Card";
import { supabase } from "@/lib/supabase/client";
import type { ProfileRow } from "@/lib/auth/types";
import { getErrorMessage } from "@/lib/utils";

export default function FarmerProfilePage() {
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!supabase) throw new Error("Supabase client not configured.");
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error("No active session");
        console.log("[Farmer Profile] userId=", userData.user.id);
        setEmail(userData.user.email ?? "");
        const { data, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userData.user.id)
          .single();
        if (profileError) throw profileError;
        setProfile(data as ProfileRow);
      } catch (err) {
        setError(getErrorMessage(err, "Unable to load data. Please try again."));
      } finally {
        setLoading(false);
      }
    };
    void loadData();
  }, []);

  return (
    <DashboardShell role="farmer" title="Farmer • My Profile">
      {error ? <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
      {loading ? (
        <p className="text-sm text-slate-600">Loading...</p>
      ) : (
        <Card title="My Profile">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Full Name</p>
              <p className="mt-2 font-semibold text-slate-800">{profile?.full_name ?? "Profile not found - contact admin"}</p>
            </div>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</p>
              <p className="mt-2 font-semibold text-slate-800">{email || "No email available"}</p>
            </div>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Role</p>
              <p className="mt-2 font-semibold capitalize text-slate-800">{profile?.role ?? "Profile not found - contact admin"}</p>
            </div>
          </div>
        </Card>
      )}
    </DashboardShell>
  );
}
