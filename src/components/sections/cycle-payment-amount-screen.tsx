"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NumericKeypad } from "@/components/ui/numeric-keypad";
import { AssetIcon } from "@/components/ui/asset-icon";

export function CyclePaymentAmountScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState("5000");

  const appendDigit = (digit: string) => {
    setAmount((prev) => (prev === "0" ? digit : prev + digit));
  };

  const backspace = () => {
    setAmount((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-green-deep">
      <div className="flex items-center justify-between px-5 pt-4">
        <button
          type="button"
          onClick={() => router.push("/stocks/cycle")}
          aria-label="Fermer"
        >
          <AssetIcon name="cross" tone="white" size={22} />
        </button>
      </div>

      <p className="pt-2 text-center text-[1.05rem] text-white">Peye kotizasyon</p>

      <div className="flex flex-1 items-center justify-center">
        <p className="text-[3.5rem] leading-none font-bold text-white">{amount} HTG</p>
      </div>

      <div className="flex justify-center pb-6">
        <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white">
          HTG
        </span>
      </div>

      <NumericKeypad
        variant="green"
        showDecimal={false}
        onDigit={appendDigit}
        onBackspace={backspace}
      />

      <div className="px-4 pt-2 pb-6">
        <button
          type="button"
          onClick={() => router.push("/stocks/cycle/review")}
          className="h-14 w-full rounded-full bg-white/15 text-[1.05rem] font-bold text-white"
        >
          Peye
        </button>
      </div>
    </div>
  );
}
