"use client";

import type { BlockOf } from "@/lib/card/types";
import { useBuilder } from "@/lib/card/store";
import { Field } from "../Field";
import { Input } from "@/components/ui/input";

export function MapForm({ block }: { block: BlockOf<"map"> }) {
  const update = useBuilder((s) => s.updateBlockData);
  const d = block.data;

  return (
    <div className="space-y-4">
      <Field label="Label" htmlFor="m-label" hint="Shown under the map.">
        <Input
          id="m-label"
          value={d.label ?? ""}
          onChange={(e) => update(block.id, { label: e.target.value })}
          placeholder="340 Pine Street, San Francisco"
        />
      </Field>
      <Field label="Latitude" htmlFor="m-lat">
        <Input
          id="m-lat"
          type="number"
          step="any"
          value={d.lat}
          onChange={(e) => {
            const lat = parseFloat(e.target.value);
            update(block.id, { lat: Number.isNaN(lat) ? 0 : lat });
          }}
          placeholder="37.7913"
        />
      </Field>
      <Field label="Longitude" htmlFor="m-lng">
        <Input
          id="m-lng"
          type="number"
          step="any"
          value={d.lng}
          onChange={(e) => {
            const lng = parseFloat(e.target.value);
            update(block.id, { lng: Number.isNaN(lng) ? 0 : lng });
          }}
          placeholder="-122.3989"
        />
      </Field>
    </div>
  );
}
