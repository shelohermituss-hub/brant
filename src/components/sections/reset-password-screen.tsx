"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthField } from "@/components/ui/auth-field";
import { PillButton } from "@/components/ui/pill-button";
import { createClient } from "@/lib/supabase/client";

export function ResetPasswordScreen() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    const { error: updateError } = await supabase.auth.updateUser({ password });

    setIsSubmitting(false);
    if (updateError) {
      setError("Nou pa kapab chanje modpas la. Lyen an ka ekspire, mande yon lòt.");
      return;
    }
    router.push("/onboarding/password-changed");
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 pt-4 pb-6">
      <h1 className="pt-8 text-[1.75rem] font-bold text-ink">Chanje modpas</h1>
      <p className="pt-2 text-[0.95rem] text-ink-secondary">Tape yon modpas ou pral sonje</p>

      <div className="flex flex-col gap-5 pt-6">
        <AuthField
          label="Nouvo modpas"
          value={password}
          onChange={setPassword}
          placeholder="omwen 6 karaktè"
          type="password"
          autoFocus
        />
        <AuthField
          label="Konfime nouvo modpas"
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
          disabled={!password || !confirmPassword || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? "Chanjman..." : "Chanje modpas"}
        </PillButton>
      </div>
    </div>
  );
}
