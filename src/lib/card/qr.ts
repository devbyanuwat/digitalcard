import QRCode from "qrcode";

export interface QrOptions {
  fg?: string;
  bg?: string;
  margin?: number;
  width?: number;
}

const opts = (o: QrOptions) => ({
  margin: o.margin ?? 2,
  width: o.width ?? 512,
  errorCorrectionLevel: "M" as const,
  color: { dark: o.fg ?? "#000000", light: o.bg ?? "#ffffff" },
});

/** PNG data URL — for the on-screen preview and PNG download. */
export function qrDataUrl(text: string, o: QrOptions = {}): Promise<string> {
  return QRCode.toDataURL(text, opts(o));
}

/** Scalable SVG markup — for the SVG download. */
export function qrSvg(text: string, o: QrOptions = {}): Promise<string> {
  return QRCode.toString(text, { type: "svg", ...opts(o) });
}

/** Trigger a browser download from a data URL or text blob. */
export function downloadBlob(filename: string, data: string, mime: string): void {
  const blob = mime.startsWith("image/") && data.startsWith("data:")
    ? dataUrlToBlob(data)
    : new Blob([data], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [head, b64] = dataUrl.split(",");
  const mime = head.match(/:(.*?);/)?.[1] ?? "image/png";
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}
