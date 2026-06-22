import { MapPin } from "lucide-react";
import type { BlockProps } from "./block-props";

/**
 * Map — styled map placeholder with a centered pin and an address line.
 * The dc-map class draws the grid background and frame; the address falls
 * back to the lat/lng pair when no label is provided. No hardcoded colors.
 */
export function MapBlock({ block }: BlockProps<"map">) {
  const { lat, lng, label } = block.data;

  return (
    <div>
      <div className="dc-map">
        <MapPin className="dc-map__pin" />
      </div>
      <div className="dc-address" style={{ marginTop: "var(--c-gap)" }}>
        <MapPin className="dc-ic" />
        <span>{label ?? `${lat}, ${lng}`}</span>
      </div>
    </div>
  );
}
