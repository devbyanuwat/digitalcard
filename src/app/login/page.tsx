import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  if (await getUser()) redirect(next ?? "/dashboard");

  return (
    <div className="grid min-h-dvh place-items-center bg-background px-6 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 font-semibold tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-brand text-sm font-bold text-brand-foreground">
            d
          </span>
          digitalcard
        </Link>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h1 className="text-lg font-semibold">Sign in to digitalcard</h1>
          <p className="mt-1 mb-5 text-sm text-muted-foreground">
            Save your cards and manage them from anywhere.
          </p>
          {error ? <p className="mb-4 text-sm text-destructive">{error}</p> : null}
          <LoginForm next={next} />
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
