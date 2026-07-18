"use client";

import { useRouter } from "next/navigation";
import { PillButton } from "@/components/ui/pill-button";
import { AssetIcon } from "@/components/ui/asset-icon";

const ROWS = [
  { label: "Metòd peman", value: "MonCash" },
  { label: "Sik", value: "6 sou 10" },
  { label: "Kotizasyon", value: "5 000 HTG" },
];

const TOTAL_ROWS = [
  { label: "Kotizasyon", value: "5 000 HTG" },
  { label: "Frè kolèkt (0,5 %)", value: "25 HTG" },
  { label: "Total", value: "5 025 HTG" },
];

export function CyclePaymentReviewScreen() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-5 pt-4 pb-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.push("/stocks/cycle")}
          aria-label="Fermer"
        >
          <AssetIcon name="cross" className="text-ink" size={20} />
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-[1.6rem] font-bold text-ink">Konfime kotizasyon</h1>
        <p className="text-sm font-medium tracking-wide text-ink-secondary uppercase">
          Peman imedya
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {ROWS.map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <span className="text-[0.95rem] text-ink-secondary">{row.label}</span>
            <span className="text-[0.95rem] text-ink-secondary">{row.value}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {TOTAL_ROWS.map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <span className="text-[0.95rem] text-ink-secondary">{row.label}</span>
            <span className="text-[0.95rem] text-ink-secondary">{row.value}</span>
          </div>
        ))}
      </div>

      <p className="mt-auto text-center text-sm text-ink-secondary">
        Yon resi ak referans MonCash ap voye ba ou apre konfimasyon.
      </p>

      <PillButton
        variant="primary"
        className="w-full"
        onClick={() => router.push("/stocks/cycle")}
      >
        Konfime
      </PillButton>
    </div>
  );
}
