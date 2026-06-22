import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addTheme, setThemeTier, toggleTheme } from "../actions";

export default async function AdminThemes() {
  const supabase = await createClient();
  const { data: themes } = await supabase
    .from("themes")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Theme catalog</h1>
      <p className="mt-1 text-muted-foreground">
        Hosted themes managed here. The six base themes ship in code (tier <code>oss</code>).
      </p>

      <div className="mt-8 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50 text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Theme</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Tier</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {themes?.map((t) => (
              <tr key={t.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <div className="font-medium">{t.name}</div>
                  <div className="font-mono text-xs text-fg-subtle">{t.id}</div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{t.category}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                    {t.tier}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {t.enabled ? (
                    <span className="text-success">Enabled</span>
                  ) : (
                    <span className="text-fg-subtle">Disabled</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <form action={toggleTheme}>
                      <input type="hidden" name="id" value={t.id} />
                      <input type="hidden" name="enabled" value={String(t.enabled)} />
                      <Button type="submit" variant="outline" size="sm">
                        {t.enabled ? "Disable" : "Enable"}
                      </Button>
                    </form>
                    <form action={setThemeTier}>
                      <input type="hidden" name="id" value={t.id} />
                      <input type="hidden" name="tier" value={t.tier === "oss" ? "hosted" : "oss"} />
                      <Button type="submit" variant="ghost" size="sm">
                        {t.tier === "oss" ? "Set hosted" : "Set OSS"}
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 text-lg font-semibold">Add a hosted theme</h2>
      <form action={addTheme} className="mt-4 flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="t-id">ID</Label>
          <Input id="t-id" name="id" placeholder="ocean" required className="w-40" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="t-name">Name</Label>
          <Input id="t-name" name="name" placeholder="Ocean" required className="w-48" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="t-cat">Category</Label>
          <Input id="t-cat" name="category" placeholder="gradient" defaultValue="gradient" className="w-40" />
        </div>
        <Button type="submit" className="bg-brand text-brand-foreground hover:bg-brand-hover">
          Add theme
        </Button>
      </form>
    </div>
  );
}
