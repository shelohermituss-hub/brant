"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingField } from "@/components/ui/onboarding-field";
import { PillButton } from "@/components/ui/pill-button";
import { createClient } from "@/lib/supabase/client";
import { readOnboardingDraft } from "@/lib/onboarding-store";
import { useClientSnapshot } from "@/lib/use-client-snapshot";

export function OnboardingCodeScreen() {
  const router = useRouter();
  const email = useClientSnapshot(() => readOnboardingDraft().email ?? null, null);
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!readOnboardingDraft().email) {
      router.replace("/onboarding/email");
    }
  }, [router]);

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

  async function handleResend() {
    if (!email) return;
    setIsResending(true);
    setError(null);
    setResent(false);

    const supabase = createClient();
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setIsResending(false);
    if (otpError) {
      setError("Nou pa kapab voye kòd la. Tanpri eseye ankò.");
      return;
    }
    setResent(true);
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

      {resent && <p className="pt-3 text-[0.85rem] text-paid">Nou voye yon nouvo kòd.</p>}
      {error && <p className="pt-3 text-[0.85rem] text-late">{error}</p>}

      <div className="mt-auto flex flex-col gap-3 pt-6">
        <PillButton className="w-full" disabled={!code || isSubmitting} onClick={handleSubmit}>
          {isSubmitting ? "Verifikasyon..." : "Kontinye"}
        </PillButton>
        <PillButton
          variant="secondary"
          className="w-full"
          disabled={isResending}
          onClick={handleResend}
        >
          {isResending ? "Voye..." : "Voye kòd la ankò"}
        </PillButton>
        <PillButton
          variant="outline"
          className="w-full"
          onClick={() => router.push("/onboarding/email")}
        >
          Chanje imèl
        </PillButton>
      </div>
    </div>
  );
}
