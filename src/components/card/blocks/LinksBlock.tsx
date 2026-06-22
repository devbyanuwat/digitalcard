import { ChevronRight, Globe, Link2, Mail, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { BlockProps } from "./block-props";

/**
 * Links — link-in-bio style list of full-width rows.
 * Each item is an external link: leading icon (by name), label, trailing
 * chevron. Classes + --c-* vars only; no hardcoded colors (see HeaderBlock).
 */
const ICONS: Record<string, LucideIcon> = {
  globe: Globe,
  mail: Mail,
  phone: Phone,
  link: Link2,
};

export function LinksBlock({ block }: BlockProps<"links">) {
  const { items } = block.data;

  return (
    <div className="dc-links">
      {items.map((item, i) => {
        const Icon = (item.icon && ICONS[item.icon]) || Link2;
        return (
          <a
            key={`${item.url}-${i}`}
            className="dc-link"
            href={item.url}
            target="_blank"
            rel="noreferrer"
            data-dc-track="link"
            data-dc-target={item.label || item.url}
          >
            <Icon className="dc-ic" />
            <span className="dc-link__label">{item.label}</span>
            <ChevronRight className="dc-ic" />
          </a>
        );
      })}
    </div>
  );
}
