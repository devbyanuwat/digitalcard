"use client";

import { Plus, RotateCcw } from "lucide-react";
import type { Align, AvatarShape, Spacing } from "@/lib/card/types";
import { useBuilder } from "@/lib/card/store";
import { getTheme, defaultTheme } from "@/lib/card/themes";
import { Field } from "../Field";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ACCENTS = [
  { name: "Indigo", value: "#5b5bd6" },
  { name: "Blue", value: "#2563eb" },
  { name: "Emerald", value: "#059669" },
  { name: "Rose", value: "#e11d48" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Violet", value: "#7c3aed" },
];

const FONTS = ["Geist", "Hanken Grotesk", "Onest", "Manrope", "Gabarito", "Sora"];

const AVATAR_SHAPES: { value: AvatarShape; label: string }[] = [
  { value: "circle", label: "Circle" },
  { value: "rounded", label: "Rounded" },
  { value: "square", label: "Square" },
];

const ALIGNS: { value: Align; label: string }[] = [
  { value: "center", label: "Center" },
  { value: "left", label: "Left" },
];

const SPACINGS: { value: Spacing; label: string }[] = [
  { value: "compact", label: "Compact" },
  { value: "normal", label: "Normal" },
  { value: "roomy", label: "Roomy" },
];

/** Parse a #rrggbb hex into [r, g, b] in 0-255, or null if not a valid hex. */
function parseHex(hex: string): [number, number, number] | null {
  const m = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Relative luminance per WCAG 2.1. */
function luminance([r, g, b]: [number, number, number]): number {
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Contrast ratio between two #rrggbb hex colors, or null if either is invalid. */
function contrastRatio(hex1: string, hex2: string): number | null {
  const a = parseHex(hex1);
  const b = parseHex(hex2);
  if (!a || !b) return null;
  const l1 = luminance(a);
  const l2 = luminance(b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function StyleTab() {
  const themeId = useBuilder((s) => s.doc.themeId);
  const c = useBuilder((s) => s.doc.customization);
  const setC = useBuilder((s) => s.setCustomization);
  const resetC = useBuilder((s) => s.resetCustomization);

  const theme = getTheme(themeId) ?? defaultTheme;

  const accent = c.accent ?? theme.colors.accent;
  const fontFamily = c.fontFamily ?? theme.typography.fontFamily;
  const radius = c.radius ?? theme.shape.radius;
  const avatarShape = c.avatarShape ?? theme.shape.avatarShape;
  const align = c.align ?? theme.layout.align;
  const spacing = c.spacing ?? theme.layout.spacing;

  const ratio = contrastRatio(accent, "#ffffff");
  const pass = ratio !== null && ratio >= 4.5;

  return (
    <div className="space-y-4">
      <Field label="Accent color">
        <div className="flex flex-wrap items-center gap-2">
          {ACCENTS.map((a) => {
            const selected = accent.toLowerCase() === a.value.toLowerCase();
            return (
              <button
                key={a.value}
                type="button"
                aria-label={a.name}
                aria-pressed={selected}
                onClick={() => setC({ accent: a.value })}
                style={{ background: a.value }}
                className={
                  "size-6 rounded-md border border-border-strong/30 outline-none transition-transform hover:scale-110 focus-visible:ring-3 focus-visible:ring-ring/50" +
                  (selected ? " ring-2 ring-ring ring-offset-2 ring-offset-background" : "")
                }
              />
            );
          })}
          <label className="inline-flex h-6 cursor-pointer items-center gap-1 rounded-md border border-dashed border-border-strong bg-secondary px-2 text-xs font-medium text-muted-foreground transition-colors hover:border-ring hover:text-foreground">
            <Plus className="size-3" />
            Custom
            <input
              type="color"
              value={parseHex(accent) ? accent : "#5b5bd6"}
              onChange={(e) => setC({ accent: e.target.value })}
              className="sr-only"
              aria-label="Custom accent color"
            />
          </label>
        </div>
      </Field>

      <Separator />

      <Field label="Font">
        <Select value={fontFamily} onValueChange={(v) => setC({ fontFamily: v })}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select font" />
          </SelectTrigger>
          <SelectContent>
            {FONTS.map((f) => (
              <SelectItem key={f} value={f}>
                {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Separator />

      <Field label="Corner radius">
        <div className="flex items-center gap-3">
          <Slider
            min={0}
            max={28}
            step={1}
            value={[radius]}
            onValueChange={(v) => setC({ radius: v[0] })}
            aria-label="Corner radius"
          />
          <span className="min-w-10 text-right font-mono text-xs text-muted-foreground">
            {radius}px
          </span>
        </div>
      </Field>

      <Separator />

      <Field label="Avatar shape">
        <div className="grid grid-cols-3 gap-1.5">
          {AVATAR_SHAPES.map((s) => (
            <Button
              key={s.value}
              type="button"
              size="sm"
              variant={avatarShape === s.value ? "secondary" : "outline"}
              aria-pressed={avatarShape === s.value}
              onClick={() => setC({ avatarShape: s.value })}
            >
              {s.label}
            </Button>
          ))}
        </div>
      </Field>

      <Separator />

      <Field label="Content align">
        <div className="grid grid-cols-2 gap-1.5">
          {ALIGNS.map((a) => (
            <Button
              key={a.value}
              type="button"
              size="sm"
              variant={align === a.value ? "secondary" : "outline"}
              aria-pressed={align === a.value}
              onClick={() => setC({ align: a.value })}
            >
              {a.label}
            </Button>
          ))}
        </div>
      </Field>

      <Separator />

      <Field label="Spacing">
        <div className="grid grid-cols-3 gap-1.5">
          {SPACINGS.map((s) => (
            <Button
              key={s.value}
              type="button"
              size="sm"
              variant={spacing === s.value ? "secondary" : "outline"}
              aria-pressed={spacing === s.value}
              onClick={() => setC({ spacing: s.value })}
            >
              {s.label}
            </Button>
          ))}
        </div>
      </Field>

      <Separator />

      <Field label="Live contrast check" hint="Adjust the accent until the sample passes AA. The renderer uses this color for buttons and links.">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 flex-1 items-center justify-center rounded-md text-sm font-medium text-white"
            style={{ background: accent }}
          >
            Aa sample
          </div>
          {ratio !== null ? (
            <span
              className={
                "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium " +
                (pass
                  ? "bg-success/10 text-success"
                  : "bg-destructive/10 text-destructive")
              }
            >
              {ratio.toFixed(1)}:1 {pass ? "AA" : "Fail"}
            </span>
          ) : (
            <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-muted-foreground">
              No check
            </span>
          )}
        </div>
      </Field>

      <Separator />

      <Button type="button" variant="ghost" size="sm" onClick={() => resetC()}>
        <RotateCcw />
        Reset to theme
      </Button>
    </div>
  );
}
