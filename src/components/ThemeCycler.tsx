"use client";

import { useEffect, useState } from "react";
import { CardRenderer } from "@/components/card/CardRenderer";
import { getThemes } from "@/lib/card/themes";
import { sampleCard } from "@/lib/card/sample";

const THEMES = getThemes("oss");

/**
 * Hero spectacle: the same card auto-cycling through every theme, proving the
 * theme-as-data engine at a glance. Pauses for prefers-reduced-motion.
 */
export function ThemeCycler() {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((p) => (p + 1) % THEMES.length), 2600);
    return () => clearInterval(id);
  }, []);

  const theme = THEMES[i];

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex h-[540px] w-full items-center justify-center">
        <div key={theme.id} className="animate-in fade-in zoom-in-95 duration-700 ease-out">
          <CardRenderer doc={sampleCard} theme={theme} />
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm" aria-live="polite">
        <span
          className="size-2 rounded-full transition-colors"
          style={{ background: theme.colors.accent }}
          aria-hidden="true"
        />
        <span className="font-medium">{theme.name}</span>
        <span className="text-fg-subtle">
          · {i + 1} / {THEMES.length} themes
        </span>
      </div>
    </div>
  );
}
