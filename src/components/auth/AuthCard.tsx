"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import type { UserRole } from "@/lib/auth/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

type AuthMode = "login" | "signup";

type AuthCardProps = {
  mode: AuthMode;
};

export function AuthCard({ mode }: AuthCardProps) {
  const router = useRouter();
  const redirect = useMemo(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get("redirect");
  }, []);
  const pageRole = useMemo(() => {
    if (typeof window === "undefined") return "farmer" as Exclude<UserRole, "admin">;
    const roleParam = new URLSearchParams(window.location.search).get("role");
    return roleParam === "exporter" || roleParam === "farmer"
      ? (roleParam as Exclude<UserRole, "admin">)
      : ("farmer" as Exclude<UserRole, "admin">);
  }, []);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    role: pageRole,
  });

  const handleSubmit = async () => {
    if (!supabase) {
      setErrorMessage("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      return;
    }

    const targetRedirect = redirect ? `/?redirect=${encodeURIComponent(redirect)}` : "/";
    setLoading(true);
    setErrorMessage(null);

    try {
      if (mode === "signup") {
        if (!form.fullName) {
          throw new Error("Full name is required for signup.");
        }

        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
        });

        if (error) throw error;
        if (!data.user) throw new Error("Signup failed. User was not created.");

        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          role: form.role,
          full_name: form.fullName,
        });

        if (profileError) throw profileError;
        router.replace(targetRedirect);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });

        if (error) throw error;

        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!userData.user) throw new Error("Unable to load user information.");

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", userData.user.id)
          .single();

        if (profileError || !profileData?.role) {
          throw new Error("Profile not found - contact admin");
        }
        router.replace(targetRedirect);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-6">
      <h1 className="text-2xl font-bold text-slate-900">Mirit Tech</h1>
      <p className="mt-1 text-sm text-slate-500">Agricultural trade management platform</p>

      <div className="mt-5 space-y-3">
        {! supabase  && (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Configure `.env.local` with Supabase URL and anon key to enable authentication.
          </p>
        )}

        <Input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          autoComplete="email"
        />
        <Input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          autoComplete="new-password"
        />

        {mode === "signup" ? (
          <>
            <Input
              placeholder="Full Name"
              value={form.fullName}
              onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
            />
            <select
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              value={form.role}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  role: e.target.value as Exclude<UserRole, "admin">,
                }))
              }
            >
              <option value="farmer">Farmer</option>
              <option value="exporter">Exporter</option>
            </select>
          </>
        ) : null}

        <Button onClick={handleSubmit} disabled={loading || !supabase} className="w-full">
          {loading ? "Processing..." : mode === "signup" ? "Create Account" : "Login"}
        </Button>
        {errorMessage ? <p className="text-sm text-red-700">{errorMessage}</p> : null}
      </div>

      <p className="mt-5 text-sm text-slate-500">
        {mode === "signup" ? "Already have an account?" : "Need an account?"}{" "}
        <Link href={mode === "signup" ? "/login" : "/auth/signup"} className="font-semibold text-teal-700 hover:text-teal-800">
          {mode === "signup" ? "Login" : "Sign up"}
        </Link>
      </p>
    </Card>
  );
}
