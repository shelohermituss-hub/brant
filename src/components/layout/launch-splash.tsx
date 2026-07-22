"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

const DOT_COUNT = 8;
const RADIUS = 34;

const DOTS = Array.from({ length: DOT_COUNT }, (_, i) => {
  const angle = (i / DOT_COUNT) * 2 * Math.PI - Math.PI / 2;
  return {
    index: i,
    x: Math.cos(angle) * RADIUS,
    y: Math.sin(angle) * RADIUS,
  };
});

const VISIBLE_MS = 1300;
const FADE_MS = 250;

export function LaunchSplash() {
  const [phase, setPhase] = useState<"visible" | "fading" | "hidden">("visible");

  useEffect(() => {
    const fadeTimer = setTimeout(() => setPhase("fading"), VISIBLE_MS);
    const hideTimer = setTimeout(() => setPhase("hidden"), VISIBLE_MS + FADE_MS);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      aria-hidden="true"
      className={cn(
        // Blanc fixe (pas bg-surface) : doit matcher exactement le
        // background_color du manifest pour un enchaînement invisible
        // avec le splash natif généré par l'OS avant que React n'hydrate.
        "absolute inset-0 z-50 flex items-center justify-center bg-white transition-opacity ease-[var(--ease-out)]",
        phase === "fading" ? "opacity-0" : "opacity-100"
      )}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <div className="relative h-24 w-24 rounded-[22%] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
        {DOTS.map((dot) => (
          <span
            key={dot.index}
            className="splash-dot absolute h-3 w-3 rounded-full"
            style={
              {
                left: `calc(50% + ${dot.x}px - 6px)`,
                top: `calc(50% + ${dot.y}px - 6px)`,
                "--dot-index": dot.index,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}
