import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number;
  max?: number;
  label: string;
  className?: string;
}

const RADIUS = 78;
const ARC_LENGTH = Math.PI * RADIUS;
const ARC_D = "M17 100 A78 78 0 0 1 173 100";

/**
 * Jauge en demi-cercle (modèle 03 "Woulèt" du moodboard
 * cycle_concepts_10.html) — se remplit une fois au chargement,
 * métaphore compteur pour le score de fiabilité.
 */
export function ScoreGauge({ score, max = 100, label, className }: ScoreGaugeProps) {
  const ratio = max > 0 ? Math.min(1, Math.max(0, score / max)) : 0;
  const offset = ARC_LENGTH * (1 - ratio);

  return (
    <div className={cn("relative mx-auto flex w-[190px] flex-col items-center", className)}>
      <svg viewBox="0 0 190 110" className="w-full">
        <path d={ARC_D} fill="none" stroke="var(--color-border-strong)" strokeWidth={14} strokeLinecap="round" />
        <path
          d={ARC_D}
          fill="none"
          stroke="var(--color-green)"
          strokeWidth={14}
          strokeLinecap="round"
          strokeDasharray={ARC_LENGTH}
          className="score-gauge-arc"
          style={{ "--gauge-length": ARC_LENGTH, "--gauge-offset": offset } as CSSProperties}
        />
      </svg>
      <div className="-mt-10 flex flex-col items-center">
        <span className="text-[1.3rem] leading-none font-extrabold text-ink">
          {score}/{max}
        </span>
        <span className="mt-1 text-[0.6rem] font-bold tracking-wide text-ink-secondary uppercase">{label}</span>
      </div>
    </div>
  );
}
