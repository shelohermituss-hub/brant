"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { NumericKeypad } from "@/components/ui/numeric-keypad";
import { PillButton } from "@/components/ui/pill-button";
import { useCurrentAppUser } from "@/lib/use-current-app-user";
import { useWalletLockGuard } from "@/lib/use-wallet-lock-guard";
import { formatHtg } from "@/lib/utils";

export function WalletTransferAmountScreen() {
  const router = useRouter();
  const { authUserId, profile } = useCurrentAppUser();
  const unlocked = useWalletLockGuard(authUserId);
  const [amount, setAmount] = useState("0");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const balance = profile?.wallets?.balance ?? 0;
  const numericAmount = Number(amount);

  const appendDigit = (digit: string) => {
    setAmount((prev) => (prev === "0" ? digit : prev + digit));
  };

  const backspace = () => {
    setAmount((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
  };

  async function handleConfirm() {
    if (!authUserId) return;
    setIsSubmitting(true);
    setError(null);

    const res = await fetch("/api/wallet/transfer-to-moncash", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: numericAmount }),
    });

    setIsSubmitting(false);

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setError(body?.error ?? "Nou pa kapab fè tranzaksyon an. Tanpri eseye ankò.");
      return;
    }

    router.push(`/payment-hub/wallet/transfer/success?amount=${numericAmount}`);
  }

  const canConfirm =
    numericAmount > 0 && numericAmount <= balance && !!profile?.moncash_number && !isSubmitting;

  if (!unlocked) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-[0.9rem] text-ink-secondary">Deverouye wallet la...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="px-5 pt-4">
        <button
          type="button"
          onClick={() => router.push("/payment-hub/wallet")}
          aria-label="Fermer"
        >
          <X className="text-green" size={26} strokeWidth={2.5} />
        </button>
      </div>

      <p className="pt-2 text-center text-[1.05rem] text-ink">Voye nan MonCash</p>
      <p className="pt-1 text-center text-sm text-ink-secondary">
        Balans disponib : {formatHtg(balance)}
      </p>

      <div className="flex flex-1 items-center justify-center">
        <p className="text-[4rem] leading-none font-bold text-green-bright">{amount} HTG</p>
      </div>

      {error && <p className="px-5 pb-2 text-center text-[0.85rem] text-late">{error}</p>}

      <NumericKeypad variant="plain" showDecimal={false} onDigit={appendDigit} onBackspace={backspace} />

      <div className="px-4 pb-6">
        <PillButton className="w-full" disabled={!canConfirm} onClick={handleConfirm}>
          {isSubmitting ? "Voye..." : "Konfime"}
        </PillButton>
      </div>
    </div>
  );
}
