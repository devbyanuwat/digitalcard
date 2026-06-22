"use client";

import { useBuilder } from "@/lib/card/store";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CardBlock } from "@/lib/card/types";
import { BLOCK_META } from "./block-meta";
import { HeaderForm } from "./forms/HeaderForm";
import { BioForm } from "./forms/BioForm";
import { LinksForm } from "./forms/LinksForm";
import { SocialForm } from "./forms/SocialForm";
import { ContactForm } from "./forms/ContactForm";
import { CtaForm } from "./forms/CtaForm";
import { GalleryForm } from "./forms/GalleryForm";
import { MapForm } from "./forms/MapForm";
import { SpacerForm } from "./forms/SpacerForm";

function FormFor({ block }: { block: CardBlock }) {
  switch (block.type) {
    case "header":
      return <HeaderForm block={block} />;
    case "bio":
      return <BioForm block={block} />;
    case "links":
      return <LinksForm block={block} />;
    case "social":
      return <SocialForm block={block} />;
    case "contact":
      return <ContactForm block={block} />;
    case "cta":
      return <CtaForm block={block} />;
    case "gallery":
      return <GalleryForm block={block} />;
    case "map":
      return <MapForm block={block} />;
    case "spacer":
      return <SpacerForm block={block} />;
    case "divider":
      return <p className="text-sm text-muted-foreground">A divider has no settings.</p>;
  }
}

export function Inspector() {
  const block = useBuilder((s) => s.doc.blocks.find((b) => b.id === s.selectedBlockId) ?? null);

  if (!block) {
    return (
      <aside className="flex h-full items-center justify-center border-l border-border bg-background p-6 text-center text-sm text-muted-foreground">
        Select a block to edit its content.
      </aside>
    );
  }

  const meta = BLOCK_META[block.type];
  const Icon = meta.icon;

  return (
    <aside className="flex h-full min-h-0 flex-col border-l border-border bg-background">
      <header className="flex items-center gap-2 border-b border-border p-4">
        <span className="grid size-7 place-items-center rounded-md bg-brand-subtle text-brand">
          <Icon className="size-4" />
        </span>
        <div>
          <div className="text-sm font-semibold">{meta.label}</div>
          <div className="text-[11px] text-fg-subtle">Block settings</div>
        </div>
      </header>
      <ScrollArea className="min-h-0 flex-1">
        <div className="p-4">
          <FormFor block={block} />
        </div>
      </ScrollArea>
    </aside>
  );
}
