"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingField } from "@/components/ui/onboarding-field";
import { PillButton } from "@/components/ui/pill-button";

export function OnboardingZipScreen() {
  const router = useRouter();
  const [zip, setZip] = useState("");

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 pt-4 pb-6">
      <h1 className="pt-6 text-[1.6rem] leading-tight font-bold text-ink">
        Please enter your ZIP Code
      </h1>

      <div className="pt-8">
        <OnboardingField
          value={zip}
          onChange={setZip}
          placeholder="ZIP Code"
          autoFocus
        />
      </div>

      <div className="mt-auto pt-6">
        <PillButton
          className="w-full"
          disabled={!zip}
          onClick={() => router.push("/onboarding/cashtag")}
        >
          Next
        </PillButton>
      </div>
    </div>
  );
}
