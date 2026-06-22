import { createClient } from "@/lib/supabase/server";

type Stats = {
  users: number;
  admins: number;
  cards: number;
  published: number;
  views: number;
  qr: number;
  saves: number;
};

const EVENT_LABEL: Record<string, string> = {
  view: "Card viewed",
  qr: "QR scanned",
  save_contact: "Contact saved",
  link_click: "Link clicked",
};

export default async function AdminOverview() {
  const supabase = await createClient();
  const { data } = await supabase.rpc("admin_stats");
  const s = (data ?? {}) as Partial<Stats>;
  const { data: recent } = await supabase
    .from("card_events")
    .select("id, type, created_at")
    .order("created_at", { ascending: false })
    .limit(12);

  const stats = [
    { label: "Users", value: s.users ?? 0 },
    { label: "Admins", value: s.admins ?? 0 },
    { label: "Cards", value: s.cards ?? 0 },
    { label: "Published", value: s.published ?? 0 },
    { label: "Total views", value: s.views ?? 0 },
    { label: "QR scans", value: s.qr ?? 0 },
    { label: "Contact saves", value: s.saves ?? 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
      <p className="mt-1 text-muted-foreground">Service health at a glance.</p>

      <div className="mt-8 grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))]">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {stat.label}
            </div>
            <div className="mt-1 text-3xl font-semibold tabular-nums">{stat.value}</div>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-lg font-semibold">Recent activity</h2>
      {recent && recent.length > 0 ? (
        <ul className="mt-4 divide-y divide-border rounded-xl border border-border">
          {recent.map((e) => (
            <li key={e.id} className="flex items-center justify-between px-4 py-3 text-sm">
              <span>{EVENT_LABEL[e.type] ?? e.type}</span>
              <span className="text-fg-subtle">{new Date(e.created_at).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          No activity yet. Events appear once cards are viewed, scanned, or saved.
        </p>
      )}
    </div>
  );
}
