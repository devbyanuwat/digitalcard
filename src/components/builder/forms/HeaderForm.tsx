"use client";

import { useRef } from "react";
import type { BlockOf } from "@/lib/card/types";
import { useBuilder } from "@/lib/card/store";
import { fileToDataUrl } from "@/lib/card/image";
import { initials } from "@/components/card/blocks/block-props";
import { Field } from "../Field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

/**
 * Reference inspector form. Pattern for every block form:
 *  - "use client"; props { block: BlockOf<"type"> }
 *  - const update = useBuilder((s) => s.updateBlockData)  (stable action, no extra subscribe)
 *  - controlled inputs reading block.data, writing via update(block.id, { ... })
 *  - wrap fields in <Field label=…>; use shadcn primitives.
 */
export function HeaderForm({ block }: { block: BlockOf<"header"> }) {
  const update = useBuilder((s) => s.updateBlockData);
  const d = block.data;
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = async (file?: File) => {
    if (!file) return;
    update(block.id, { avatar: await fileToDataUrl(file, 400) });
  };

  return (
    <div className="space-y-4">
      <Field label="Avatar">
        <div className="flex items-center gap-3">
          <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-full bg-brand-subtle text-sm font-semibold text-brand">
            {d.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={d.avatar} alt="" className="size-full object-cover" />
            ) : (
              initials(d.name || "?")
            )}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
              <Upload />
              {d.avatar ? "Replace" : "Upload"}
            </Button>
            {d.avatar ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => update(block.id, { avatar: undefined })}
              >
                <X />
                Remove
              </Button>
            ) : null}
          </div>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            void onFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </Field>

      <Field label="Full name" htmlFor="h-name">
        <Input
          id="h-name"
          value={d.name}
          onChange={(e) => update(block.id, { name: e.target.value })}
          placeholder="Your name"
        />
      </Field>
      <Field label="Role / title" htmlFor="h-title">
        <Input
          id="h-title"
          value={d.title ?? ""}
          onChange={(e) => update(block.id, { title: e.target.value })}
          placeholder="Product Designer"
        />
      </Field>
      <Field label="Company" htmlFor="h-company">
        <Input
          id="h-company"
          value={d.company ?? ""}
          onChange={(e) => update(block.id, { company: e.target.value })}
          placeholder="Lumen Labs"
        />
      </Field>
      <Field label="Tagline" htmlFor="h-tagline" hint="One short line under your name.">
        <Input
          id="h-tagline"
          value={d.tagline ?? ""}
          onChange={(e) => update(block.id, { tagline: e.target.value })}
          placeholder="Optional"
        />
      </Field>
    </div>
  );
}
