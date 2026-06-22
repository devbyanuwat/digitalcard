"use client";

import { useEffect, useState } from "react";
import { Copy, Download, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useBuilder } from "@/lib/card/store";
import { qrDataUrl, qrSvg, downloadBlob } from "@/lib/card/qr";
import { downloadVCard } from "@/lib/card/vcard";
import { Field } from "./Field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Share dialog — QR preview, copyable link, and download/save actions.
 * Derived actions (PNG/SVG/vCard) read the doc; nothing is persisted here.
 */
export function ShareDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const doc = useBuilder((s) => s.doc);
  const shareUrl = "https://digitalcard.app/c/" + doc.slug;
  // QR encodes ?src=qr so scans are attributable in analytics (link copy stays clean).
  const qrUrl = shareUrl + "?src=qr";
  const [dataUrl, setDataUrl] = useState("");

  useEffect(() => {
    let active = true;
    qrDataUrl(qrUrl, { width: 240 }).then((url) => {
      if (active) setDataUrl(url);
    });
    return () => {
      active = false;
    };
  }, [qrUrl]);

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied");
  };

  const downloadPng = async () => {
    const url = await qrDataUrl(qrUrl, { width: 1024 });
    downloadBlob(doc.slug + ".png", url, "image/png");
  };

  const downloadSvg = async () => {
    const svg = await qrSvg(qrUrl);
    downloadBlob(doc.slug + ".svg", svg, "image/svg+xml");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share card</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="flex size-[232px] items-center justify-center rounded-xl border border-border bg-background p-4">
              {dataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={dataUrl}
                  width={200}
                  height={200}
                  alt="QR code"
                  className="block"
                />
              ) : (
                <div className="size-[200px] animate-pulse rounded-lg bg-secondary" />
              )}
            </div>
          </div>

          <Field label="Share link" htmlFor="share-link">
            <div className="flex gap-1.5">
              <Input
                id="share-link"
                readOnly
                value={shareUrl}
                className="font-mono"
              />
              <Button variant="outline" onClick={copyLink}>
                <Copy />
                Copy
              </Button>
            </div>
          </Field>

          <Separator />

          <div className="flex flex-wrap gap-1.5">
            <Button onClick={downloadPng}>
              <Download />
              Download PNG
            </Button>
            <Button variant="outline" onClick={downloadSvg}>
              <Download />
              Download SVG
            </Button>
            <Button variant="ghost" onClick={() => downloadVCard(doc)}>
              <UserPlus />
              Save contact
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
