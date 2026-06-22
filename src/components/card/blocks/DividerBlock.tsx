import type { BlockProps } from "./block-props";

/**
 * Divider — a thin hairline rule between sections.
 * No data field; renders a single styled <hr> using --c-border via card.css.
 */
export function DividerBlock(props: BlockProps<"divider">) {
  void props;
  return <hr className="dc-divider" />;
}
