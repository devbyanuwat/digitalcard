"use client";

import { useEffect } from "react";

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Per page-load guard so React StrictMode (dev) doesn't double-count a view.
const logged = new Set<string>();

function post(body: Record<string, unknown>) {
  try {
    void fetch(`${SB_URL}/rest/v1/rpc/log_card_event`, {
      method: "POST",
      keepalive: true, // survive tel:/mailto: navigation
      headers: {
        apikey: SB_KEY,
        Authorization: `Bearer ${SB_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch {
    // analytics is best-effort; never break the page
  }
}

function detectDevice(): string {
  const ua = navigator.userAgent;
  if (/iPad|Tablet/i.test(ua)) return "tablet";
  if (/Mobi|Android|iPhone/i.test(ua)) return "mobile";
  return "desktop";
}

function hostToSource(host: string): string {
  host = host.replace(/^www\./, "");
  if (/line\.me|liff/.test(host)) return "line";
  if (/facebook|fb\.com|fb\.me|l\.facebook/.test(host)) return "facebook";
  if (/instagram/.test(host)) return "instagram";
  if (/t\.co|twitter|x\.com/.test(host)) return "x";
  if (/linkedin|lnkd\.in/.test(host)) return "linkedin";
  if (/t\.me|telegram/.test(host)) return "telegram";
  if (/whatsapp|wa\.me/.test(host)) return "whatsapp";
  if (/google\./.test(host)) return "google";
  return host || "other";
}

function detectSource(): { source: string; referrer: string } {
  const params = new URLSearchParams(window.location.search);
  const explicit = params.get("src") || params.get("utm_source");
  const ref = document.referrer || "";
  if (explicit) return { source: explicit.toLowerCase().slice(0, 40), referrer: ref };
  if (!ref) return { source: "direct", referrer: "" };
  try {
    return { source: hostToSource(new URL(ref).hostname), referrer: ref };
  } catch {
    return { source: "other", referrer: ref };
  }
}

/** Invisible tracker mounted on the public card page. */
export function CardAnalytics({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `view:${slug}`;
    if (!logged.has(key)) {
      logged.add(key);
      const { source, referrer } = detectSource();
      post({
        p_slug: slug,
        p_type: source === "qr" ? "qr" : "view",
        p_source: source,
        p_referrer: referrer,
        p_device: detectDevice(),
      });
    }

    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.("[data-dc-track]") as HTMLElement | null;
      if (!el) return;
      const { source } = detectSource();
      post({
        p_slug: slug,
        p_type: el.getAttribute("data-dc-track") || "link",
        p_source: source,
        p_device: detectDevice(),
        p_target: el.getAttribute("data-dc-target") || undefined,
      });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [slug]);

  return null;
}
