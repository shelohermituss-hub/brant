"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AssetIcon } from "@/components/ui/asset-icon";
import { AuthField } from "@/components/ui/auth-field";
import { PillButton } from "@/components/ui/pill-button";
import { createClient } from "@/lib/supabase/client";
import { writeOnboardingDraft } from "@/lib/onboarding-store";

export function OnboardingSignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmEmailSent, setConfirmEmailSent] = useState(false);

  async function handleSubmit() {
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
    const { data: exists, error: existsError } = await supabase.rpc("email_exists", {
      p_email: email,
    });

    if (existsError) {
      setIsSubmitting(false);
      setError("Nou pa kapab verifye imèl la. Tanpri eseye ankò.");
      return;
    }

    if (exists) {
      setIsSubmitting(false);
      setError("Yon kont deja egziste ak imèl sa a. Konekte pito.");
      return;
    }

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
      setConfirmEmailSent(true);
      return;
    }
    router.push("/onboarding/name");
  }

  if (confirmEmailSent) {
    return (
      <div className="flex flex-1 flex-col overflow-y-auto px-5 pt-4 pb-6">
        <h1 className="pt-8 text-[1.75rem] font-bold text-ink">Konfime imèl ou</h1>
        <p className="pt-4 text-[0.95rem] text-ink-secondary">
          Nou voye yon lyen konfimasyon bay {email}. Peze lyen an nan imèl ou pou aktive kont ou,
          epi tounen konekte.
        </p>
        <div className="mt-auto pt-6">
          <PillButton className="w-full" onClick={() => router.push("/onboarding/signin")}>
            Mwen konfime, konekte
          </PillButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 pt-4 pb-6">
      <button
        type="button"
        onClick={() => router.push("/")}
        aria-label="Retou"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-border"
      >
        <AssetIcon name="chevron-left" className="text-ink" size={18} />
      </button>

      <h1 className="pt-8 text-[1.75rem] font-bold text-ink">Kreye yon kont</h1>

      <div className="flex flex-col gap-5 pt-6">
        <AuthField label="Email" value={email} onChange={setEmail} placeholder="example@gmail.com" type="email" autoFocus />
        <AuthField
          label="Kreye yon modpas"
          value={password}
          onChange={setPassword}
          placeholder="omwen 6 karaktè"
          type="password"
        />
        <AuthField
          label="Konfime modpas"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="repete modpas"
          type="password"
        />
      </div>

      {error && <p className="pt-4 text-[0.85rem] text-late">{error}</p>}

      <div className="pt-6">
        <PillButton
          className="w-full"
          disabled={!email || !password || !confirmPassword || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? "Kreyasyon..." : "Kreye kont"}
        </PillButton>
      </div>

      <p className="mt-auto pt-6 text-center text-[0.9rem] text-ink-secondary">
        Ou gen deja yon kont?{" "}
        <Link href="/onboarding/signin" className="font-bold text-ink">
          Konekte
        </Link>
      </p>
    </div>
  );
}
