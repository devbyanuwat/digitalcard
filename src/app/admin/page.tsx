import { createClient } from "@/lib/supabase/server";
import { StatCard, StatStrip } from "@/components/Stat";

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
  call: "Call tapped",
  email: "Email tapped",
  website: "Website opened",
  link: "Link opened",
  social: "Social opened",
  cta: "Button tapped",
  link_click: "Link clicked",
};

export default async function AdminOverview() {
  const supabase = await createClient();
  const { data } = await supabase.rpc("admin_stats");
  const s = (data ?? {}) as Partial<Stats>;
  const { data: recent } = await supabase
    .from("card_events")
    .select("id, type, source, created_at")
    .order("created_at", { ascending: false })
    .limit(12);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
      <p className="mt-1 text-muted-foreground">Service health at a glance.</p>

      {/* primary metrics */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Users" value={s.users ?? 0} accent />
        <StatCard label="Cards" value={s.cards ?? 0} accent />
        <StatCard label="Total views" value={s.views ?? 0} accent />
      </div>

      {/* secondary metrics */}
      <div className="mt-4">
        <StatStrip
          items={[
            { label: "Admins", value: s.admins ?? 0 },
            { label: "Published", value: s.published ?? 0 },
            { label: "QR scans", value: s.qr ?? 0 },
            { label: "Contact saves", value: s.saves ?? 0 },
          ]}
        />
      </div>

      <h2 className="mt-12 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Recent activity
      </h2>
      {recent && recent.length > 0 ? (
        <ul className="mt-4 divide-y divide-border rounded-xl border border-border">
          {recent.map((e) => (
            <li key={e.id} className="flex items-center gap-3 px-4 py-3 text-sm">
              <span
                className="size-1.5 shrink-0 rounded-full bg-brand"
                aria-hidden="true"
              />
              <span className="font-medium">{EVENT_LABEL[e.type] ?? e.type}</span>
              {e.source ? <span className="text-fg-subtle">via {e.source}</span> : null}
              <span className="ml-auto text-xs text-fg-subtle">
                {new Date(e.created_at).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          No activity yet. Events appear once cards are viewed, scanned, or saved.
        </p>
      )}
    </div>
  );
}
