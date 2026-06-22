"use client";

import type { BlockOf } from "@/lib/card/types";
import { useBuilder } from "@/lib/card/store";
import { Field } from "../Field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CtaForm({ block }: { block: BlockOf<"cta"> }) {
  const update = useBuilder((s) => s.updateBlockData);
  const d = block.data;

  return (
    <div className="space-y-4">
      <Field label="Button label" htmlFor="cta-label">
        <Input
          id="cta-label"
          value={d.label}
          onChange={(e) => update(block.id, { label: e.target.value })}
          placeholder="Get in touch"
        />
      </Field>
      <Field label="URL" htmlFor="cta-url">
        <Input
          id="cta-url"
          type="url"
          value={d.url}
          onChange={(e) => update(block.id, { url: e.target.value })}
          placeholder="https://example.com"
        />
      </Field>
      <Field label="Style" htmlFor="cta-style">
        <Select
          value={d.style}
          onValueChange={(value) =>
            update(block.id, { style: value as BlockOf<"cta">["data"]["style"] })
          }
        >
          <SelectTrigger id="cta-style" className="w-full">
            <SelectValue placeholder="Select a style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solid">Solid</SelectItem>
            <SelectItem value="outline">Outline</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </div>
  );
}
