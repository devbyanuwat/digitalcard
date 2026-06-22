"use client";

import type { BlockOf, LinkItem } from "@/lib/card/types";
import { useBuilder } from "@/lib/card/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

/** Editor for the links block: an ordered list of { label, url } rows. */
export function LinksForm({ block }: { block: BlockOf<"links"> }) {
  const update = useBuilder((s) => s.updateBlockData);
  const items = block.data.items;

  function setItem(index: number, patch: Partial<LinkItem>) {
    const next = items.map((item, i) => (i === index ? { ...item, ...patch } : item));
    update(block.id, { items: next });
  }

  function removeItem(index: number) {
    const next = items.filter((_, i) => i !== index);
    update(block.id, { items: next });
  }

  function addItem() {
    update(block.id, { items: [...items, { label: "", url: "" }] });
  }

  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="text-xs text-fg-subtle">No links yet.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="space-y-1.5 rounded-lg border border-border p-2.5">
              <div className="flex items-center gap-2">
                <Input
                  value={item.label}
                  onChange={(e) => setItem(i, { label: e.target.value })}
                  placeholder="Label"
                />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeItem(i)}
                  aria-label="Remove link"
                >
                  <Trash2 />
                </Button>
              </div>
              <Input
                value={item.url}
                onChange={(e) => setItem(i, { url: e.target.value })}
                placeholder="https://…"
                type="url"
                className="font-mono text-xs"
              />
            </div>
          ))}
        </div>
      )}
      <Button variant="outline" size="sm" onClick={addItem}>
        <Plus />
        Add link
      </Button>
    </div>
  );
}
