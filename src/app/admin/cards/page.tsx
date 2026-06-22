import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { deleteCard, toggleCardFeature, toggleCardPublish } from "../actions";

export default async function AdminCards() {
  const supabase = await createClient();
  const { data: cards } = await supabase
    .from("cards")
    .select("*")
    .order("created_at", { ascending: false });
  const { data: profs } = await supabase.from("profiles").select("id, email");
  const emailById = new Map((profs ?? []).map((p) => [p.id, p.email]));

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Cards</h1>
      <p className="mt-1 text-muted-foreground">{cards?.length ?? 0} total.</p>

      {!cards || cards.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          No cards yet. They appear here once people save cards in the editor.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50 text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">Card</th>
                <th className="px-4 py-3 font-medium">Owner</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Views</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cards.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-medium">{c.title ?? "Untitled"}</div>
                    <a href={`/c/${c.slug}`} className="font-mono text-xs text-brand hover:underline">
                      /c/{c.slug}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{emailById.get(c.owner_id) ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <span
                        className={
                          c.published
                            ? "rounded-full bg-brand-subtle px-2 py-0.5 text-xs font-medium text-brand"
                            : "rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground"
                        }
                      >
                        {c.published ? "Published" : "Draft"}
                      </span>
                      {c.featured ? (
                        <span className="rounded-full border border-border px-2 py-0.5 text-xs text-warning">
                          Featured
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3 tabular-nums">{c.views}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <form action={toggleCardPublish}>
                        <input type="hidden" name="id" value={c.id} />
                        <input type="hidden" name="published" value={String(c.published)} />
                        <Button type="submit" variant="outline" size="sm">
                          {c.published ? "Unpublish" : "Publish"}
                        </Button>
                      </form>
                      <form action={toggleCardFeature}>
                        <input type="hidden" name="id" value={c.id} />
                        <input type="hidden" name="featured" value={String(c.featured)} />
                        <Button type="submit" variant="ghost" size="sm">
                          {c.featured ? "Unfeature" : "Feature"}
                        </Button>
                      </form>
                      <form action={deleteCard}>
                        <input type="hidden" name="id" value={c.id} />
                        <Button type="submit" variant="ghost" size="sm" className="text-destructive">
                          Delete
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
