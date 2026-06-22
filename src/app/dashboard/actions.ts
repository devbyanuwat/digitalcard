"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { sampleCard } from "@/lib/card/sample";
import { createCardFromDoc } from "../edit/actions";

/** Create a fresh card from the sample doc, then open it in the editor. */
export async function newCard() {
  await requireUser();
  const c = await createCardFromDoc(sampleCard);
  redirect("/edit?id=" + c.id);
}

/** Delete one of the current user's cards (RLS enforces ownership). */
export async function deleteOwnCard(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id"));
  const supabase = await createClient();
  await supabase.from("cards").delete().eq("id", id);
  revalidatePath("/dashboard");
}

/** Flip the published flag on one of the current user's cards. */
export async function togglePublishOwn(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id"));
  const published = String(formData.get("published")) === "true";
  const supabase = await createClient();
  await supabase.from("cards").update({ published: !published }).eq("id", id);
  revalidatePath("/dashboard");
}
