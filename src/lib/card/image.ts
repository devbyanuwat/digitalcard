/**
 * Client-only image helpers. Uploaded images become resized data URLs so they
 * persist in localStorage without blowing the ~5MB budget. Vector/animated
 * formats pass through untouched.
 */

const PASSTHROUGH = /image\/(svg\+xml|gif)/;

export async function fileToDataUrl(file: File, maxSize = 512): Promise<string> {
  const original = await readFile(file);
  if (PASSTHROUGH.test(file.type)) return original;
  try {
    return await resize(original, maxSize);
  } catch {
    return original;
  }
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function resize(dataUrl: string, maxSize: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/webp", 0.85));
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = dataUrl;
  });
}
