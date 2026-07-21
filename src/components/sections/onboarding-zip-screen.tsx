"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AssetIcon } from "@/components/ui/asset-icon";
import { OnboardingField } from "@/components/ui/onboarding-field";
import { PillButton } from "@/components/ui/pill-button";
import { writeOnboardingDraft } from "@/lib/onboarding-store";

export function OnboardingZipScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState("");

  function handleSubmit() {
    writeOnboardingDraft({ phone });
    router.push("/onboarding/cashtag");
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 pt-4 pb-6">
      <button
        type="button"
        onClick={() => router.push("/onboarding/name")}
        aria-label="Retou"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-border"
      >
        <AssetIcon name="chevron-left" className="text-ink" size={18} />
      </button>

      <h1 className="pt-6 text-[1.6rem] leading-tight font-bold text-ink">
        Ki nimewo MonCash ou
      </h1>
      <p className="pt-2 text-[0.95rem] text-ink-secondary">
        Se nimewo sa a n ap itilize pou peman ak vèsman ou yo.
      </p>

      <div className="mt-6 flex items-center gap-3 rounded-lg bg-surface-muted p-4">
        <span className="relative flex h-11 w-11 shrink-0 overflow-hidden rounded-full">
          <Image src="/images/icon-moncash.png" alt="" fill className="object-cover" />
        </span>
        <div className="flex flex-col">
          <span className="text-[0.95rem] font-bold text-ink">Poukisa MonCash?</span>
          <span className="text-sm text-ink-secondary">
            Se sèvis peman mobil ki pi popilè an Ayiti — li asire kotizasyon ak vèsman ou yo rive vit.
          </span>
        </div>
      </div>

      <div className="pt-8">
        <OnboardingField
          value={phone}
          onChange={setPhone}
          placeholder="Nimewo MonCash"
          type="tel"
          autoFocus
        />
      </div>

      <div className="mt-auto pt-6">
        <PillButton
          className="w-full"
          disabled={!phone}
          onClick={handleSubmit}
        >
          Kontinye
        </PillButton>
      </div>
    </div>
  );
}
