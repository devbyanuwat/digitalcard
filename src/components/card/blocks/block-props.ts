import type { BlockOf, BlockType, CardTheme } from "@/lib/card/types";

/**
 * Contract every block component implements. The renderer passes the typed
 * block plus the already-resolved theme (customization merged). Colors come
 * from the scoped --c-* CSS vars (see card.css); the `theme` object is for
 * structural decisions (avatar shape, button style, alignment).
 */
export interface BlockProps<T extends BlockType> {
  block: BlockOf<T>;
  theme: CardTheme;
}

/** Initials fallback for avatars without an image. */
export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/** Map theme button style to the card.css modifier class. */
export function btnClass(theme: CardTheme): string {
  return `dc-btn dc-btn--${theme.shape.buttonStyle}`;
}
