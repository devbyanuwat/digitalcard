import { Globe, Link2, Mail, Phone } from "lucide-react";
import {
  SiBehance,
  SiDiscord,
  SiDribbble,
  SiFacebook,
  SiGithub,
  SiInstagram,
  SiLine,
  SiMastodon,
  SiMedium,
  SiPinterest,
  SiReddit,
  SiSpotify,
  SiSubstack,
  SiTelegram,
  SiThreads,
  SiTiktok,
  SiTwitch,
  SiWhatsapp,
  SiX,
  SiYoutube,
} from "@icons-pack/react-simple-icons";
import type { ComponentType } from "react";
import type { BlockProps } from "./block-props";
import { LinkedinIcon } from "../brand-icons";

type IconC = ComponentType<{ className?: string; color?: string }>;

/**
 * Social — a row of icon-chip links (div.dc-social > a > .dc-ic).
 * Brand platforms render real marks (simple-icons + an inline LinkedIn);
 * generic channels (website/email/phone) and unknowns fall back to lucide.
 * Every icon inherits currentColor, so chips stay on the card theme.
 */
const ICONS: Record<string, IconC> = {
  website: Globe,
  site: Globe,
  web: Globe,
  email: Mail,
  mail: Mail,
  phone: Phone,
  linkedin: LinkedinIcon,
  x: SiX,
  twitter: SiX,
  github: SiGithub,
  instagram: SiInstagram,
  dribbble: SiDribbble,
  youtube: SiYoutube,
  whatsapp: SiWhatsapp,
  line: SiLine,
  telegram: SiTelegram,
  facebook: SiFacebook,
  tiktok: SiTiktok,
  threads: SiThreads,
  mastodon: SiMastodon,
  behance: SiBehance,
  medium: SiMedium,
  pinterest: SiPinterest,
  twitch: SiTwitch,
  spotify: SiSpotify,
  reddit: SiReddit,
  discord: SiDiscord,
  substack: SiSubstack,
};

export function SocialBlock({ block }: BlockProps<"social">) {
  const { items } = block.data;

  return (
    <div className="dc-social">
      {items.map((item, i) => {
        const Icon = ICONS[item.platform.toLowerCase()] ?? Link2;
        return (
          <a
            key={`${item.platform}-${i}`}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            aria-label={item.platform}
            data-dc-track="social"
            data-dc-target={item.platform}
          >
            <Icon className="dc-ic" color="currentColor" />
          </a>
        );
      })}
    </div>
  );
}
