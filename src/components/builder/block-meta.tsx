import {
  AlignLeft,
  Images,
  Link2,
  MapPin,
  Minus,
  MousePointerClick,
  MoveVertical,
  Phone,
  Share2,
  User,
  type LucideIcon,
} from "lucide-react";
import type { BlockType, CardBlock } from "@/lib/card/types";

export const BLOCK_META: Record<BlockType, { label: string; icon: LucideIcon }> = {
  header: { label: "Header", icon: User },
  bio: { label: "Bio", icon: AlignLeft },
  links: { label: "Links", icon: Link2 },
  social: { label: "Social", icon: Share2 },
  contact: { label: "Contact", icon: Phone },
  cta: { label: "Call to action", icon: MousePointerClick },
  gallery: { label: "Gallery", icon: Images },
  map: { label: "Map", icon: MapPin },
  divider: { label: "Divider", icon: Minus },
  spacer: { label: "Spacer", icon: MoveVertical },
};

/** Order shown in the "Add block" picker. */
export const ADDABLE: BlockType[] = [
  "header",
  "bio",
  "links",
  "social",
  "contact",
  "cta",
  "gallery",
  "map",
  "divider",
  "spacer",
];

/** Short secondary line for a block row. */
export function blockSummary(block: CardBlock): string {
  switch (block.type) {
    case "header":
      return [block.data.name, block.data.title].filter(Boolean).join(" · ") || "Empty";
    case "bio":
      return block.data.text ? truncate(block.data.text, 32) : "Empty";
    case "links":
      return count(block.data.items.length, "link");
    case "social":
      return count(block.data.items.length, "profile");
    case "contact":
      return (
        [block.data.phone && "Call", block.data.email && "Email", "Save"]
          .filter(Boolean)
          .join(" · ") || "Empty"
      );
    case "cta":
      return block.data.label || "Button";
    case "gallery":
      return count(block.data.images.length, "image");
    case "map":
      return block.data.label || `${block.data.lat}, ${block.data.lng}`;
    case "divider":
      return "Separator line";
    case "spacer":
      return `${block.data.size.toUpperCase()} gap`;
  }
}

function count(n: number, noun: string): string {
  return `${n} ${noun}${n === 1 ? "" : "s"}`;
}

function truncate(s: string, n: number): string {
  return s.length > n ? `${s.slice(0, n)}…` : s;
}
