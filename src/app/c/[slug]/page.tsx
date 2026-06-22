import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { CardDocument } from "@/lib/card/types";
import { getTheme, defaultTheme } from "@/lib/card/themes";
import { googleFontHref } from "@/lib/card/theme-engine";
import { CardRenderer } from "@/components/card/CardRenderer";
import { CardAnalytics } from "@/components/card/CardAnalytics";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Read the display name from the card's header block, falling back to meta.title. */
function deriveName(doc: CardDocument): string {
  const header = doc.blocks.find((b) => b.type === "header");
  if (header && header.type === "header" && header.data.name) return header.data.name;
  return doc.meta.title || "Card";
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("cards")
    .select("title, doc")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (!data) return { title: "Card not found" };

  const doc = data.doc as unknown as CardDocument;
  const name = deriveName(doc);
  const title = data.title || name;
  const description = doc.meta.description;

  return {
    title,
    description,
    openGraph: { title, type: "profile" },
    alternates: { canonical: `/c/${slug}` },
  };
}

export default async function PublicCard({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("cards")
    .select("slug, doc, theme_id, published")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (!data) notFound();

  const doc = data.doc as unknown as CardDocument;
  const theme = getTheme(doc.themeId) ?? defaultTheme;

  return (
    <div className="flex min-h-dvh flex-col items-center bg-background px-4 py-12">
      <link rel="stylesheet" href={googleFontHref(theme)} />
      {/* logs the view (with referrer/source/device) + delegates action clicks */}
      <CardAnalytics slug={data.slug} />
      <div className="flex w-full flex-1 flex-col items-center justify-center">
        <CardRenderer doc={doc} theme={theme} />
      </div>
      <footer className="mt-12">
        <Link
          href="/"
          className="text-xs text-fg-subtle transition-colors hover:text-foreground"
        >
          Made with digitalcard
        </Link>
      </footer>
    </div>
  );
}
