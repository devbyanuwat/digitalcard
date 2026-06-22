"use client";

import { useState } from "react";
import { Copy, Download, Maximize2, Minus, Plus, QrCode } from "lucide-react";
import { toast } from "sonner";
import { useBuilder } from "@/lib/card/store";
import { getTheme, defaultTheme } from "@/lib/card/themes";
import { downloadVCard } from "@/lib/card/vcard";
import { CardRenderer } from "@/components/card/CardRenderer";
import { cn } from "@/lib/utils";

const DEVICES = [
  { id: "phone", label: "Phone", w: 390 },
  { id: "tablet", label: "Tablet", w: 620 },
  { id: "desktop", label: "Desktop", w: 820 },
] as const;

export function Playground({ onShare }: { onShare: () => void }) {
  const doc = useBuilder((s) => s.doc);
  const theme = getTheme(doc.themeId) ?? defaultTheme;

  const [device, setDevice] = useState<(typeof DEVICES)[number]["id"]>("phone");
  const [zoom, setZoom] = useState(100);
  const frameW = DEVICES.find((d) => d.id === device)!.w;

  const copyLink = () => {
    void navigator.clipboard?.writeText(`https://digitalcard.app/c/${doc.slug}`);
    toast.success("Link copied");
  };

  return (
    <main className="flex min-h-0 flex-col bg-background">
      <div className="flex items-center gap-3 border-b border-border px-4 py-2">
        <div className="inline-flex gap-0.5 rounded-md border border-border bg-secondary p-0.5">
          {DEVICES.map((d) => (
            <button
              key={d.id}
              type="button"
              aria-pressed={device === d.id}
              onClick={() => setDevice(d.id)}
              className={cn(
                "rounded px-3 py-1 text-[13px] font-medium transition-colors",
                device === d.id
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
          <IconBtn label="Zoom out" onClick={() => setZoom((z) => Math.max(50, z - 10))}>
            <Minus className="size-3.5" />
          </IconBtn>
          <span className="w-9 text-center tabular-nums">{zoom}%</span>
          <IconBtn label="Zoom in" onClick={() => setZoom((z) => Math.min(150, z + 10))}>
            <Plus className="size-3.5" />
          </IconBtn>
        </div>
      </div>

      <div
        className="relative min-h-0 flex-1 overflow-auto"
        style={{
          backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      >
        <div className="grid min-h-full place-items-center p-12">
          <div
            style={{ width: frameW, transform: `scale(${zoom / 100})` }}
            className="flex origin-top justify-center transition-[width] duration-200"
          >
            <CardRenderer doc={doc} theme={theme} />
          </div>
        </div>

        <div className="sticky bottom-6 mx-auto flex w-fit items-center gap-0.5 rounded-full border border-border bg-background p-1 shadow-md">
          <IconBtn label="Copy link" onClick={copyLink}>
            <Copy className="size-4" />
          </IconBtn>
          <IconBtn label="QR code" onClick={onShare}>
            <QrCode className="size-4" />
          </IconBtn>
          <IconBtn label="Save contact (vCard)" onClick={() => downloadVCard(doc)}>
            <Download className="size-4" />
          </IconBtn>
          <span className="mx-1 h-4 w-px bg-border" />
          <IconBtn label="Open public page" onClick={onShare}>
            <Maximize2 className="size-4" />
          </IconBtn>
        </div>
      </div>
    </main>
  );
}

function IconBtn({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
    >
      {children}
    </button>
  );
}
