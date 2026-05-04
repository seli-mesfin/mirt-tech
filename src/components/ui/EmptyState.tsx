type EmptyStateProps = {
  description?: string;
};

export function EmptyState({ description = "No data available yet" }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
      {description}
    </div>
  );
}
