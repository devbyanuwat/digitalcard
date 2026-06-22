import type { CardTheme } from "../../types";

/** Glass — teal duotone backdrop with one purposeful frosted panel. */
export const glass: CardTheme = {
  id: "glass",
  name: "Glass",
  tier: "oss",
  category: "glass",
  colors: {
    background: "#123c44",
    surface: "rgba(255, 255, 255, 0.10)",
    text: "#effdff",
    textMuted: "#bfe1e6",
    accent: "#2dd4bf",
    accentText: "#04312f",
    border: "rgba(255, 255, 255, 0.20)",
  },
  background: { type: "gradient", value: "linear-gradient(155deg, #0e3b43 0%, #16707d 100%)" },
  typography: {
    fontFamily: "Manrope",
    headingFamily: "Manrope",
    headingWeight: 700,
    bodyWeight: 400,
    scale: "normal",
  },
  shape: { radius: 18, avatarShape: "circle", buttonStyle: "solid" },
  effects: { shadow: "lg", blur: true, border: true },
  layout: { align: "center", avatarPosition: "top", spacing: "normal" },
};
