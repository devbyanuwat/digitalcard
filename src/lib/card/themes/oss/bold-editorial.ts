import type { CardTheme } from "../../types";

/** Bold Editorial — left-aligned, oversized display name, sharp parchment. */
export const boldEditorial: CardTheme = {
  id: "bold-editorial",
  name: "Bold Editorial",
  tier: "oss",
  category: "bold",
  colors: {
    background: "#f3f0e8",
    surface: "#f3f0e8",
    text: "#1a1a17",
    textMuted: "#6f6a5d",
    accent: "#1c1c19",
    accentText: "#f3f0e8",
    border: "#ddd7c8",
  },
  background: { type: "solid", value: "#f3f0e8" },
  typography: {
    fontFamily: "Hanken Grotesk",
    headingFamily: "Big Shoulders Display",
    headingWeight: 800,
    bodyWeight: 400,
    scale: "large",
  },
  shape: { radius: 4, avatarShape: "square", buttonStyle: "solid" },
  effects: { shadow: "none", blur: false, border: true },
  layout: { align: "left", avatarPosition: "top", spacing: "normal" },
};
