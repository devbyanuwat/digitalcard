import type { CardTheme } from "../../types";

/** Soft Gradient — warm peach-to-rose backdrop framing a white card. */
export const softGradient: CardTheme = {
  id: "soft-gradient",
  name: "Soft Gradient",
  tier: "oss",
  category: "gradient",
  colors: {
    background: "#fff5f1",
    surface: "#ffffff",
    text: "#3a2b30",
    textMuted: "#9b7d84",
    accent: "#e85d75",
    accentText: "#ffffff",
    border: "#f3e6e8",
  },
  background: { type: "gradient", value: "linear-gradient(160deg, #ffe1d0 0%, #ffd2de 100%)" },
  typography: {
    fontFamily: "Hanken Grotesk",
    headingFamily: "Hanken Grotesk",
    headingWeight: 700,
    bodyWeight: 400,
    scale: "normal",
  },
  shape: { radius: 18, avatarShape: "rounded", buttonStyle: "solid" },
  effects: { shadow: "md", blur: false, border: true },
  layout: { align: "center", avatarPosition: "top", spacing: "roomy" },
};
