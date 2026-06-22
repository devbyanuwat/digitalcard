"use client";

import { Check } from "lucide-react";
import { useBuilder } from "@/lib/card/store";
import { ossThemes } from "@/lib/card/themes";
import type { CardTheme } from "@/lib/card/types";

/**
 * Theme picker tab. Renders the OSS theme catalog as a 2-col grid of
 * selectable cards. Each card shows a mini preview built purely from the
 * theme DATA (inline styles — those values are theme data, not chrome) plus
 * the theme name and a category badge. Clicking a card sets the active theme.
 */
export function ThemeTab() {
  const themeId = useBuilder((s) => s.doc.themeId);
  const setTheme = useBuilder((s) => s.setTheme);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {ossThemes.map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            selected={theme.id === themeId}
            onSelect={() => setTheme(theme.id)}
          />
        ))}
      </div>
      <p className="text-xs text-fg-subtle">
        More themes ship with the hosted plan.
      </p>
    </div>
  );
}

function ThemeCard({
  theme,
  selected,
  onSelect,
}: {
  theme: CardTheme;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`group flex flex-col overflow-hidden rounded-lg border bg-background text-left transition-colors hover:border-border-strong focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-subtle ${
        selected
          ? "border-brand ring-[3px] ring-brand-subtle"
          : "border-border"
      }`}
    >
      <ThemePreview theme={theme} selected={selected} />
      <div className="flex items-center justify-between gap-2 p-2">
        <span className="truncate text-sm font-medium text-foreground">
          {theme.name}
        </span>
        <span className="flex-none rounded-full border border-border px-2 py-0.5 text-xs capitalize text-muted-foreground">
          {theme.category}
        </span>
      </div>
    </button>
  );
}

/** Mini card preview rendered from theme data via inline styles. */
function ThemePreview({
  theme,
  selected,
}: {
  theme: CardTheme;
  selected: boolean;
}) {
  const surface = theme.background.value || theme.colors.background;
  return (
    <div
      className="relative flex h-24 flex-col items-center justify-center gap-1.5 px-4"
      style={{ background: surface }}
    >
      {selected ? (
        <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-brand-foreground">
          <Check className="h-2.5 w-2.5" strokeWidth={3} />
        </span>
      ) : null}
      <span
        className="h-7 w-7 rounded-full"
        style={{ background: theme.colors.accent }}
      />
      <span
        className="h-1.5 w-16 rounded-full"
        style={{ background: theme.colors.text, opacity: 0.85 }}
      />
      <span
        className="h-1 w-11 rounded-full"
        style={{ background: theme.colors.text, opacity: 0.45 }}
      />
    </div>
  );
}
