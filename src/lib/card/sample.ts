import type { CardDocument } from "./types";

/** Realistic fixture used by the demo + previews. Persona: Alex Rivera. */
export const sampleCard: CardDocument = {
  slug: "alex",
  themeId: "minimal",
  customization: {},
  blocks: [
    {
      id: "b1",
      type: "header",
      visible: true,
      data: { name: "Alex Rivera", title: "Product Designer", company: "Lumen Labs" },
    },
    {
      id: "b2",
      type: "bio",
      visible: true,
      data: {
        text: "Designing calm, precise tools for builders and professionals. Previously at Vercel and Linear.",
      },
    },
    {
      id: "b3",
      type: "social",
      visible: true,
      data: {
        items: [
          { platform: "website", url: "https://alexrivera.design" },
          { platform: "email", url: "mailto:alex@lumenlabs.io" },
          { platform: "linkedin", url: "https://linkedin.com/in/alexrivera" },
        ],
      },
    },
    {
      id: "b4",
      type: "contact",
      visible: true,
      data: {
        phone: "+1 555 0142",
        email: "alex@lumenlabs.io",
        website: "https://alexrivera.design",
      },
    },
    {
      id: "b5",
      type: "cta",
      visible: true,
      data: { label: "View my work", url: "https://alexrivera.design", style: "solid" },
    },
  ],
  meta: {
    title: "Alex Rivera — Product Designer",
    description: "Digital business card",
  },
};
