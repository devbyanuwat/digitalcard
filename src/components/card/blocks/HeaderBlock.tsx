import type { BlockProps } from "./block-props";
import { initials } from "./block-props";

/**
 * Header — avatar + name + title + company + tagline.
 * Reference block: other blocks follow this shape (typed props, card.css
 * classes, --c-* vars, alignment from theme). No hardcoded colors.
 */
export function HeaderBlock({ block }: BlockProps<"header">) {
  const { avatar, name, title, company, tagline } = block.data;

  return (
    <header className="dc-header">
      {avatar ? (
        // User-uploaded data URL / arbitrary URL — plain img by design (no next/image config needed for self-hosters).
        // eslint-disable-next-line @next/next/no-img-element
        <img className="dc-avatar" src={avatar} alt={name} />
      ) : (
        <div className="dc-avatar" aria-hidden="true">
          {initials(name)}
        </div>
      )}
      <div className="dc-header-group" style={{ marginTop: "var(--c-gap)" }}>
        <h1 className="dc-name">{name}</h1>
        {title ? <p className="dc-role">{title}</p> : null}
        {company ? <p className="dc-company">{company}</p> : null}
        {tagline ? <p className="dc-tagline">{tagline}</p> : null}
      </div>
    </header>
  );
}
