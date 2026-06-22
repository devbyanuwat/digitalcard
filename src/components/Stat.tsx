import { cn } from "@/lib/utils";

/** A refined metric tile. `accent` lifts a primary/hero stat above the rest. */
export function StatCard({
  label,
  value,
  hint,
  accent = false,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-5",
        accent ? "border-brand/30 ring-1 ring-brand/10" : "border-border",
      )}
    >
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 text-3xl font-semibold tabular-nums tracking-tight">{value}</div>
      {hint ? <div className="mt-1 text-xs text-fg-subtle">{hint}</div> : null}
    </div>
  );
}

/** Compact inline stats separated by hairlines — for secondary metrics. */
export function StatStrip({ items }: { items: { label: string; value: React.ReactNode }[] }) {
  return (
    <div className="flex flex-wrap divide-x divide-border overflow-hidden rounded-xl border border-border bg-card">
      {items.map((it) => (
        <div key={it.label} className="flex-1 px-5 py-4">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {it.label}
          </div>
          <div className="mt-1 text-xl font-semibold tabular-nums">{it.value}</div>
        </div>
      ))}
    </div>
  );
}
