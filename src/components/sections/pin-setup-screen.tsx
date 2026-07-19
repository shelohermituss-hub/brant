"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NumericKeypad } from "@/components/ui/numeric-keypad";
import { AssetIcon } from "@/components/ui/asset-icon";
import { createClient } from "@/lib/supabase/client";
import { setWalletUnlocked } from "@/lib/wallet-lock";
import { cn } from "@/lib/utils";

const PIN_LENGTH = 4;

export function PinSetupScreen() {
  const router = useRouter();
  const [step, setStep] = useState<"create" | "confirm">("create");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const active = step === "create" ? pin : confirmPin;

  useEffect(() => {
    if (step === "create" && pin.length === PIN_LENGTH) {
      const timeout = setTimeout(() => setStep("confirm"), 200);
      return () => clearTimeout(timeout);
    }
  }, [step, pin]);

  useEffect(() => {
    if (step !== "confirm" || confirmPin.length !== PIN_LENGTH) return;

    const mismatch = confirmPin !== pin;
    const timeout = setTimeout(async () => {
      if (mismatch) {
        setError("Kòd yo pa menm. Eseye ankò.");
        setConfirmPin("");
        setStep("create");
        setPin("");
        return;
      }

      setError(null);
      setIsSaving(true);
      const supabase = createClient();
      const { error: rpcError } = await supabase.rpc("set_wallet_pin", { p_pin: confirmPin });
      setIsSaving(false);
      if (rpcError) {
        setError("Nou pa kapab anrejistre kòd PIN nan. Eseye ankò.");
        setConfirmPin("");
        setStep("create");
        setPin("");
        return;
      }
      setWalletUnlocked();
      router.push("/payment-hub/wallet");
    }, mismatch ? 500 : 0);

    return () => clearTimeout(timeout);
  }, [step, confirmPin, pin, router]);

  const appendDigit = (digit: string) => {
    if (step === "create") {
      setPin((prev) => (prev.length < PIN_LENGTH ? prev + digit : prev));
    } else {
      setConfirmPin((prev) => (prev.length < PIN_LENGTH ? prev + digit : prev));
    }
  };

  const backspace = () => {
    if (step === "create") {
      setPin((prev) => prev.slice(0, -1));
    } else {
      setConfirmPin((prev) => prev.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="flex items-center justify-between px-5 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Retou"
        >
          <AssetIcon name="chevron-left" className="text-ink" size={22} />
        </button>
      </div>

      <h1 className="px-5 pt-6 text-xl font-bold text-ink">
        {step === "create" ? "Kreye yon kòd PIN pou wallet ou" : "Konfime kòd PIN ou"}
      </h1>
      <p className="px-5 pt-2 text-[0.9rem] text-ink-secondary">
        {step === "create"
          ? "Kòd sa a pral pwoteje aksè nan wallet ou."
          : "Antre menm kòd la ankò."}
      </p>

      <div className="flex gap-3 px-5 pt-6">
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-4 w-4 rounded-full",
              i < active.length ? "bg-green" : "bg-border-strong"
            )}
          />
        ))}
      </div>

      {error && <p className="px-5 pt-4 text-[0.85rem] text-late">{error}</p>}
      {isSaving && <p className="px-5 pt-4 text-[0.85rem] text-ink-secondary">Anrejistreman...</p>}

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
