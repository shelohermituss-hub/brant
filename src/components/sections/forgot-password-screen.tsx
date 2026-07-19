"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AssetIcon } from "@/components/ui/asset-icon";
import { AuthField } from "@/components/ui/auth-field";
import { PillButton } from "@/components/ui/pill-button";
import { createClient } from "@/lib/supabase/client";

export function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit() {
    setIsSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/onboarding/reset-password`,
    });

    setIsSubmitting(false);
    if (resetError) {
      setError("Nou pa kapab voye lyen an. Tanpri verifye imèl ou.");
      return;
    }
    setSent(true);
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 pt-4 pb-6">
      <button
        type="button"
        onClick={() => router.push("/onboarding/signin")}
        aria-label="Retou"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-border"
      >
        <AssetIcon name="chevron-left" className="text-ink" size={18} />
      </button>

      <h1 className="pt-8 text-[1.75rem] font-bold text-ink">Bliye modpas?</h1>

      {sent ? (
        <p className="pt-4 text-[0.95rem] text-ink-secondary">
          Nou voye yon lyen bay {email}. Peze lyen an nan imèl ou pou chwazi yon nouvo modpas.
        </p>
      ) : (
        <>
          <p className="pt-2 text-[0.95rem] text-ink-secondary">
            Pa enkyete w, sa rive. Antre imèl ki asosye ak kont ou a.
          </p>

          <div className="pt-6">
            <AuthField
              label="Email"
              value={email}
              onChange={setEmail}
              placeholder="Antre imèl ou"
              type="email"
              autoFocus
            />
          </div>

          {error && <p className="pt-4 text-[0.85rem] text-late">{error}</p>}

          <div className="pt-6">
            <PillButton className="w-full" disabled={!email || isSubmitting} onClick={handleSubmit}>
              {isSubmitting ? "Voye..." : "Voye lyen an"}
            </PillButton>
          </div>
        </>
      )}

      <p className="mt-auto pt-6 text-center text-[0.9rem] text-ink-secondary">
        Ou sonje modpas ou?{" "}
        <Link href="/onboarding/signin" className="font-bold text-ink">
          Konekte
        </Link>
      </p>
    </div>
  );
}
