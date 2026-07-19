"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";

export function PasswordChangedScreen() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-5 pb-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green">
        <Check className="text-white" size={28} strokeWidth={3} />
      </span>

      <h1 className="pt-6 text-[1.75rem] font-bold text-ink">Modpas chanje</h1>
      <p className="pt-2 text-[0.95rem] text-ink-secondary">
        Modpas ou chanje avèk siksè
      </p>

      <div className="w-full pt-8">
        <PillButton className="w-full" onClick={() => router.push("/onboarding/signin")}>
          Tounen konekte
        </PillButton>
      </div>
    </div>
  );
}
