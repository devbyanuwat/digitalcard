import type { CardTheme } from "../../types";

/** Playful — warm white, coral accent, rounded shapes, chunky buttons. */
export const playful: CardTheme = {
  id: "playful",
  name: "Playful",
  tier: "oss",
  category: "playful",
  colors: {
    background: "#fffdf7",
    surface: "#ffffff",
    text: "#2b2620",
    textMuted: "#8c8579",
    accent: "#f0653b",
    accentText: "#ffffff",
    border: "#f1ead9",
  },
  background: { type: "solid", value: "#fffdf7" },
  typography: {
    fontFamily: "Gabarito",
    headingFamily: "Gabarito",
    headingWeight: 700,
    bodyWeight: 400,
    scale: "normal",
  },
  shape: { radius: 22, avatarShape: "rounded", buttonStyle: "solid" },
  effects: { shadow: "md", blur: false, border: true },
  layout: { align: "center", avatarPosition: "top", spacing: "normal" },
};
