"use client";

import { useEffect, useState } from "react";

interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getRemaining(target: Date): Remaining {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

const UNITS: { key: keyof Remaining; label: string }[] = [
  { key: "days", label: "Jou" },
  { key: "hours", label: "Èdtan" },
  { key: "minutes", label: "Min" },
  { key: "seconds", label: "Sek" },
];

interface PaymentCountdownProps {
  targetDate: Date;
}

/**
 * Minuteur temps réel avant la prochaine échéance de paiement. Le calcul
 * dépend de Date.now(), donc il ne s'exécute jamais côté serveur : l'état
 * initial reste vide jusqu'au montage client, pour éviter tout mismatch
 * d'hydration entre le rendu serveur et le premier rendu client.
 */
export function PaymentCountdown({ targetDate }: PaymentCountdownProps) {
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    const tick = () => setRemaining(getRemaining(targetDate));
    const id = setInterval(tick, 1000);
    const timeout = setTimeout(tick, 0);
    return () => {
      clearInterval(id);
      clearTimeout(timeout);
    };
  }, [targetDate]);

  return (
    <div className="flex gap-2">
      {UNITS.map(({ key, label }) => (
        <div
          key={key}
          className="flex flex-1 flex-col items-center gap-1 rounded-md bg-surface-muted py-2"
        >
          <span
            key={remaining ? remaining[key] : "idle"}
            className="countdown-tick text-lg font-bold text-ink"
          >
            {remaining ? String(remaining[key]).padStart(2, "0") : "--"}
          </span>
          <span className="text-[0.65rem] text-ink-secondary">{label}</span>
        </div>
      ))}
    </div>
  );
}
