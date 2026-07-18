"use client";

import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";
import { AssetIcon } from "@/components/ui/asset-icon";

export function GroupCreatePositionScreen() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 pt-4 pb-6">
      <button
        type="button"
        onClick={() => router.push("/group/create/contribution")}
        aria-label="Retour"
      >
        <AssetIcon name="chevron-left" className="text-ink" size={22} />
      </button>

      <h1 className="pt-6 text-[1.6rem] leading-tight font-bold text-ink">
        Pozisyon ou nan sik la
      </h1>
      <p className="pt-2 text-[0.95rem] text-ink-secondary">
        Etap 3 sou 4 — Detèmine pa skò ou, pa yon chwa lib
      </p>

      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-muted">
          <ShieldCheck className="text-ink" size={28} />
        </span>
        <p className="text-[3rem] leading-none font-bold text-ink">7</p>
        <p className="max-w-[280px] text-center text-[0.95rem] text-ink-secondary">
          Ou resevwa pot la nan mwa 7. Manm nouvo yo kòmanse nan pozisyon ki
          pita — pozisyon pi bonè yo louvri lè skò fyabilite ou monte.
        </p>
      </div>

      <div className="pt-6">
        <PillButton className="w-full" onClick={() => router.push("/group/create/review")}>
          Next
        </PillButton>
      </div>
    </div>
  );
}
