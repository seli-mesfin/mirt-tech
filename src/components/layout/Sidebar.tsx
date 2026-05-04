"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { UserRole } from "@/lib/auth/types";

type MenuItem = {
  label: string;
  href: string;
};

const MENUS: Record<UserRole, MenuItem[]> = {
  admin: [
    { label: "Dashboard", href: "/dashboard/admin" },
    { label: "Users", href: "/dashboard/admin/users" },
    { label: "Farmers", href: "/dashboard/admin/farmers" },
    { label: "Exporters", href: "/dashboard/admin/exporters" },
    { label: "Deals", href: "/dashboard/admin/deals" },
    { label: "Payments", href: "/dashboard/admin/payments" },
    { label: "Reports", href: "/dashboard/admin/reports" },
    { label: "Verification", href: "/dashboard/admin/verification" },
  ],
  farmer: [
    { label: "Dashboard", href: "/dashboard/farmer" },
    { label: "My Profile", href: "/dashboard/farmer/profile" },
    { label: "My Farmers Data", href: "/dashboard/farmer/farm-data" },
  ],
  exporter: [
    { label: "Dashboard", href: "/dashboard/exporter" },
    { label: "Deals", href: "/dashboard/exporter/deals" },
    { label: "Payments", href: "/dashboard/exporter/payments" },
    { label: "Reports", href: "/dashboard/exporter/reports" },
  ],
};

type SidebarProps = {
  role: UserRole;
};

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const items = MENUS[role];

  return (
    <aside className="w-full border-r border-slate-200 bg-white lg:w-64">
      <div className="border-b border-slate-200 p-4">
        <div className="mx-auto w-full max-w-[140px]">
          <Image
            src="/logo.png"
            alt="Mirit Tech logo"
            width={220}
            height={220}
            className="h-auto w-full object-contain"
            priority
          />
        </div>
      </div>
      <nav className="space-y-1 p-3">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`block rounded-md px-3 py-2 text-sm font-medium transition ${
                isActive ? "bg-teal-700 text-white" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
