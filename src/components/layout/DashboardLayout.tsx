import type { ReactNode } from "react";
import type { UserRole } from "@/lib/auth/types";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

type DashboardLayoutProps = {
  role: UserRole;
  roleLabel: string;
  title: string;
  userName: string;
  userEmail?: string;
  onSignOut: () => void;
  children: ReactNode;
};

export function DashboardLayout({ role, roleLabel, title, userName, userEmail, onSignOut, children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 lg:flex">
      <Sidebar role={role} />
      <div className="flex min-h-screen flex-1 flex-col">
        <Header title={title} roleLabel={roleLabel} userName={userName} userEmail={userEmail} onSignOut={onSignOut} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
