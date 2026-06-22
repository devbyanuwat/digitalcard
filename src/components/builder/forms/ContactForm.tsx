"use client";

import type { BlockOf } from "@/lib/card/types";
import { useBuilder } from "@/lib/card/store";
import { Field } from "../Field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm({ block }: { block: BlockOf<"contact"> }) {
  const update = useBuilder((s) => s.updateBlockData);
  const d = block.data;

  return (
    <div className="space-y-4">
      <Field label="Phone" htmlFor="c-phone">
        <Input
          id="c-phone"
          type="tel"
          value={d.phone ?? ""}
          onChange={(e) => update(block.id, { phone: e.target.value })}
          placeholder="+66 81 234 5678"
        />
      </Field>
      <Field label="Email" htmlFor="c-email">
        <Input
          id="c-email"
          type="email"
          value={d.email ?? ""}
          onChange={(e) => update(block.id, { email: e.target.value })}
          placeholder="you@example.com"
        />
      </Field>
      <Field label="Website" htmlFor="c-website">
        <Input
          id="c-website"
          type="url"
          value={d.website ?? ""}
          onChange={(e) => update(block.id, { website: e.target.value })}
          placeholder="https://example.com"
        />
      </Field>
      <Field label="LINE" htmlFor="c-line">
        <Input
          id="c-line"
          value={d.line ?? ""}
          onChange={(e) => update(block.id, { line: e.target.value })}
          placeholder="@yourline"
        />
      </Field>
      <Field
        label="Address"
        htmlFor="c-address"
        hint="Powers the Map block and your vCard download."
      >
        <Textarea
          id="c-address"
          value={d.address ?? ""}
          onChange={(e) => update(block.id, { address: e.target.value })}
          placeholder="123 Sukhumvit Rd, Bangkok 10110"
        />
      </Field>
    </div>
  );
}
