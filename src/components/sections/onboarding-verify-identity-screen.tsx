"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";
import { AssetIcon } from "@/components/ui/asset-icon";
import { createClient } from "@/lib/supabase/client";
import { clearOnboardingDraft, readOnboardingDraft } from "@/lib/onboarding-store";

export function OnboardingVerifyIdentityScreen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleContinue() {
    setIsSubmitting(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setIsSubmitting(false);
      router.replace("/onboarding/email");
      return;
    }

    const draft = readOnboardingDraft();
    const { error: insertError } = await supabase.from("users").upsert(
      {
        id: user.id,
        full_name: draft.fullName ?? "",
        phone: draft.phone ?? "",
        moncash_number: draft.phone ?? "",
      },
      { onConflict: "id" }
    );

    setIsSubmitting(false);

    if (insertError) {
      setError("Nou pa kapab kreye kont ou. Tanpri eseye ankò.");
      return;
    }

    clearOnboardingDraft();
    router.push("/home");
  }

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
        Verifye idantite ou ak yon foto ID ou pou kontinye
      </h1>

      <p className="pt-4 text-[0.95rem] text-ink-secondary">
        Tout foto kripte pou enfòmasyon ou rete prive.
      </p>

      {error && <p className="pt-3 text-[0.85rem] text-late">{error}</p>}

      <div className="mt-auto flex flex-col gap-6">
        <p className="text-center text-[0.85rem] text-ink-secondary">
          Lè ou peze &quot;Kontinye&quot;, ou dakò ak{" "}
          <span className="text-green">règleman konfidansyalite yo</span>.
        </p>

        <PillButton
          className="w-full"
          disabled={isSubmitting}
          onClick={handleContinue}
        >
          {isSubmitting ? "Kreyasyon kont..." : "Kontinye"}
        </PillButton>
      </div>
    </div>
  );
}
