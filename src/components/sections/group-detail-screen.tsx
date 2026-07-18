"use client";

import { useRouter } from "next/navigation";
import { WonnPath, type WonnMember } from "@/components/ui/wonn-path";
import { PillButton } from "@/components/ui/pill-button";
import { AssetIcon } from "@/components/ui/asset-icon";

const MEMBERS: WonnMember[] = [
  { position: 1, status: "paid" },
  { position: 2, status: "paid" },
  { position: 3, status: "paid" },
  { position: 4, status: "paid" },
  { position: 5, status: "paid" },
  { position: 6, status: "wait" },
  { position: 7, status: "upcoming" },
  { position: 8, status: "upcoming" },
  { position: 9, status: "upcoming" },
  { position: 10, status: "upcoming" },
];

const INFO_ROWS = [
  { label: "Kotizasyon mansyèl", value: "5 000 HTG" },
  { label: "Pwochen vèsman", value: "15 out 2026" },
  { label: "Estati gwoup", value: "Aktif" },
];

export function GroupDetailScreen() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="flex items-center justify-between px-4 pt-4">
        <button type="button" onClick={() => router.push("/home")} aria-label="Retour">
          <AssetIcon name="chevron-left" className="text-ink" size={22} />
        </button>
        <span className="text-lg font-bold text-ink">Sòl Fanmi</span>
        <span className="w-[22px]" />
      </div>

      <WonnPath
        members={MEMBERS}
        beneficiaryPosition={6}
        potAmount="50 000 HTG"
        beneficiaryName="Sara D."
      />

      <div className="flex flex-col gap-4 px-5 pt-4 pb-6">
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
