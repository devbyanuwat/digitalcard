import type {
  CardDocument,
  ContactBlock,
  HeaderBlock,
  SocialBlock,
} from "./types";

/** Escape a value per the vCard text rules. */
function esc(value: string): string {
  return value.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
}

/**
 * Build a vCard 3.0 string from the header + contact + social blocks.
 * vCard export is a derived action, not a block (see DESIGN_SYSTEM.md).
 */
export function buildVCard(doc: CardDocument): string {
  const header = doc.blocks.find((b): b is HeaderBlock => b.type === "header");
  const contact = doc.blocks.find((b): b is ContactBlock => b.type === "contact");
  const socials = doc.blocks
    .filter((b): b is SocialBlock => b.type === "social")
    .flatMap((b) => b.data.items);

  const name = header?.data.name?.trim() || "Contact";
  const [given, ...rest] = name.split(/\s+/);
  const family = rest.join(" ");

  const lines = ["BEGIN:VCARD", "VERSION:3.0", `FN:${esc(name)}`, `N:${esc(family)};${esc(given)};;;`];

  if (header?.data.title) lines.push(`TITLE:${esc(header.data.title)}`);
  if (header?.data.company) lines.push(`ORG:${esc(header.data.company)}`);
  if (contact?.data.phone) lines.push(`TEL;TYPE=CELL:${esc(contact.data.phone)}`);
  if (contact?.data.email) lines.push(`EMAIL;TYPE=INTERNET:${esc(contact.data.email)}`);
  if (contact?.data.website) lines.push(`URL:${esc(contact.data.website)}`);
  if (contact?.data.address) lines.push(`ADR;TYPE=WORK:;;${esc(contact.data.address)};;;;`);
  for (const s of socials) lines.push(`URL:${esc(s.url)}`);

  lines.push("END:VCARD");
  return lines.join("\r\n");
}

/** Trigger a .vcf download in the browser. */
export function downloadVCard(doc: CardDocument): void {
  const blob = new Blob([buildVCard(doc)], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${doc.slug || "card"}.vcf`;
  a.click();
  URL.revokeObjectURL(url);
}
