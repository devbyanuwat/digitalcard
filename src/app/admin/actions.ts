"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

/* ---- Users ---- */

export async function setUserRole(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const role = String(formData.get("role")) === "admin" ? "admin" : "user";
  const supabase = await createClient();
  await supabase.from("profiles").update({ role }).eq("id", id);
  revalidatePath("/admin/users");
}

export async function toggleSuspend(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const suspended = String(formData.get("suspended")) === "true";
  const supabase = await createClient();
  await supabase.from("profiles").update({ suspended: !suspended }).eq("id", id);
  revalidatePath("/admin/users");
}

/* ---- Cards ---- */

export async function toggleCardPublish(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const published = String(formData.get("published")) === "true";
  const supabase = await createClient();
  await supabase.from("cards").update({ published: !published }).eq("id", id);
  revalidatePath("/admin/cards");
}

export async function toggleCardFeature(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const featured = String(formData.get("featured")) === "true";
  const supabase = await createClient();
  await supabase.from("cards").update({ featured: !featured }).eq("id", id);
  revalidatePath("/admin/cards");
}

export async function deleteCard(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("cards").delete().eq("id", id);
  revalidatePath("/admin/cards");
}

/* ---- Themes ---- */

export async function toggleTheme(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const enabled = String(formData.get("enabled")) === "true";
  const supabase = await createClient();
  await supabase.from("themes").update({ enabled: !enabled }).eq("id", id);
  revalidatePath("/admin/themes");
}

export async function setThemeTier(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const tier = String(formData.get("tier")) === "oss" ? "oss" : "hosted";
  const supabase = await createClient();
  await supabase.from("themes").update({ tier }).eq("id", id);
  revalidatePath("/admin/themes");
}

export async function addTheme(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id")).trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
  const name = String(formData.get("name")).trim();
  const category = String(formData.get("category") || "minimal");
  if (!id || !name) return;
  const supabase = await createClient();
  await supabase.from("themes").insert({ id, name, category, tier: "hosted", enabled: true, data: {} });
  revalidatePath("/admin/themes");
}
