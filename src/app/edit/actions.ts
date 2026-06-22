"use server";

import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { CardDocument } from "@/lib/card/types";
import type { Json } from "@/lib/supabase/database.types";

function deriveTitle(doc: CardDocument): string {
  const header = doc.blocks.find((b) => b.type === "header");
  if (header && header.type === "header" && header.data.name) return header.data.name;
  return doc.meta.title || "Untitled card";
}

function baseSlug(doc: CardDocument): string {
  const raw = (doc.slug || deriveTitle(doc)).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
  return raw.slice(0, 40) || "card";
}

function rand(n: number): string {
  // Math.random is fine in a server action (not a workflow script).
  return Math.random().toString(36).slice(2, 2 + n);
}

/** Create a new DB card from the current editor doc. Returns { id, slug }. */
export async function createCardFromDoc(doc: CardDocument): Promise<{ id: string; slug: string }> {
  const user = await requireUser();
  const supabase = await createClient();
  const base = baseSlug(doc);

  for (let attempt = 0; attempt < 5; attempt++) {
    const slug = attempt === 0 ? base : `${base}-${rand(4)}`;
    const { data, error } = await supabase
      .from("cards")
      .insert({
        owner_id: user.id,
        slug,
        doc: doc as unknown as Json,
        theme_id: doc.themeId,
        title: deriveTitle(doc),
      })
      .select("id, slug")
      .single();
    if (!error && data) return data;
    if (error && error.code !== "23505") throw new Error(error.message); // not a unique conflict
  }
  throw new Error("Could not generate a unique slug. Try again.");
}

/** Persist edits to an existing card (RLS enforces ownership). */
export async function saveCardDoc(cardId: string, doc: CardDocument): Promise<{ ok: true }> {
  await requireUser();
  const supabase = await createClient();
  const { error } = await supabase
    .from("cards")
    .update({ doc: doc as unknown as Json, theme_id: doc.themeId, title: deriveTitle(doc) })
    .eq("id", cardId);
  if (error) throw new Error(error.message);
  return { ok: true };
}

/** Publish / unpublish a card. */
export async function publishCard(cardId: string, published: boolean): Promise<{ ok: true }> {
  await requireUser();
  const supabase = await createClient();
  const { error } = await supabase.from("cards").update({ published }).eq("id", cardId);
  if (error) throw new Error(error.message);
  return { ok: true };
}
