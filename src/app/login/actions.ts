"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; message?: string } | null;

function safePath(p: string): string {
  return p.startsWith("/") && !p.startsWith("//") ? p : "/dashboard";
}

/** Sign in or sign up with email + password, based on the `mode` field. */
export async function authenticate(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const mode = String(formData.get("mode") ?? "signin");
  const next = safePath(String(formData.get("next") ?? "/dashboard"));

  const supabase = await createClient();

  if (mode === "signup") {
    const origin = (await headers()).get("origin") ?? "";
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${origin}/auth/confirm?next=${encodeURIComponent(next)}` },
    });
    if (error) return { error: error.message };
    if (data.session) redirect(next); // email confirmation disabled → signed in
    return { message: "Account created. Check your email to confirm, then sign in." };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  redirect(next);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
