"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PillButton } from "@/components/ui/pill-button";
import { AssetIcon } from "@/components/ui/asset-icon";
import { AmountSlider } from "@/components/ui/amount-slider";
import { StepProgressBar } from "@/components/ui/step-progress-bar";
import { OnboardingField } from "@/components/ui/onboarding-field";
import { readGroupCreateDraft, writeGroupCreateDraft } from "@/lib/group-create-store";

const MIN_AMOUNT = 10_000;
const MAX_AMOUNT = 200_000;

export function GroupCreateAmountScreen() {
  const router = useRouter();
  const [name, setName] = useState(() => readGroupCreateDraft().name ?? "");
  const [amount, setAmount] = useState(() => readGroupCreateDraft().potAmount ?? 50_000);

  function handleNext() {
    writeGroupCreateDraft({ name: name.trim(), potAmount: amount });
    router.push("/group/create/duration");
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 pt-4 pb-6">
      <div className="flex items-center justify-between pb-6">
        <button type="button" onClick={() => router.push("/home")} aria-label="Fermer">
          <AssetIcon name="cross" className="text-ink" size={22} />
        </button>
      </div>

      <StepProgressBar step={1} total={5} label="Non ak montan pot la" />

      <h1 className="pt-6 text-[1.6rem] leading-tight font-bold text-ink">
        Kijan ou vle rele sik la?
      </h1>

      <div className="pt-4">
        <OnboardingField
          value={name}
          onChange={setName}
          placeholder="Non gwoup la (egzanp: Sòl Fanmi)"
          autoFocus
        />
      </div>

      <h1 className="pt-8 text-[1.6rem] leading-tight font-bold text-ink">
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
        <PillButton className="w-full" disabled={!name.trim()} onClick={handleNext}>
          Next
        </PillButton>
      </div>
    </div>
  );
}
