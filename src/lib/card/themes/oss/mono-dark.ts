import type { CardTheme } from "../../types";

/** Mono Dark — near-black, off-white text, hairline borders, light accent. */
export const monoDark: CardTheme = {
  id: "mono-dark",
  name: "Mono Dark",
  tier: "oss",
  category: "dark",
  colors: {
    background: "#0f0f12",
    surface: "#141418",
    text: "#f4f4f5",
    textMuted: "#a1a1aa",
    accent: "#e8e8ec",
    accentText: "#18181b",
    border: "#2a2a30",
  },
  background: { type: "solid", value: "#0f0f12" },
  typography: {
    fontFamily: "Geist",
    headingFamily: "Geist",
    headingWeight: 600,
    bodyWeight: 400,
    scale: "normal",
  },
  shape: { radius: 12, avatarShape: "rounded", buttonStyle: "solid" },
  effects: { shadow: "none", blur: false, border: true },
  layout: { align: "center", avatarPosition: "top", spacing: "normal" },
};
