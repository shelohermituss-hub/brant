"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingField } from "@/components/ui/onboarding-field";
import { PillButton } from "@/components/ui/pill-button";

export function OnboardingEmailScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 pt-4 pb-6">
      <div className="flex justify-end">
        <button type="button" className="text-2xl font-medium text-ink">
          ?
        </button>
      </div>

      <h1 className="pt-6 text-[1.6rem] font-bold text-ink">Enter your email</h1>

      <div className="pt-8">
        <OnboardingField
          value={email}
          onChange={setEmail}
          placeholder="Email Address"
          type="email"
          autoFocus
        />
      </div>

      <div className="mt-auto flex gap-3 pt-6">
        <PillButton
          variant="secondary"
          className="flex-1"
          onClick={() => router.push("/home")}
        >
          Use Phone
        </PillButton>
        <PillButton
          className="flex-1"
          disabled={!email}
          onClick={() => router.push("/onboarding/code")}
        >
          Next
        </PillButton>
      </div>
    </div>
  );
}
