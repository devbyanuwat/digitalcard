import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { setUserRole, toggleSuspend } from "../actions";

export default async function AdminUsers() {
  const supabase = await createClient();
  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
      <p className="mt-1 text-muted-foreground">{users?.length ?? 0} registered.</p>

      <div className="mt-8 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50 text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Plan</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <div className="font-medium">{u.display_name ?? "—"}</div>
                  <div className="text-xs text-fg-subtle">{u.email}</div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      u.role === "admin"
                        ? "rounded-full bg-brand-subtle px-2 py-0.5 text-xs font-medium text-brand"
                        : "rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground"
                    }
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{u.plan}</td>
                <td className="px-4 py-3">
                  {u.suspended ? (
                    <span className="text-destructive">Suspended</span>
                  ) : (
                    <span className="text-success">Active</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <form action={setUserRole}>
                      <input type="hidden" name="id" value={u.id} />
                      <input type="hidden" name="role" value={u.role === "admin" ? "user" : "admin"} />
                      <Button type="submit" variant="outline" size="sm">
                        {u.role === "admin" ? "Make user" : "Make admin"}
                      </Button>
                    </form>
                    <form action={toggleSuspend}>
                      <input type="hidden" name="id" value={u.id} />
                      <input type="hidden" name="suspended" value={String(u.suspended)} />
                      <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                        className={u.suspended ? "text-success" : "text-destructive"}
                      >
                        {u.suspended ? "Unsuspend" : "Suspend"}
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
