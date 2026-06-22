"use client";

import type { BlockOf, SocialItem } from "@/lib/card/types";
import { useBuilder } from "@/lib/card/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

const PLATFORMS = [
  { value: "website", label: "Website" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "x", label: "X" },
  { value: "github", label: "GitHub" },
  { value: "instagram", label: "Instagram" },
  { value: "dribbble", label: "Dribbble" },
  { value: "youtube", label: "YouTube" },
  { value: "line", label: "LINE" },
  { value: "whatsapp", label: "WhatsApp" },
] as const;

/** Editor for the social block: an ordered list of { platform, url } rows. */
export function SocialForm({ block }: { block: BlockOf<"social"> }) {
  const update = useBuilder((s) => s.updateBlockData);
  const items = block.data.items;

  function setItem(index: number, patch: Partial<SocialItem>) {
    const next = items.map((item, i) => (i === index ? { ...item, ...patch } : item));
    update(block.id, { items: next });
  }

  function removeItem(index: number) {
    const next = items.filter((_, i) => i !== index);
    update(block.id, { items: next });
  }

  function addItem() {
    update(block.id, { items: [...items, { platform: "website", url: "" }] });
  }

  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="text-xs text-fg-subtle">No profiles yet.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="space-y-1.5 rounded-lg border border-border p-2.5">
              <div className="flex items-center gap-2">
                <Select
                  value={item.platform}
                  onValueChange={(value) => setItem(i, { platform: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeItem(i)}
                  aria-label="Remove profile"
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
        Add profile
      </Button>
    </div>
  );
}
