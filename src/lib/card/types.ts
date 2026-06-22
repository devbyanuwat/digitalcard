/**
 * digitalcard — domain model.
 * A card is data: an ordered list of blocks + a theme id + customization overrides.
 * One renderer reads this; OSS and hosted differ only by which themes are in the catalog.
 * See design-system/DESIGN_SYSTEM.md sections 4 and 5.
 */

/* -------------------------------------------------------------------------- */
/* Theme                                                                       */
/* -------------------------------------------------------------------------- */

export type ThemeTier = "oss" | "hosted";

export type ThemeCategory =
  | "minimal"
  | "bold"
  | "gradient"
  | "dark"
  | "glass"
  | "playful"
  | "pro";

export type BackgroundType = "solid" | "gradient" | "pattern" | "image";
export type AvatarShape = "circle" | "rounded" | "square";
export type ButtonStyle = "solid" | "outline" | "soft" | "ghost";
export type ShadowLevel = "none" | "sm" | "md" | "lg";
export type TypeScale = "compact" | "normal" | "large";
export type Spacing = "compact" | "normal" | "roomy";
export type Align = "center" | "left";

export interface CardTheme {
  id: string;
  name: string;
  tier: ThemeTier;
  category: ThemeCategory;
  /** Optional preview image path for the gallery. */
  thumbnail?: string;

  colors: {
    /** Page/card backdrop (solid fallback; see `background` for gradient/image). */
    background: string;
    /** Inner surface for sections/buttons. */
    surface: string;
    text: string;
    textMuted: string;
    accent: string;
    accentText: string;
    border: string;
  };

  background: {
    type: BackgroundType;
    /** A CSS value: color, gradient, pattern id, or image url. */
    value: string;
  };

  typography: {
    /** Google Font family name, e.g. "Geist", "Hanken Grotesk". */
    fontFamily: string;
    /** Optional family for headings/display; falls back to fontFamily. */
    headingFamily?: string;
    headingWeight: number;
    bodyWeight: number;
    scale: TypeScale;
  };

  shape: {
    /** Card + control corner radius in px. */
    radius: number;
    avatarShape: AvatarShape;
    buttonStyle: ButtonStyle;
  };

  effects: {
    shadow: ShadowLevel;
    /** Glassmorphism surfaces (backdrop blur). */
    blur: boolean;
    /** Hairline border on surfaces. */
    border: boolean;
  };

  layout: {
    align: Align;
    avatarPosition: "top" | "left";
    spacing: Spacing;
  };
}

/**
 * A partial set of overrides the user applies in the Style tab.
 * Merged onto the active theme at render time (see applyCustomization).
 */
export interface CardCustomization {
  accent?: string;
  fontFamily?: string;
  radius?: number;
  avatarShape?: AvatarShape;
  align?: Align;
  spacing?: Spacing;
}

/* -------------------------------------------------------------------------- */
/* Blocks                                                                      */
/* -------------------------------------------------------------------------- */

export interface SocialItem {
  platform: string;
  url: string;
}

export interface LinkItem {
  label: string;
  url: string;
  /** lucide icon name, optional. */
  icon?: string;
}

interface BlockBase {
  id: string;
  visible: boolean;
}

export interface HeaderBlock extends BlockBase {
  type: "header";
  data: {
    avatar?: string;
    name: string;
    title?: string;
    company?: string;
    tagline?: string;
  };
}

export interface BioBlock extends BlockBase {
  type: "bio";
  data: { text: string };
}

export interface LinksBlock extends BlockBase {
  type: "links";
  data: { items: LinkItem[] };
}

export interface SocialBlock extends BlockBase {
  type: "social";
  data: { items: SocialItem[] };
}

export interface ContactBlock extends BlockBase {
  type: "contact";
  data: {
    phone?: string;
    email?: string;
    website?: string;
    address?: string;
    line?: string;
  };
}

export interface CtaBlock extends BlockBase {
  type: "cta";
  data: { label: string; url: string; style: "solid" | "outline" };
}

export interface GalleryBlock extends BlockBase {
  type: "gallery";
  data: { images: string[] };
}

export interface MapBlock extends BlockBase {
  type: "map";
  data: { lat: number; lng: number; label?: string };
}

export interface DividerBlock extends BlockBase {
  type: "divider";
}

export interface SpacerBlock extends BlockBase {
  type: "spacer";
  data: { size: "sm" | "md" | "lg" };
}

export type CardBlock =
  | HeaderBlock
  | BioBlock
  | LinksBlock
  | SocialBlock
  | ContactBlock
  | CtaBlock
  | GalleryBlock
  | MapBlock
  | DividerBlock
  | SpacerBlock;

export type BlockType = CardBlock["type"];

/** Narrow a block to a specific type. */
export type BlockOf<T extends BlockType> = Extract<CardBlock, { type: T }>;

/* -------------------------------------------------------------------------- */
/* Document                                                                    */
/* -------------------------------------------------------------------------- */

export interface CardDocument {
  slug: string;
  themeId: string;
  customization: CardCustomization;
  blocks: CardBlock[];
  meta: {
    title: string;
    description?: string;
    ogImage?: string;
  };
}
