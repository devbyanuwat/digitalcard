import type { CardTheme, ThemeTier } from "../types";
import { minimal } from "./oss/minimal";
import { monoDark } from "./oss/mono-dark";
import { softGradient } from "./oss/soft-gradient";
import { boldEditorial } from "./oss/bold-editorial";
import { glass } from "./oss/glass";
import { playful } from "./oss/playful";

/**
 * Theme catalog. OSS themes ship in every build; hosted themes are added to
 * the catalog only on the hosted deployment. Gating is a single `tier` field —
 * no forked code.
 */
export const ossThemes: CardTheme[] = [
  minimal,
  monoDark,
  softGradient,
  boldEditorial,
  glass,
  playful,
];

export const hostedThemes: CardTheme[] = [];

export const allThemes: CardTheme[] = [...ossThemes, ...hostedThemes];

export function getThemes(tier: ThemeTier): CardTheme[] {
  return tier === "hosted" ? allThemes : ossThemes;
}

export function getTheme(id: string): CardTheme | undefined {
  return allThemes.find((t) => t.id === id);
}

export const defaultTheme = minimal;
