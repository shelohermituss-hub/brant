"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NumericKeypad } from "@/components/ui/numeric-keypad";
import { createClient } from "@/lib/supabase/client";
import { readOnboardingDraft } from "@/lib/onboarding-store";
import { useClientSnapshot } from "@/lib/use-client-snapshot";
import { cn } from "@/lib/utils";

const CODE_LENGTH = 8;
const RESEND_SECONDS = 60;

function formatCountdown(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function OnboardingCodeScreen() {
  const router = useRouter();
  const email = useClientSnapshot(() => readOnboardingDraft().email ?? null, null);
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (!readOnboardingDraft().email) {
      router.replace("/onboarding/email");
    }
  }, [router]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timeout = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timeout);
  }, [secondsLeft]);

  async function handleSubmit(fullCode: string) {
    if (!email) return;
    setIsSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: fullCode,
      type: "email",
    });

    if (verifyError || !data.user) {
      setIsSubmitting(false);
      setError("Kòd la pa bon. Tanpri eseye ankò.");
      setCode("");
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

  useEffect(() => {
    if (code.length !== CODE_LENGTH) return;
    const timeout = setTimeout(() => handleSubmit(code), 150);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  async function handleResend() {
    if (!email || secondsLeft > 0) return;
    setIsResending(true);
    setError(null);
    setCode("");

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
    setSecondsLeft(RESEND_SECONDS);
  }

  const appendDigit = (digit: string) => {
    if (isSubmitting) return;
    setCode((prev) => (prev.length < CODE_LENGTH ? prev + digit : prev));
  };

  const backspace = () => {
    setCode((prev) => prev.slice(0, -1));
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="px-5 pt-8 text-center">
        <h1 className="text-[1.6rem] font-bold text-ink">Verifye kòd OTP a</h1>
        <p className="pt-3 text-[0.95rem] text-ink-secondary">
          {email
            ? `Nou voye yon kòd OTP bay ${email}. Antre ${CODE_LENGTH} chif yo pou verifye.`
            : `Antre ${CODE_LENGTH} chif kòd la.`}
        </p>
      </div>

      <div className="flex justify-center gap-1.5 px-3 pt-8">
        {Array.from({ length: CODE_LENGTH }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex h-12 w-8 items-center justify-center rounded-lg border text-base font-bold text-ink",
              i < code.length ? "border-green bg-surface" : "border-border bg-surface-muted"
            )}
          >
            {code[i] ?? ""}
          </div>
        ))}
      </div>

      <div className="pt-5 text-center">
        <button
          type="button"
          disabled={secondsLeft > 0 || isResending}
          onClick={handleResend}
          className={cn(
            "text-[0.9rem]",
            secondsLeft > 0 ? "text-ink-secondary" : "font-bold text-green"
          )}
        >
          {isResending
            ? "Voye..."
            : secondsLeft > 0
              ? `Ou pa resevwa kòd la? ${formatCountdown(secondsLeft)}`
              : "Voye kòd la ankò"}
        </button>
      </div>

      {error && <p className="pt-3 text-center text-[0.85rem] text-late">{error}</p>}
      {isSubmitting && (
        <p className="pt-3 text-center text-[0.85rem] text-ink-secondary">Verifikasyon...</p>
      )}

      <div className="flex-1" />

      <NumericKeypad
        variant="plain"
        showDecimal={false}
        onDigit={appendDigit}
        onBackspace={backspace}
      />
    </div>
  );
}
