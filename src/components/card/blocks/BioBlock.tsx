import type { BlockProps } from "./block-props";

/**
 * Bio — a single paragraph of free text.
 * Styling comes from the .dc-bio class (card.css) and the scoped --c-* vars;
 * no hardcoded colors. Theme unused: layout/typography are handled by CSS.
 */
export function BioBlock({ block }: BlockProps<"bio">) {
  return <p className="dc-bio">{block.data.text}</p>;
}
