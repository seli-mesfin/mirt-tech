import type { ReactNode } from "react";

type CardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Card({ title, children, className = "" }: CardProps) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      {title ? <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3> : null}
      {children}
    </div>
  );
}
