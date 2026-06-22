import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0a0a0b 0%, #1b1834 100%)",
          padding: 80,
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#6e6ade",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            d
          </div>
          <div style={{ fontSize: 36, fontWeight: 600 }}>digitalcard</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 74,
              fontWeight: 700,
              lineHeight: 1.05,
              maxWidth: 920,
              letterSpacing: -2,
            }}
          >
            Your digital business card, built your way.
          </div>
          <div style={{ fontSize: 30, color: "#a5a3c4" }}>
            Open-source builder · blocks · themes · QR &amp; vCard
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              display: "flex",
              padding: "12px 26px",
              borderRadius: 9999,
              background: "#6e6ade",
              fontSize: 26,
              fontWeight: 600,
            }}
          >
            digitalcard.app
          </div>
          <div style={{ fontSize: 24, color: "#a1a1aa" }}>Self-host or hosted</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
