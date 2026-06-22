"use client";

import { useEffect, useState } from "react";
import { CardRenderer } from "@/components/card/CardRenderer";
import { getThemes } from "@/lib/card/themes";
import { sampleCard } from "@/lib/card/sample";
import { cn } from "@/lib/utils";

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
      <div className="flex flex-col items-center gap-2.5">
        <div className="flex items-center gap-2">
          {THEMES.map((t, idx) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setI(idx)}
              aria-label={`Show ${t.name} theme`}
              aria-pressed={idx === i}
              className={cn(
                "size-3 rounded-full transition-all",
                idx === i
                  ? "ring-2 ring-foreground/20 ring-offset-2 ring-offset-background"
                  : "opacity-35 hover:opacity-100",
              )}
              style={{ background: t.colors.accent }}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          <span className="font-medium text-foreground">{theme.name}</span> theme · same card
        </p>
      </div>
    </div>
  );
}
