"use client";

import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useBuilder } from "@/lib/card/store";
import { Field } from "../Field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

/** Card settings: public slug, page meta, and a destructive reset. */
export function SettingsTab() {
  const doc = useBuilder((s) => s.doc);
  const setSlug = useBuilder((s) => s.setSlug);
  const setMeta = useBuilder((s) => s.setMeta);
  const reset = useBuilder((s) => s.reset);

  return (
    <div className="space-y-4">
      <Field label="Link" htmlFor="s-slug" hint="Your card's public address.">
        <div className="flex h-8 w-full items-center rounded-lg border border-input bg-transparent pl-2.5 text-sm focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
          <span className="shrink-0 text-muted-foreground">digitalcard.app/c/</span>
          <Input
            id="s-slug"
            value={doc.slug}
            onChange={(e) =>
              setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))
            }
            placeholder="your-name"
            className="h-7 border-0 bg-transparent px-0.5 focus-visible:border-0 focus-visible:ring-0"
          />
        </div>
      </Field>

      <Field label="Page title" htmlFor="s-title" hint="Shown in search results and browser tabs.">
        <Input
          id="s-title"
          value={doc.meta.title}
          onChange={(e) => setMeta({ title: e.target.value })}
          placeholder="Your name — digital card"
        />
      </Field>

      <Field label="Page description" htmlFor="s-description">
        <Textarea
          id="s-description"
          value={doc.meta.description ?? ""}
          onChange={(e) => setMeta({ description: e.target.value })}
          placeholder="A short summary for search engines and link previews."
        />
      </Field>

      <Separator />

      <Field label="Danger zone" hint="This clears all blocks, theme, and meta back to the starter card.">
        <Button
          variant="outline"
          className="text-destructive"
          onClick={() => {
            reset();
            toast.success("Card reset");
          }}
        >
          <RotateCcw />
          Reset card
        </Button>
      </Field>
    </div>
  );
}
