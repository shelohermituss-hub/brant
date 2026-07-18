"use client";

import { useRouter } from "next/navigation";
import { X, ShieldCheck } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";

export function OnboardingVerifyBitcoinScreen() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col px-5 pt-4 pb-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.push("/")}
          aria-label="Fermer"
        >
          <X className="text-ink" size={26} />
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan">
          <ShieldCheck className="text-white" size={30} />
        </span>
        <p className="text-[1.3rem] leading-snug text-ink">
          To keep your account safe, verification is required to buy, send,
          and receive bitcoin on Cash App.
        </p>
      </div>

      <PillButton
        variant="cyan"
        className="w-full"
        onClick={() => router.push("/onboarding/verify-identity")}
      >
        Verify identity
      </PillButton>
    </div>
  );
}
