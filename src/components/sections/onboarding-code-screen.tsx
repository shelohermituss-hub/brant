"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";
import { createClient } from "@/lib/supabase/client";
import { readOnboardingDraft } from "@/lib/onboarding-store";
import { useClientSnapshot } from "@/lib/use-client-snapshot";

export function OnboardingCodeScreen() {
  const router = useRouter();
  const email = useClientSnapshot(() => readOnboardingDraft().email ?? null, null);
  const [isResending, setIsResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!readOnboardingDraft().email) {
      router.replace("/onboarding/email");
    }
  }, [router]);

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
      setError("Nou pa kapab voye lyen an. Tanpri eseye ankò.");
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

      <span className="mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-surface-muted">
        <Mail className="text-ink" size={26} />
      </span>

      <h1 className="pt-6 text-[1.6rem] leading-tight font-bold text-ink">
        Verifye imèl ou
      </h1>
      <p className="pt-2 text-[0.95rem] text-ink-secondary">
        Nou voye yon lyen bay {email ?? "imèl ou"}. Klike sou lyen an nan
        imèl ou pou kontinye — ou ka fèmen paj sa a apre.
      </p>

      {resent && (
        <p className="pt-3 text-[0.85rem] text-paid">Nou voye lyen an ankò.</p>
      )}
      {error && <p className="pt-3 text-[0.85rem] text-late">{error}</p>}

      <div className="mt-auto flex flex-col gap-3 pt-6">
        <PillButton
          variant="secondary"
          className="w-full"
          disabled={isResending}
          onClick={handleResend}
        >
          {isResending ? "Voye..." : "Voye lyen an ankò"}
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
