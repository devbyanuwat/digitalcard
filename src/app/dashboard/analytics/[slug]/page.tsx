import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Analytics = {
  slug: string;
  title: string | null;
  views: number;
  published: boolean;
  totals: { views: number; clicks: number };
  by_source: { source: string; count: number }[];
  by_action: { type: string; count: number }[];
  by_device: { device: string; count: number }[];
  by_day: { day: string; views: number }[];
  recent: {
    type: string;
    source: string | null;
    device: string | null;
    target: string | null;
    created_at: string;
  }[];
};

const SOURCE_LABEL: Record<string, string> = {
  direct: "Direct",
  qr: "QR code",
  line: "LINE",
  facebook: "Facebook",
  instagram: "Instagram",
  x: "X / Twitter",
  linkedin: "LinkedIn",
  telegram: "Telegram",
  whatsapp: "WhatsApp",
  google: "Google",
  other: "Other",
};

const ACTION_LABEL: Record<string, string> = {
  call: "Call",
  email: "Email",
  save_contact: "Save contact",
  website: "Website",
  link: "Link",
  social: "Social",
  cta: "Button",
};

function label(map: Record<string, string>, key: string): string {
  return map[key] ?? key.charAt(0).toUpperCase() + key.slice(1);
}

export default async function CardAnalyticsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireUser();
  const { slug } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("card_analytics", { p_slug: slug });
  if (error || !data) notFound();
  const a = data as unknown as Analytics;

  // Build a continuous 14-day axis (RPC only returns days that had events).
  const counts = new Map(a.by_day.map((d) => [d.day, d.views]));
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(Date.now() - (13 - i) * 86_400_000);
    const key = d.toISOString().slice(0, 10);
    return { key, day: d.getDate(), views: counts.get(key) ?? 0 };
  });
  const maxDay = Math.max(1, ...days.map((d) => d.views));

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-4xl items-center gap-3 px-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Dashboard
          </Link>
          {a.published ? (
            <Link
              href={`/c/${a.slug}`}
              target="_blank"
              rel="noreferrer"
              className="ml-auto inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              View card
              <ExternalLink className="size-3.5" />
            </Link>
          ) : (
            <span className="ml-auto text-sm text-fg-subtle">Draft — publish to share</span>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">{a.title || "Untitled"}</h1>
        <p className="mt-1 font-mono text-xs text-fg-subtle">/c/{a.slug}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Stat label="Total views" value={a.totals.views} />
          <Stat label="Action clicks" value={a.totals.clicks} />
          <Stat
            label="Click rate"
            value={a.totals.views ? Math.round((a.totals.clicks / a.totals.views) * 100) + "%" : "—"}
          />
        </div>

        {/* views over 14 days */}
        <section className="mt-10">
          <h2 className="text-sm font-semibold text-muted-foreground">Views — last 14 days</h2>
          <div className="mt-4 flex h-32 items-end gap-1.5 rounded-xl border border-border bg-card p-4">
            {days.map((d) => (
              <div key={d.key} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-sm bg-brand"
                  style={{ height: `${Math.max(2, (d.views / maxDay) * 96)}px` }}
                  title={`${d.views} views`}
                />
                <span className="text-[10px] text-fg-subtle">{d.day}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <BarList title="Where viewers came from" rows={a.by_source.map((s) => ({ label: label(SOURCE_LABEL, s.source), count: s.count }))} empty="No views yet." />
          <BarList title="What they clicked" rows={a.by_action.map((s) => ({ label: label(ACTION_LABEL, s.type), count: s.count }))} empty="No clicks yet." />
          <BarList title="Device" rows={a.by_device.map((s) => ({ label: label({}, s.device), count: s.count }))} empty="No views yet." />
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground">Recent activity</h2>
            {a.recent.length === 0 ? (
              <p className="mt-4 rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                Nothing yet.
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-border rounded-xl border border-border text-sm">
                {a.recent.slice(0, 10).map((e, i) => (
                  <li key={i} className="flex items-center gap-2 px-3 py-2">
                    <span className="font-medium">
                      {e.type === "view" || e.type === "qr"
                        ? "View"
                        : label(ACTION_LABEL, e.type)}
                    </span>
                    <span className="text-fg-subtle">{label(SOURCE_LABEL, e.source ?? "direct")}</span>
                    {e.device ? <span className="text-fg-subtle">· {e.device}</span> : null}
                    <span className="ml-auto text-xs text-fg-subtle">
                      {new Date(e.created_at).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-3xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function BarList({
  title,
  rows,
  empty,
}: {
  title: string;
  rows: { label: string; count: number }[];
  empty: string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <div>
      <h2 className="text-sm font-semibold text-muted-foreground">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          {empty}
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {rows.map((r) => (
            <li key={r.label} className="flex items-center gap-3 text-sm">
              <span className="w-28 shrink-0 truncate">{r.label}</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                <span
                  className="block h-full rounded-full bg-brand"
                  style={{ width: `${(r.count / max) * 100}%` }}
                />
              </span>
              <span className="w-8 shrink-0 text-right tabular-nums text-muted-foreground">
                {r.count}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
