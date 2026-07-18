"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingField } from "@/components/ui/onboarding-field";
import { PillButton } from "@/components/ui/pill-button";
import { createClient } from "@/lib/supabase/client";
import { writeOnboardingDraft } from "@/lib/onboarding-store";

export function OnboardingEmailScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setIsSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });

    if (otpError) {
      setIsSubmitting(false);
      setError("Nou pa kapab voye kòd la. Tanpri verifye imèl ou eseye ankò.");
      return;
    }

    writeOnboardingDraft({ email });
    router.push("/onboarding/code");
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 pt-4 pb-6">
      <div className="flex justify-end">
        <button type="button" className="text-2xl font-medium text-ink">
          ?
        </button>
      </div>

      <h1 className="pt-6 text-[1.6rem] font-bold text-ink">Antre imèl ou</h1>

      <div className="pt-8">
        <OnboardingField
          value={email}
          onChange={setEmail}
          placeholder="Adrès imèl"
          type="email"
          autoFocus
        />
      </div>

      {error && <p className="pt-3 text-[0.85rem] text-late">{error}</p>}

      <div className="mt-auto flex gap-3 pt-6">
        <PillButton
          className="flex-1"
          disabled={!email || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? "Voye..." : "Kontinye"}
        </PillButton>
      </div>
    </div>
  );
}
