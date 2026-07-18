"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PillButton } from "@/components/ui/pill-button";

export function OnboardingCashtagScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("JudySmith");

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 pt-4 pb-6">
      <h1 className="pt-6 text-[1.6rem] font-bold text-ink">Chwazi yon non itilizatè</h1>
      <p className="pt-2 text-[0.95rem] text-ink-secondary">
        Non ki idantifye ou nan gwoup sòl ou yo
      </p>

      <div className="flex items-center pt-8 text-2xl font-medium">
        <span className="text-ink">@</span>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Non itilizatè"
          autoFocus
          className="w-full border-none bg-transparent text-ink placeholder:text-placeholder focus:outline-none"
        />
      </div>

      <div className="mt-auto pt-6">
        <PillButton
          className="w-full"
          disabled={!username}
          onClick={() => router.push("/onboarding/verify-identity")}
        >
          Next
        </PillButton>
      </div>
    </div>
  );
}
