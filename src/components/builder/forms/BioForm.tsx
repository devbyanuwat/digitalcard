"use client";

import type { BlockOf } from "@/lib/card/types";
import { useBuilder } from "@/lib/card/store";
import { Field } from "../Field";
import { Textarea } from "@/components/ui/textarea";

export function BioForm({ block }: { block: BlockOf<"bio"> }) {
  const update = useBuilder((s) => s.updateBlockData);
  const text = block.data.text;

  return (
    <div className="space-y-4">
      <Field
        label="Bio"
        htmlFor="bio-text"
        hint={`${text.length} character${text.length === 1 ? "" : "s"}`}
      >
        <Textarea
          id="bio-text"
          value={text}
          onChange={(e) => update(block.id, { text: e.target.value })}
          placeholder="A short paragraph about you."
          rows={4}
        />
      </Field>
    </div>
  );
}
