import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
};

const VARIANT_CLASSES: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-slate-100 text-slate-700 border-slate-200",
  success: "bg-emerald-100 text-emerald-700 border-emerald-200",
  warning: "bg-amber-100 text-amber-700 border-amber-200",
  danger: "bg-red-100 text-red-700 border-red-200",
};

export function Badge({ children, variant = "default" }: BadgeProps) {
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${VARIANT_CLASSES[variant]}`}>{children}</span>;
}
