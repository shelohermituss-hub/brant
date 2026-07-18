"use client";

import { useRouter } from "next/navigation";
import { PillButton } from "@/components/ui/pill-button";
import { AssetIcon } from "@/components/ui/asset-icon";

const ROWS = [
  { label: "Pot", value: "50 000 HTG" },
  { label: "Kotizasyon mansyèl", value: "5 000 HTG" },
  { label: "Pozisyon ou", value: "7 sou 10" },
  { label: "Angajman", value: "Prelèvman otomatik chak mwa" },
];

export function GroupCreateReviewScreen() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-5 pt-4 pb-6">
      <button
        type="button"
        onClick={() => router.push("/group/create/position")}
        aria-label="Retour"
      >
        <AssetIcon name="chevron-left" className="text-ink" size={22} />
      </button>

      <div className="flex flex-col gap-1">
        <h1 className="text-[1.6rem] font-bold text-ink">Konfime patisipasyon ou</h1>
        <p className="text-sm font-medium tracking-wide text-ink-secondary uppercase">
          Sòl Fanmi
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {ROWS.map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <span className="text-[0.95rem] text-ink-secondary">{row.label}</span>
            <span className="text-[0.95rem] font-bold text-ink">{row.value}</span>
          </div>
        ))}
      </div>

      <p className="mt-auto text-center text-sm text-ink-secondary">
        Lè ou konfime, ou antre reyèlman nan gwoup la ak angajman prelèvman
        chak mwa jiskaske ou resevwa pot ou.
      </p>

      <PillButton variant="primary" className="w-full" onClick={() => router.push("/home")}>
        Konfime
      </PillButton>
    </div>
  );
}
