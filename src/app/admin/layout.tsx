import Link from "next/link";
import { ArrowLeft, LogOut } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { signOut } from "../login/actions";
import { Button } from "@/components/ui/button";
import { AdminNav } from "./AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireAdmin();

  return (
    <div className="grid min-h-dvh grid-cols-[224px_1fr] bg-background text-foreground max-md:grid-cols-1">
      <aside className="flex flex-col border-r border-border p-4 max-md:hidden">
        <div className="mb-6 flex items-center gap-2 px-1">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-brand text-sm font-bold text-brand-foreground">
            d
          </span>
          <span className="font-semibold tracking-tight">Admin</span>
        </div>

        <AdminNav />

        <div className="mt-auto space-y-2 pt-4">
          <div className="px-3 text-xs text-fg-subtle">{profile.email}</div>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to app
          </Link>
          <form action={signOut} className="px-1">
            <Button type="submit" variant="outline" size="sm" className="w-full justify-start">
              <LogOut />
              Sign out
            </Button>
          </form>
        </div>
      </aside>

      <main className="min-w-0 overflow-auto">
        <div className="mx-auto max-w-5xl px-6 py-10">{children}</div>
      </main>
    </div>
  );
}
