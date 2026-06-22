"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const GRID =
  "linear-gradient(to right, var(--dc-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--dc-grid) 1px, transparent 1px)";

const SPOT = "radial-gradient(circle 200px at var(--mx, 50%) var(--my, 50%), #000 0%, transparent 72%)";

/**
 * Ambient grid that lights up around the cursor. The faint base grid is always
 * visible; a brighter brand-tinted grid + glow are masked to a circle that
 * follows the mouse. Pointer-events-none (never blocks clicks); static under
 * prefers-reduced-motion. Listens on its parent so content clicks still bubble.
 */
export function InteractiveGrid({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = parent.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    };
    parent.addEventListener("mousemove", onMove);
    return () => {
      parent.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div
        className="absolute inset-0 opacity-60"
        style={
          {
            backgroundImage: GRID,
            backgroundSize: "34px 34px",
            "--dc-grid": "color-mix(in oklab, var(--foreground) 7%, transparent)",
          } as React.CSSProperties
        }
      />
      <div
        className="absolute inset-0"
        style={
          {
            backgroundImage: GRID,
            backgroundSize: "34px 34px",
            "--dc-grid": "color-mix(in oklab, var(--brand) 55%, transparent)",
            WebkitMaskImage: SPOT,
            maskImage: SPOT,
          } as React.CSSProperties
        }
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle 240px at var(--mx, 50%) var(--my, 50%), color-mix(in oklab, var(--brand) 14%, transparent), transparent 70%)",
        }}
      />
    </div>
  );
}
