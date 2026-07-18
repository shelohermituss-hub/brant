"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PillButton } from "@/components/ui/pill-button";

export function OnboardingCashtagScreen() {
  const router = useRouter();
  const [cashtag, setCashtag] = useState("JudySmith");

  return (
    <div className="flex flex-1 flex-col px-5 pt-4 pb-6">
      <h1 className="pt-6 text-[1.6rem] font-bold text-ink">Choose a $Cashtag</h1>
      <p className="pt-2 text-[0.95rem] text-ink-secondary">
        Your unique name for getting paid by anyone
      </p>

      <div className="flex items-center pt-8 text-2xl font-medium">
        <span className="text-ink">$</span>
        <input
          value={cashtag}
          onChange={(e) => setCashtag(e.target.value)}
          placeholder="Cashtag"
          autoFocus
          className="w-full border-none bg-transparent text-ink placeholder:text-placeholder focus:outline-none"
        />
      </div>

      {cashtag && (
        <p className="pt-2 text-[0.95rem] text-ink-secondary">
          cash.app/${cashtag}
        </p>
      )}

      <div className="mt-auto pt-6">
        <PillButton
          className="w-full"
          disabled={!cashtag}
          onClick={() => router.push("/onboarding/verify-bitcoin")}
        >
          Next
        </PillButton>
      </div>
    </div>
  );
}
