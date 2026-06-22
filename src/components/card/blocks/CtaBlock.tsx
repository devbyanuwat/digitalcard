import { ArrowUpRight } from "lucide-react";
import type { BlockProps } from "./block-props";

/**
 * CTA — one full-width call-to-action button (solid or outline).
 * Style comes from block data; colors/radius from the --c-* vars via card.css.
 */
export function CtaBlock({ block }: BlockProps<"cta">) {
  const { label, url, style } = block.data;

  return (
    <a
      className={"dc-btn " + (style === "outline" ? "dc-btn--outline" : "dc-btn--solid")}
      href={url}
      target="_blank"
      rel="noreferrer"
      data-dc-track="cta"
      data-dc-target={label}
    >
      <ArrowUpRight className="dc-ic" />
      {label}
    </a>
  );
}
