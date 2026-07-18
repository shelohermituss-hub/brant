"use client";

import { useRouter } from "next/navigation";
import { PillButton } from "@/components/ui/pill-button";
import { AssetIcon } from "@/components/ui/asset-icon";

export function GroupCreateContributionScreen() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 pt-4 pb-6">
      <button
        type="button"
        onClick={() => router.push("/group/create/amount")}
        aria-label="Retour"
      >
        <AssetIcon name="chevron-left" className="text-ink" size={22} />
      </button>

      <h1 className="pt-6 text-[1.6rem] leading-tight font-bold text-ink">
        Kotizasyon mansyèl ou
      </h1>
      <p className="pt-2 text-[0.95rem] text-ink-secondary">
        Etap 2 sou 4 — Pot la separe sou 10 mwa
      </p>

      <div className="flex flex-1 flex-col items-center justify-center gap-2">
        <p className="text-[3.5rem] leading-none font-bold text-green-bright">5 000 HTG</p>
        <p className="text-[0.95rem] text-ink-secondary">chak mwa, pandan 10 mwa</p>
      </div>

      <div className="pt-6">
        <PillButton className="w-full" onClick={() => router.push("/group/create/position")}>
          Next
        </PillButton>
      </div>
    </div>
  );
}
