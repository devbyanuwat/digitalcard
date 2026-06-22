import "./card.css";
import type { CardBlock, CardDocument, CardTheme } from "@/lib/card/types";
import { applyCustomization, themeToCssVars } from "@/lib/card/theme-engine";
import { HeaderBlock } from "./blocks/HeaderBlock";
import { BioBlock } from "./blocks/BioBlock";
import { LinksBlock } from "./blocks/LinksBlock";
import { SocialBlock } from "./blocks/SocialBlock";
import { ContactBlock } from "./blocks/ContactBlock";
import { CtaBlock } from "./blocks/CtaBlock";
import { GalleryBlock } from "./blocks/GalleryBlock";
import { MapBlock } from "./blocks/MapBlock";
import { DividerBlock } from "./blocks/DividerBlock";
import { SpacerBlock } from "./blocks/SpacerBlock";

/**
 * Dispatch a block to its component. A switch (not a registry map) so each
 * case narrows `block` to the right type automatically.
 */
function renderBlock(block: CardBlock, theme: CardTheme) {
  switch (block.type) {
    case "header":
      return <HeaderBlock block={block} theme={theme} />;
    case "bio":
      return <BioBlock block={block} theme={theme} />;
    case "links":
      return <LinksBlock block={block} theme={theme} />;
    case "social":
      return <SocialBlock block={block} theme={theme} />;
    case "contact":
      return <ContactBlock block={block} theme={theme} />;
    case "cta":
      return <CtaBlock block={block} theme={theme} />;
    case "gallery":
      return <GalleryBlock block={block} theme={theme} />;
    case "map":
      return <MapBlock block={block} theme={theme} />;
    case "divider":
      return <DividerBlock block={block} theme={theme} />;
    case "spacer":
      return <SpacerBlock block={block} theme={theme} />;
    default:
      return null;
  }
}

export interface CardRendererProps {
  doc: CardDocument;
  theme: CardTheme;
}

/**
 * The single rendering engine. Reads a CardDocument + CardTheme, merges the
 * user's customization, projects the theme into --c-* vars, and renders the
 * visible blocks. OSS and hosted run this identical component.
 */
export function CardRenderer({ doc, theme }: CardRendererProps) {
  const resolved = applyCustomization(theme, doc.customization);

  return (
    <div
      className="dc-card"
      data-align={resolved.layout.align}
      style={themeToCssVars(resolved)}
    >
      <div className="dc-card__inner">
        {doc.blocks
          .filter((b) => b.visible)
          .map((b) => {
            const el = renderBlock(b, resolved);
            return el ? (
              <div key={b.id} className="dc-block" data-block={b.type}>
                {el}
              </div>
            ) : null;
          })}
      </div>
    </div>
  );
}
