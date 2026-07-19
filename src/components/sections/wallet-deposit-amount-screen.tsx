"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { NumericKeypad } from "@/components/ui/numeric-keypad";
import { useCurrentAppUser } from "@/lib/use-current-app-user";

export function WalletDepositAmountScreen() {
  const router = useRouter();
  const { authUserId, profile } = useCurrentAppUser();
  const [amount, setAmount] = useState("0");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    const res = await fetch("/api/wallet/deposit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: numericAmount }),
    });

    setIsSubmitting(false);

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setError(body?.error ?? "Nou pa kapab fè depo a. Tanpri eseye ankò.");
      return;
    }

    router.push(`/payment-hub/wallet/deposit/success?amount=${numericAmount}`);
  }

  const canConfirm = numericAmount > 0 && !!profile?.moncash_number && !isSubmitting;

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-green-deep">
      <div className="px-5 pt-4">
        <button
          type="button"
          onClick={() => router.push("/payment-hub/wallet")}
          aria-label="Fermer"
        >
          <X className="text-white" size={26} strokeWidth={2.5} />
        </button>
      </div>

      <p className="pt-2 text-center text-[1.05rem] text-white">Ajoute lajan nan wallet la</p>
      <p className="pt-1 text-center text-sm text-white/70">
        Soti nan MonCash {profile?.moncash_number ?? "ou"}
      </p>

      <div className="flex flex-1 items-center justify-center">
        <p className="text-[4rem] leading-none font-bold text-white">{amount} HTG</p>
      </div>

      {error && <p className="px-5 pb-2 text-center text-[0.85rem] text-late">{error}</p>}

      <NumericKeypad variant="green" showDecimal={false} onDigit={appendDigit} onBackspace={backspace} />

      <div className="px-4 pb-6">
        <button
          type="button"
          disabled={!canConfirm}
          onClick={handleConfirm}
          className="h-14 w-full rounded-full bg-white/15 text-[1.05rem] font-bold text-white disabled:opacity-50"
        >
          {isSubmitting ? "Voye..." : "Ajoute"}
        </button>
      </div>
    </div>
  );
}
