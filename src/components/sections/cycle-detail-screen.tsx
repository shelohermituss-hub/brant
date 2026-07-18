"use client";

import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";
import { AssetIcon } from "@/components/ui/asset-icon";
import { cn } from "@/lib/utils";

const TOTAL_SIK = 10;
const CURRENT_SIK = 6;

const INFO_ROWS = [
  { label: "Pot", value: "50 000 HTG" },
  { label: "Kotizasyon mansyèl", value: "5 000 HTG" },
  { label: "Pozisyon ou", value: "6 sou 10" },
];

export function CycleDetailScreen() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="px-4 pt-4">
        <button type="button" onClick={() => router.push("/stocks")} aria-label="Retour">
          <AssetIcon name="chevron-left" className="text-ink" size={22} />
        </button>
      </div>

      <div className="flex flex-col gap-2 px-5 pt-3 pb-2">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-muted">
          <Users className="text-ink" size={26} />
        </span>
        <span className="text-xl font-bold text-ink">Pwochen sik</span>
        <span className="text-[0.95rem] font-medium text-ink-secondary">
          Sik {CURRENT_SIK} sou {TOTAL_SIK} — an kou
        </span>
      </div>

      <div className="flex gap-1.5 px-5 pt-4 pb-2">
        {Array.from({ length: TOTAL_SIK }, (_, i) => i + 1).map((sik) => (
          <span
            key={sik}
            className={cn(
              "h-2 flex-1 rounded-full",
              sik < CURRENT_SIK
                ? "bg-green"
                : sik === CURRENT_SIK
                  ? "bg-green-bright"
                  : "bg-surface-muted"
            )}
          />
        ))}
      </div>
      <p className="px-5 pb-6 text-sm text-ink-secondary">
        {CURRENT_SIK - 1} sou {TOTAL_SIK} sik konplete
      </p>

      <div className="flex flex-col gap-4 px-5 pb-8">
        {INFO_ROWS.map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <span className="text-[0.95rem] text-ink-secondary">{row.label}</span>
            <span className="text-[0.95rem] font-bold text-ink">{row.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto flex gap-3 px-4 pb-6">
        <PillButton
          variant="primary"
          className="flex-1"
          onClick={() => router.push("/stocks/cycle/buy")}
        >
          Peye kotizasyon
        </PillButton>
      </div>
    </div>
  );
}
