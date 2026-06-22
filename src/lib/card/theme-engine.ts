import type { CSSProperties } from "react";
import type { CardTheme, CardCustomization, Spacing, TypeScale } from "./types";

/**
 * Merge user overrides onto a theme. Customization is a partial; only the
 * fields the user touched in the Style tab win. Returns a new CardTheme.
 */
export function applyCustomization(
  theme: CardTheme,
  c: CardCustomization = {},
): CardTheme {
  return {
    ...theme,
    colors: {
      ...theme.colors,
      accent: c.accent ?? theme.colors.accent,
    },
    typography: {
      ...theme.typography,
      fontFamily: c.fontFamily ?? theme.typography.fontFamily,
    },
    shape: {
      ...theme.shape,
      radius: c.radius ?? theme.shape.radius,
      avatarShape: c.avatarShape ?? theme.shape.avatarShape,
    },
    layout: {
      ...theme.layout,
      align: c.align ?? theme.layout.align,
      spacing: c.spacing ?? theme.layout.spacing,
    },
  };
}

const SPACING_FACTOR: Record<Spacing, number> = {
  compact: 0.8,
  normal: 1,
  roomy: 1.28,
};

const SCALE_FACTOR: Record<TypeScale, number> = {
  compact: 0.94,
  normal: 1,
  large: 1.12,
};

const SHADOW_VALUE: Record<CardTheme["effects"]["shadow"], string> = {
  none: "none",
  sm: "0 1px 3px rgb(0 0 0 / 0.08), 0 1px 2px rgb(0 0 0 / 0.05)",
  md: "0 6px 22px rgb(0 0 0 / 0.10)",
  lg: "0 20px 50px rgb(0 0 0 / 0.18)",
};

const AVATAR_RADIUS: Record<CardTheme["shape"]["avatarShape"], string> = {
  circle: "9999px",
  rounded: "20%",
  square: "0px",
};

/**
 * Project a resolved theme into the `--c-*` custom properties the card
 * renderer and every block component read. Card vars are intentionally
 * separate from the builder chrome tokens — the card is its own world.
 */
export function themeToCssVars(theme: CardTheme): CSSProperties {
  const spacing = SPACING_FACTOR[theme.layout.spacing];
  const scale = SCALE_FACTOR[theme.typography.scale];
  const headingFamily = theme.typography.headingFamily ?? theme.typography.fontFamily;

  const vars: Record<string, string> = {
    "--c-bg": theme.background.value || theme.colors.background,
    "--c-bg-solid": theme.colors.background,
    "--c-surface": theme.colors.surface,
    "--c-text": theme.colors.text,
    "--c-muted": theme.colors.textMuted,
    "--c-accent": theme.colors.accent,
    "--c-accent-text": theme.colors.accentText,
    "--c-border": theme.colors.border,

    "--c-radius": `${theme.shape.radius}px`,
    "--c-radius-sm": `${Math.max(0, theme.shape.radius - 4)}px`,
    "--c-avatar-radius": AVATAR_RADIUS[theme.shape.avatarShape],

    "--c-font": `"${theme.typography.fontFamily}", system-ui, sans-serif`,
    "--c-font-heading": `"${headingFamily}", system-ui, sans-serif`,
    "--c-weight-body": String(theme.typography.bodyWeight),
    "--c-weight-heading": String(theme.typography.headingWeight),

    "--c-shadow": SHADOW_VALUE[theme.effects.shadow],
    "--c-gap": `${Math.round(16 * spacing)}px`,
    "--c-pad": `${Math.round(28 * spacing)}px`,
    "--c-scale": String(scale),
    "--c-border-width": theme.effects.border ? "1px" : "0px",
    "--c-blur": theme.effects.blur ? "16px" : "0px",
    /* A frame (mat) appears only for non-solid backdrops so the inner surface reads as a card. */
    "--c-frame": theme.background.type === "solid" ? "0px" : "18px",
  };

  return vars as CSSProperties;
}

/**
 * Build a Google Fonts stylesheet URL covering a theme's families/weights.
 * Used to lazily inject web fonts for whatever themes are on screen.
 */
export function googleFontHref(theme: CardTheme): string {
  const families = new Set<string>();
  const weights = [theme.typography.bodyWeight, theme.typography.headingWeight];
  const spec = (family: string) =>
    `family=${family.replace(/ /g, "+")}:wght@${[...new Set(weights)]
      .sort((a, b) => a - b)
      .join(";")}`;
  families.add(spec(theme.typography.fontFamily));
  if (theme.typography.headingFamily) families.add(spec(theme.typography.headingFamily));
  return `https://fonts.googleapis.com/css2?${[...families].join("&")}&display=swap`;
}

/** Collect a de-duplicated set of font hrefs for many themes. */
export function collectFontHrefs(themes: CardTheme[]): string[] {
  return [...new Set(themes.map(googleFontHref))];
}
