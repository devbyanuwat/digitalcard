"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Cloud, Globe, QrCode, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useBuilder } from "@/lib/card/store";
import { createCardFromDoc, publishCard, saveCardDoc } from "@/app/edit/actions";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";

type SaveState = "idle" | "saving" | "saved";

export function Topbar({ isAuthed, onShare }: { isAuthed: boolean; onShare: () => void }) {
  const router = useRouter();
  const name = useBuilder((s) => {
    const h = s.doc.blocks.find((b) => b.type === "header");
    return h && h.type === "header" ? h.data.name : "";
  });
  const [save, setSave] = useState<SaveState>("idle");

  async function ensureSaved(): Promise<string | null> {
    const { doc, cardId, setCard } = useBuilder.getState();
    if (cardId) {
      await saveCardDoc(cardId, doc);
      return cardId;
    }
    const created = await createCardFromDoc(doc);
    setCard(created.id, doc);
    return created.id;
  }

  async function handleSave() {
    if (!isAuthed) {
      router.push("/login?next=/edit");
      return;
    }
    setSave("saving");
    try {
      await ensureSaved();
      setSave("saved");
      setTimeout(() => setSave("idle"), 2000);
    } catch {
      setSave("idle");
      toast.error("Couldn't save. Try again.");
    }
  }

  async function handlePublish() {
    if (!isAuthed) {
      router.push("/login?next=/edit");
      return;
    }
    setSave("saving");
    try {
      const id = await ensureSaved();
      if (!id) throw new Error("no card");
      await publishCard(id, true);
      setSave("idle");
      const slug = useBuilder.getState().doc.slug;
      toast.success("Card published", { description: `digitalcard.app/c/${slug}` });
    } catch {
      setSave("idle");
      toast.error("Couldn't publish. Try again.");
    }
  }

  return (
    <header className="flex h-[49px] items-center gap-3 border-b border-border bg-background px-4">
      <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
        <span className="grid h-[22px] w-[22px] place-items-center rounded-md bg-brand text-[13px] font-bold text-brand-foreground">
          d
        </span>
        digitalcard
      </div>
      <span className="text-fg-subtle">/</span>
      <span className="text-sm font-medium">{name || "Untitled"}</span>
      {save === "saved" ? (
        <span className="flex items-center gap-1.5 text-xs text-success">
          <Check className="size-3.5" />
          Saved
        </span>
      ) : save === "saving" ? (
        <span className="text-xs text-muted-foreground">Saving…</span>
      ) : null}

      <div className="flex-1" />

      <ThemeToggle />
      <Button variant="outline" size="sm" onClick={handleSave} disabled={save === "saving"}>
        <Cloud />
        Save
      </Button>
      <Button variant="outline" size="sm" onClick={onShare}>
        <Share2 />
        Share
      </Button>
      <Button variant="outline" size="sm" onClick={onShare}>
        <QrCode />
        QR
      </Button>
      <Button
        size="sm"
        className="bg-brand text-brand-foreground hover:bg-brand-hover"
        onClick={handlePublish}
        disabled={save === "saving"}
      >
        <Globe />
        Publish
      </Button>
    </header>
  );
}
