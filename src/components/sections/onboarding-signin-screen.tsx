"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AssetIcon } from "@/components/ui/asset-icon";
import { AuthField } from "@/components/ui/auth-field";
import { PillButton } from "@/components/ui/pill-button";
import { createClient } from "@/lib/supabase/client";

interface OnboardingSigninScreenProps {
  linkError?: boolean;
}

export function OnboardingSigninScreen({ linkError = false }: OnboardingSigninScreenProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(
    linkError ? "Lyen an ekspire oswa li pa valid. Tanpri eseye ankò." : null
  );

  async function handleSubmit() {
    setIsSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    setIsSubmitting(false);
    if (signInError) {
      setError("Modpas la pa bon oswa kont sa a pa egziste.");
      return;
    }
    router.push("/home");
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

      <h1 className="pt-8 text-[1.75rem] font-bold text-ink">Konekte</h1>

      <div className="flex flex-col gap-5 pt-6">
        <AuthField
          label="Email"
          value={email}
          onChange={setEmail}
          placeholder="Adrès imèl"
          type="email"
          autoFocus
        />
        <AuthField
          label="Modpas"
          value={password}
          onChange={setPassword}
          placeholder="Modpas"
          type="password"
          rightSlot={
            <Link href="/onboarding/forgot-password" className="text-sm text-ink-secondary">
              Bliye modpas?
            </Link>
          }
        />
      </div>

      {error && <p className="pt-4 text-[0.85rem] text-late">{error}</p>}

      <div className="pt-6">
        <PillButton className="w-full" disabled={!email || !password || isSubmitting} onClick={handleSubmit}>
          {isSubmitting ? "Koneksyon..." : "Konekte"}
        </PillButton>
      </div>

      <p className="mt-auto pt-6 text-center text-[0.9rem] text-ink-secondary">
        Ou pa gen kont?{" "}
        <Link href="/onboarding/signup" className="font-bold text-ink">
          Kreye yon kont
        </Link>
      </p>
    </div>
  );
}
