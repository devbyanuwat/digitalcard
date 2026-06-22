import type { BlockProps } from "./block-props";

/**
 * Gallery — a 3-column grid of image tiles. Each tile fills with its image
 * via backgroundImage; empty data renders 3 soft placeholder tiles (the
 * default tile background comes from --c-* vars in card.css).
 */
export function GalleryBlock({ block }: BlockProps<"gallery">) {
  const { images } = block.data;
  const tiles = images.length > 0 ? images : ["", "", ""];

  return (
    <div className="dc-gallery">
      {tiles.map((img, i) => (
        <div
          key={i}
          className="dc-gallery__tile"
          style={{ backgroundImage: img ? `url(${img})` : undefined }}
        />
      ))}
    </div>
  );
}
