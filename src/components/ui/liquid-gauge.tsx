import { cn } from "@/lib/utils";

interface LiquidGaugeProps {
  paid: number;
  total: number;
  label: string;
  className?: string;
}

/**
 * Jauge liquide (modèle 05 "Balans Vivan" du moodboard
 * cycle_concepts_10.html) — niveau qui ondule pour montrer une
 * progression. Utilisée pour l'avancement des cotisations du mois en
 * cours sur group-detail-screen.
 */
export function LiquidGauge({ paid, total, label, className }: LiquidGaugeProps) {
  const ratio = total > 0 ? Math.min(1, Math.max(0, paid / total)) : 0;
  const fillHeight = 10 + ratio * 78;

  return (
    <div
      className={cn(
        "relative mx-auto h-[150px] w-[130px] overflow-hidden rounded-[24px] border-[2.5px] border-ink bg-surface",
        className
      )}
    >
      <div className="absolute inset-x-[-10%] bottom-0" style={{ height: `${fillHeight}%` }}>
        <svg viewBox="0 0 400 60" preserveAspectRatio="none" className="liquid-wave-svg h-full w-[200%]">
          <path d="M0 30 Q50 10 100 30 T200 30 T300 30 T400 30 V60 H0 Z" fill="var(--color-green)" />
          <path d="M400 30 Q450 10 500 30 T600 30 T700 30 T800 30 V60 H400 Z" fill="var(--color-green)" />
        </svg>
      </div>

      <div className="absolute inset-x-0 top-4 z-[1] text-center">
        <p className="text-[1.05rem] leading-none font-bold text-ink">
          {paid}/{total}
        </p>
        <p className="mt-1 text-[0.6rem] font-bold tracking-wide text-ink-secondary uppercase">{label}</p>
      </div>
    </div>
  );
}
