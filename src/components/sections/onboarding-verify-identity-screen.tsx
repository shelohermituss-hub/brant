"use client";

import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";
import { AssetIcon } from "@/components/ui/asset-icon";

export function OnboardingVerifyIdentityScreen() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 pt-4 pb-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.push("/home")}
          aria-label="Fermer"
        >
          <AssetIcon name="cross" className="text-ink" size={22} />
        </button>
      </div>

      <span className="mt-6 flex h-14 w-14 items-center justify-center rounded-md bg-green">
        <Shield className="text-white" size={26} />
      </span>

      <h1 className="pt-6 text-[1.6rem] leading-tight font-bold text-ink">
        Verify your identity with a photo of your ID and face to continue
      </h1>

      <p className="pt-4 text-[0.95rem] text-ink-secondary">
        All photos are encrypted so your information stays private.
      </p>

      <div className="mt-auto flex flex-col gap-6">
        <p className="text-center text-[0.85rem] text-ink-secondary">
          By tapping &quot;Continue&quot;, you allow Cash App&apos;s partners
          to analyze your facial biometrics and photos for identity
          verification and agree to the{" "}
          <span className="text-green">
            following privacy and retention policies
          </span>
          .
        </p>

        <PillButton className="w-full" onClick={() => router.push("/home")}>
          Continue
        </PillButton>
      </div>
    </div>
  );
}
