"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingField } from "@/components/ui/onboarding-field";
import { PillButton } from "@/components/ui/pill-button";
import { createClient } from "@/lib/supabase/client";
import { writeOnboardingDraft } from "@/lib/onboarding-store";

type Step = "email" | "signin" | "signup" | "confirm-email";

interface OnboardingEmailScreenProps {
  linkError?: boolean;
}

export function OnboardingEmailScreen({ linkError = false }: OnboardingEmailScreenProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(
    linkError ? "Lyen an ekspire oswa li pa valid. Antre imèl ou ankò." : null
  );

  async function handleEmailContinue() {
    setIsSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { data, error: rpcError } = await supabase.rpc("email_exists", { p_email: email });

    setIsSubmitting(false);
    if (rpcError) {
      setError("Nou pa kapab verifye imèl la. Tanpri eseye ankò.");
      return;
    }
    setStep(data ? "signin" : "signup");
  }

  async function handleSignIn() {
    setIsSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    setIsSubmitting(false);
    if (signInError) {
      setError("Modpas la pa bon. Tanpri eseye ankò.");
      return;
    }
    router.push("/home");
  }

  async function handleSignUp() {
    if (password.length < 6) {
      setError("Modpas la dwe gen omwen 6 karaktè.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Modpas yo pa menm.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    setIsSubmitting(false);
    if (signUpError) {
      setError("Nou pa kapab kreye kont ou. Tanpri eseye ankò.");
      return;
    }

    writeOnboardingDraft({ email });

    if (!data.session) {
      setStep("confirm-email");
      return;
    }
    router.push("/onboarding/name");
  }

  const title =
    step === "email"
      ? "Antre imèl ou"
      : step === "signin"
        ? "Antre modpas ou"
        : step === "signup"
          ? "Kreye yon modpas"
          : "Konfime imèl ou";

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 pt-4 pb-6">
      <div className="flex justify-end">
        <button type="button" className="text-2xl font-medium text-ink">
          ?
        </button>
      </div>

      <h1 className="pt-6 text-[1.6rem] font-bold text-ink">{title}</h1>

      {step === "email" && (
        <>
          <div className="pt-8">
            <OnboardingField value={email} onChange={setEmail} placeholder="Adrès imèl" type="email" autoFocus />
          </div>
          {error && <p className="pt-3 text-[0.85rem] text-late">{error}</p>}
          <div className="mt-auto flex gap-3 pt-6">
            <PillButton className="flex-1" disabled={!email || isSubmitting} onClick={handleEmailContinue}>
              {isSubmitting ? "Verifikasyon..." : "Kontinye"}
            </PillButton>
          </div>
        </>
      )}

      {step === "signin" && (
        <>
          <p className="pt-2 text-[0.95rem] text-ink-secondary">{email}</p>
          <div className="pt-8">
            <OnboardingField
              value={password}
              onChange={setPassword}
              placeholder="Modpas"
              type="password"
              autoFocus
            />
          </div>
          {error && <p className="pt-3 text-[0.85rem] text-late">{error}</p>}
          <div className="mt-auto flex flex-col gap-3 pt-6">
            <PillButton className="w-full" disabled={!password || isSubmitting} onClick={handleSignIn}>
              {isSubmitting ? "Koneksyon..." : "Konekte"}
            </PillButton>
            <PillButton
              variant="outline"
              className="w-full"
              onClick={() => {
                setStep("email");
                setPassword("");
                setError(null);
              }}
            >
              Chanje imèl
            </PillButton>
          </div>
        </>
      )}

      {step === "signup" && (
        <>
          <p className="pt-2 text-[0.95rem] text-ink-secondary">{email}</p>
          <div className="flex flex-col gap-6 pt-8">
            <OnboardingField
              value={password}
              onChange={setPassword}
              placeholder="Modpas (omwen 6 karaktè)"
              type="password"
              autoFocus
            />
            <OnboardingField
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Konfime modpas"
              type="password"
            />
          </div>
          {error && <p className="pt-3 text-[0.85rem] text-late">{error}</p>}
          <div className="mt-auto flex flex-col gap-3 pt-6">
            <PillButton
              className="w-full"
              disabled={!password || !confirmPassword || isSubmitting}
              onClick={handleSignUp}
            >
              {isSubmitting ? "Kreyasyon..." : "Kreye kont"}
            </PillButton>
            <PillButton
              variant="outline"
              className="w-full"
              onClick={() => {
                setStep("email");
                setPassword("");
                setConfirmPassword("");
                setError(null);
              }}
            >
              Chanje imèl
            </PillButton>
          </div>
        </>
      )}

      {step === "confirm-email" && (
        <>
          <p className="pt-4 text-[0.95rem] text-ink-secondary">
            Nou voye yon lyen konfimasyon bay {email}. Peze lyen an nan imèl ou pou aktive kont
            ou, epi tounen konekte ak modpas ou.
          </p>
          <div className="mt-auto pt-6">
            <PillButton
              className="w-full"
              onClick={() => {
                setStep("signin");
                setError(null);
              }}
            >
              Mwen konfime, konekte
            </PillButton>
          </div>
        </>
      )}
    </div>
  );
}
