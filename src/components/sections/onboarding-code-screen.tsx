"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingField } from "@/components/ui/onboarding-field";
import { PillButton } from "@/components/ui/pill-button";

export function OnboardingCodeScreen() {
  const router = useRouter();
  const [code, setCode] = useState("");

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 pt-4 pb-6">
      <div className="flex justify-end">
        <button type="button" className="text-2xl font-medium text-ink">
          ?
        </button>
      </div>

      <h1 className="pt-6 text-[1.6rem] leading-tight font-bold text-ink">
        Please enter the code sent to judy.mobbin@gmail.com
      </h1>

      <div className="pt-8">
        <OnboardingField
          value={code}
          onChange={setCode}
          placeholder="Confirmation Code"
          autoFocus
        />
      </div>

      <div className="mt-auto pt-6">
        <PillButton
          className="w-full"
          disabled={!code}
          onClick={() => router.push("/onboarding/name")}
        >
          Next
        </PillButton>
      </div>
    </div>
  );
}
