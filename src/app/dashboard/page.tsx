import Link from "next/link";
import { BarChart3, Eye, LogOut, Plus, SquarePen } from "lucide-react";
import { getProfile, getUser, requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "../login/actions";
import { deleteOwnCard, newCard, togglePublishOwn } from "./actions";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  await requireUser();
  const profile = await getProfile();
  const user = await getUser();
  const supabase = await createClient();
  const { data: cards } = await supabase
    .from("cards")
    .select("id, slug, title, published, views, updated_at")
    .eq("owner_id", user!.id)
    .order("updated_at", { ascending: false });

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-brand text-sm font-bold text-brand-foreground">
              d
            </span>
            digitalcard
          </Link>
          {profile?.role === "admin" ? (
            <Link
              href="/admin"
              className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground"
            >
              Admin
            </Link>
          ) : null}
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{profile?.email}</span>
            <form action={signOut}>
              <Button type="submit" variant="outline" size="sm">
                <LogOut />
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Your cards</h1>
            <p className="mt-1 text-muted-foreground">Create, publish, and manage your digital cards.</p>
          </div>
          <form action={newCard}>
            <Button type="submit">
              <Plus />
              New card
            </Button>
          </form>
        </div>

        {cards && cards.length > 0 ? (
          <div className="mt-8 grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
            {cards.map((card) => (
              <div key={card.id} className="flex flex-col rounded-xl border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-medium tracking-tight">{card.title || "Untitled"}</h2>
                  <span
                    className={
                      "shrink-0 rounded-full border px-2 py-0.5 text-xs " +
                      (card.published
                        ? "border-success/30 text-success"
                        : "border-border text-muted-foreground")
                    }
                  >
                    {card.published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="mt-1 font-mono text-xs text-fg-subtle">/c/{card.slug}</p>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Eye className="size-3.5" />
                    {card.views} views
                  </span>
                  <span>Updated {new Date(card.updated_at).toLocaleDateString()}</span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/edit?id=${card.id}`}>
                      <SquarePen />
                      Edit
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/dashboard/analytics/${card.slug}`}>
                      <BarChart3 />
                      Stats
                    </Link>
                  </Button>
                  <form action={togglePublishOwn}>
                    <input type="hidden" name="id" value={card.id} />
                    <input type="hidden" name="published" value={String(card.published)} />
                    <Button type="submit" variant="outline" size="sm">
                      {card.published ? "Unpublish" : "Publish"}
                    </Button>
                  </form>
                  {card.published ? (
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/c/${card.slug}`} target="_blank" rel="noreferrer">
                        View
                      </Link>
                    </Button>
                  ) : null}
                  <form action={deleteOwnCard} className="ml-auto">
                    <input type="hidden" name="id" value={card.id} />
                    <Button type="submit" variant="ghost" size="sm" className="text-destructive">
                      Delete
                    </Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-center gap-4 rounded-xl border border-dashed border-border px-6 py-16 text-center">
            <p className="text-muted-foreground">No cards yet.</p>
            <form action={newCard}>
              <Button type="submit">
                <Plus />
                New card
              </Button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
