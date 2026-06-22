/** Single source of truth for site identity — used by metadata, schema, footer. */
export const site = {
  name: "digitalcard",
  title: "digitalcard — open-source digital business card builder",
  tagline: "Your digital business card, built your way.",
  description:
    "Build a free digital business card in minutes. digitalcard is an open-source builder: compose blocks, pick a theme, and share by QR code or link. Self-host it or use the hosted version.",
  // Canonical production origin (placeholder — change to your deployed domain).
  url: "https://digitalcard.app",
  github: "https://github.com/digitalcard/digitalcard",
  twitter: "@digitalcard",
  keywords: [
    "digital business card",
    "digital card builder",
    "open source business card",
    "QR business card",
    "vCard",
    "link in bio",
    "virtual business card",
    "digital name card",
    "self-hosted business card",
  ],
} as const;

/** Entities the brand is "the same as" — strengthens the entity graph for GEO. */
export const socialProfiles = [site.github, "https://twitter.com/digitalcard"];
