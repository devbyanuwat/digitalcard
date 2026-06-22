import { Download, Globe, Mail, Phone } from "lucide-react";
import type { BlockProps } from "./block-props";

/**
 * Contact — a stack of contact action buttons built from block.data.
 * Call (accent) and Email render only when present; "Save contact" is always
 * offered (maps to vCard export later). An optional website link follows.
 * No hardcoded colors: classes read the --c-* vars from card.css.
 */
export function ContactBlock({ block }: BlockProps<"contact">) {
  const { phone, email, website } = block.data;

  return (
    <div className="dc-actions">
      {phone ? (
        <a className="dc-btn dc-btn--solid" href={"tel:" + phone} data-dc-track="call">
          <Phone className="dc-ic" />
          Call
        </a>
      ) : null}
      {email ? (
        <a className="dc-btn dc-btn--outline" href={"mailto:" + email} data-dc-track="email">
          <Mail className="dc-ic" />
          Email
        </a>
      ) : null}
      <a className="dc-btn dc-btn--outline" href="#" data-dc-track="save_contact">
        <Download className="dc-ic" />
        Save contact
      </a>
      {website ? (
        <a
          className="dc-btn dc-btn--ghost"
          href={website}
          target="_blank"
          rel="noreferrer noopener"
          data-dc-track="website"
        >
          <Globe className="dc-ic" />
          Website
        </a>
      ) : null}
    </div>
  );
}
