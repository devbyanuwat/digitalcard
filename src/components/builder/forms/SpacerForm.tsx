"use client";

import type { BlockOf } from "@/lib/card/types";
import { useBuilder } from "@/lib/card/store";
import { Field } from "../Field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SpacerForm({ block }: { block: BlockOf<"spacer"> }) {
  const update = useBuilder((s) => s.updateBlockData);
  const d = block.data;

  return (
    <div className="space-y-4">
      <Field label="Gap size" htmlFor="sp-size">
        <Select
          value={d.size}
          onValueChange={(size) =>
            update(block.id, { size: size as "sm" | "md" | "lg" })
          }
        >
          <SelectTrigger id="sp-size" className="w-full">
            <SelectValue placeholder="Select a size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sm">Small</SelectItem>
            <SelectItem value="md">Medium</SelectItem>
            <SelectItem value="lg">Large</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </div>
  );
}
