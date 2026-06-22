"use client";

import { useRef } from "react";
import type { BlockOf } from "@/lib/card/types";
import { useBuilder } from "@/lib/card/store";
import { fileToDataUrl } from "@/lib/card/image";
import { Field } from "../Field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Upload } from "lucide-react";

export function GalleryForm({ block }: { block: BlockOf<"gallery"> }) {
  const update = useBuilder((s) => s.updateBlockData);
  const images = block.data.images;
  const fileRef = useRef<HTMLInputElement>(null);

  const setImage = (index: number, value: string) => {
    update(block.id, { images: images.map((url, i) => (i === index ? value : url)) });
  };

  const removeImage = (index: number) => {
    update(block.id, { images: images.filter((_, i) => i !== index) });
  };

  const addImage = () => update(block.id, { images: [...images, ""] });

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const urls = await Promise.all(Array.from(files).map((f) => fileToDataUrl(f, 900)));
    update(block.id, { images: [...images, ...urls] });
  };

  return (
    <div className="space-y-4">
      <Field label="Images" hint="Upload images or paste URLs.">
        {images.length === 0 ? (
          <p className="text-xs text-fg-subtle">No images yet.</p>
        ) : (
          <div className="space-y-2">
            {images.map((url, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  value={url.startsWith("data:") ? "" : url}
                  onChange={(e) => setImage(i, e.target.value)}
                  placeholder={url.startsWith("data:") ? "Uploaded image" : "https://…"}
                  className="font-mono"
                  disabled={url.startsWith("data:")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeImage(i)}
                  aria-label="Remove image"
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Field>

      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
          <Upload />
          Upload
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={addImage}>
          <Plus />
          Add URL
        </Button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          void onFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
