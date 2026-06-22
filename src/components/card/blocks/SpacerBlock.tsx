import type { BlockProps } from "./block-props";

/**
 * Spacer — vertical breathing room between blocks. Height comes from the
 * block size token (sm/md/lg). Presentational only, hidden from a11y tree.
 */
export function SpacerBlock({ block }: BlockProps<"spacer">) {
  const h = { sm: 8, md: 20, lg: 40 }[block.data.size];

  return <div aria-hidden="true" style={{ height: h }} />;
}
