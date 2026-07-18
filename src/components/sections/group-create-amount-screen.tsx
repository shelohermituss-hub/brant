"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PillButton } from "@/components/ui/pill-button";
import { AssetIcon } from "@/components/ui/asset-icon";
import { cn } from "@/lib/utils";

const POT_PRESETS = ["10 000", "25 000", "50 000", "100 000", "200 000"];

export function GroupCreateAmountScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState("50 000");

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 pt-4 pb-6">
      <button type="button" onClick={() => router.push("/home")} aria-label="Fermer">
        <AssetIcon name="cross" className="text-ink" size={22} />
      </button>

      <h1 className="pt-6 text-[1.6rem] leading-tight font-bold text-ink">
        Konbyen ou vle nan pot la?
      </h1>
      <p className="pt-2 text-[0.95rem] text-ink-secondary">
        Etap 1 sou 4 — Montan pot la, an HTG
      </p>

      <div className="flex flex-col gap-3 pt-8">
        {POT_PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setSelected(preset)}
            className={cn(
              "flex h-14 items-center justify-center rounded-md text-lg font-bold",
              selected === preset ? "bg-green text-white" : "bg-surface-muted text-ink"
            )}
          >
            {preset} HTG
          </button>
        ))}
      </div>

      <div className="mt-auto pt-6">
        <PillButton
          className="w-full"
          onClick={() => router.push("/group/create/contribution")}
        >
          Next
        </PillButton>
      </div>
    </div>
  );
}
