import type { CardTheme } from "../../types";

/**
 * Minimal — the default. White surface, near-black text, indigo accent,
 * circle avatar, Geist. The quiet baseline every other theme reacts against.
 */
export const minimal: CardTheme = {
  id: "minimal",
  name: "Minimal",
  tier: "oss",
  category: "minimal",
  colors: {
    background: "#ffffff",
    surface: "#ffffff",
    text: "#18181b",
    textMuted: "#71717a",
    accent: "#5b5bd6",
    accentText: "#ffffff",
    border: "#ececef",
  },
  background: { type: "solid", value: "#ffffff" },
  typography: {
    fontFamily: "Geist",
    headingFamily: "Geist",
    headingWeight: 600,
    bodyWeight: 400,
    scale: "normal",
  },
  shape: { radius: 14, avatarShape: "circle", buttonStyle: "solid" },
  effects: { shadow: "sm", blur: false, border: true },
  layout: { align: "center", avatarPosition: "top", spacing: "normal" },
};
