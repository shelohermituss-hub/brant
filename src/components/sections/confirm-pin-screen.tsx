"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { NumericKeypad } from "@/components/ui/numeric-keypad";
import { AssetIcon } from "@/components/ui/asset-icon";
import { createClient } from "@/lib/supabase/client";
import { setWalletUnlocked } from "@/lib/wallet-lock";
import { cn } from "@/lib/utils";

const PIN_LENGTH = 4;

export function ConfirmPinScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/payment-hub/wallet";
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (pin.length !== PIN_LENGTH) return;

    const timeout = setTimeout(async () => {
      setIsVerifying(true);
      setError(null);
      const supabase = createClient();
      const { data, error: rpcError } = await supabase.rpc("verify_wallet_pin", { p_pin: pin });
      setIsVerifying(false);

      if (rpcError || !data) {
        setError("Kòd PIN pa bon. Eseye ankò.");
        setPin("");
        return;
      }

      setWalletUnlocked();
      router.push(redirect);
    }, 150);

    return () => clearTimeout(timeout);
  }, [pin, redirect, router]);

  const appendDigit = (digit: string) => {
    setPin((prev) => (prev.length < PIN_LENGTH ? prev + digit : prev));
  };

  const backspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="flex items-center justify-end gap-4 px-5 pt-4">
        <button
          type="button"
          onClick={() => router.push("/home")}
          aria-label="Fèmen"
        >
          <AssetIcon name="cross" className="text-ink" size={20} />
        </button>
      </div>

      <h1 className="px-5 pt-4 text-xl font-bold text-ink">Antre kòd PIN wallet ou</h1>

      <div className="flex gap-3 px-5 pt-5">
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-4 w-4 rounded-full",
              i < pin.length ? "bg-green" : "bg-border-strong"
            )}
          />
        ))}
      </div>

      {isVerifying && <p className="px-5 pt-4 text-[0.85rem] text-ink-secondary">Verifikasyon...</p>}
      {error && <p className="px-5 pt-4 text-[0.85rem] text-late">{error}</p>}

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
