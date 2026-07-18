"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingField } from "@/components/ui/onboarding-field";
import { PillButton } from "@/components/ui/pill-button";
import { createClient } from "@/lib/supabase/client";
import { readOnboardingDraft } from "@/lib/onboarding-store";

export function OnboardingCodeScreen() {
  const router = useRouter();
  const [email] = useState<string | null>(() => readOnboardingDraft().email ?? null);
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!email) {
      router.replace("/onboarding/email");
    }
  }, [email, router]);

  async function handleSubmit() {
    if (!email) return;
    setIsSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });

    if (verifyError || !data.user) {
      setIsSubmitting(false);
      setError("Kòd la pa bon. Tanpri eseye ankò.");
      return;
    }

    const { data: existingProfile } = await supabase
      .from("users")
      .select("id")
      .eq("id", data.user.id)
      .maybeSingle();

    setIsSubmitting(false);
    router.push(existingProfile ? "/home" : "/onboarding/name");
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 pt-4 pb-6">
      <div className="flex justify-end">
        <button type="button" className="text-2xl font-medium text-ink">
          ?
        </button>
      </div>

      <h1 className="pt-6 text-[1.6rem] leading-tight font-bold text-ink">
        {email ? `Antre kòd yo voye bay ${email}` : "Antre kòd la"}
      </h1>

      <div className="pt-8">
        <OnboardingField
          value={code}
          onChange={setCode}
          placeholder="Kòd konfirmasyon"
          autoFocus
        />
      </div>

      {error && <p className="pt-3 text-[0.85rem] text-late">{error}</p>}

      <div className="mt-auto pt-6">
        <PillButton
          className="w-full"
          disabled={!code || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? "Verifikasyon..." : "Kontinye"}
        </PillButton>
      </div>
    </div>
  );
}
