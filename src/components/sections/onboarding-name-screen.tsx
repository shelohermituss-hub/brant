"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingField } from "@/components/ui/onboarding-field";
import { PillButton } from "@/components/ui/pill-button";
import { writeOnboardingDraft } from "@/lib/onboarding-store";

export function OnboardingNameScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  function handleSubmit() {
    writeOnboardingDraft({ fullName: `${firstName} ${lastName}`.trim() });
    router.push("/onboarding/zip");
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 pt-4 pb-6">
      <h1 className="pt-6 text-[1.6rem] font-bold text-ink">Ki non ou</h1>

      <div className="flex flex-col gap-6 pt-8">
        <OnboardingField
          value={firstName}
          onChange={setFirstName}
          placeholder="Prenon"
          autoFocus
        />
        <OnboardingField
          value={lastName}
          onChange={setLastName}
          placeholder="Non fanmi"
        />
      </div>

      <div className="mt-auto pt-6">
        <PillButton
          className="w-full"
          disabled={!firstName || !lastName}
          onClick={handleSubmit}
        >
          Kontinye
        </PillButton>
      </div>
    </div>
  );
}
