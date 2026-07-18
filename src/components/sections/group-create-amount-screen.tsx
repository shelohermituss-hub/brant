"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PillButton } from "@/components/ui/pill-button";
import { AssetIcon } from "@/components/ui/asset-icon";
import { AmountSlider } from "@/components/ui/amount-slider";
import { StepProgressBar } from "@/components/ui/step-progress-bar";

const MIN_AMOUNT = 10_000;
const MAX_AMOUNT = 200_000;

export function GroupCreateAmountScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState(50_000);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 pt-4 pb-6">
      <div className="flex items-center justify-between pb-6">
        <button type="button" onClick={() => router.push("/home")} aria-label="Fermer">
          <AssetIcon name="cross" className="text-ink" size={22} />
        </button>
      </div>

      <StepProgressBar step={1} total={5} label="Montan pot la" />

      <h1 className="pt-6 text-[1.6rem] leading-tight font-bold text-ink">
        Konbyen ou vle nan pot la?
      </h1>

      <div className="pt-8">
        <AmountSlider
          label="Montan pot la"
          value={amount}
          min={MIN_AMOUNT}
          max={MAX_AMOUNT}
          step={1000}
          onChange={setAmount}
        />
      </div>

      <div className="mt-auto pt-6">
        <PillButton
          className="w-full"
          onClick={() => router.push("/group/create/duration")}
        >
          Next
        </PillButton>
      </div>
    </div>
  );
}
