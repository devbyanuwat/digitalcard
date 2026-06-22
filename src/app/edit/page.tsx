import { Builder } from "@/components/builder/Builder";
import { getThemes } from "@/lib/card/themes";
import { collectFontHrefs } from "@/lib/card/theme-engine";
import { getUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { CardDocument } from "@/lib/card/types";

/** The builder. With ?id=, loads that saved card (owner only) into the editor. */
export default async function EditPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const fontHrefs = collectFontHrefs(getThemes("oss"));
  const user = await getUser();

  let initialCardId: string | null = null;
  let initialDoc: CardDocument | null = null;
  if (id && user) {
    const supabase = await createClient();
    const { data } = await supabase.from("cards").select("id, doc").eq("id", id).single();
    if (data) {
      initialCardId = data.id;
      initialDoc = data.doc as unknown as CardDocument;
    }
  }

  return (
    <>
      {fontHrefs.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      <Builder isAuthed={!!user} initialCardId={initialCardId} initialDoc={initialDoc} />
    </>
  );
}
