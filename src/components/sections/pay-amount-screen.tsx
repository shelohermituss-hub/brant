"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NumericKeypad } from "@/components/ui/numeric-keypad";
import { BottomTabBar } from "@/components/layout/bottom-tab-bar";
import { AssetIcon } from "@/components/ui/asset-icon";

export function PayAmountScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState("10");

  const appendDigit = (digit: string) => {
    setAmount((prev) => (prev === "0" ? digit : prev + digit));
  };

  const appendDecimal = () => {
    setAmount((prev) => (prev.includes(".") ? prev : `${prev}.`));
  };

  const backspace = () => {
    setAmount((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-green-deep">
      <div className="flex items-center justify-between px-5 pt-4">
        <AssetIcon name="scan" tone="white" size={24} />
        <div className="h-11 w-11 shrink-0 rounded-full bg-white/30" />
      </div>

      <div className="flex flex-1 items-center justify-center">
        <p className="text-[3.5rem] leading-none font-bold text-white">
          ${amount}
        </p>
      </div>

      <div className="flex justify-center pb-6">
        <button
          type="button"
          className="flex items-center gap-1 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white"
        >
          USD
          <AssetIcon name="chevron-down" tone="white" size={14} />
        </button>
      </div>

      <NumericKeypad
        variant="green"
        onDigit={appendDigit}
        onDecimal={appendDecimal}
        onBackspace={backspace}
      />

      <div className="flex gap-3 px-4 pt-2 pb-4">
        <button
          type="button"
          className="h-12 flex-1 rounded-full bg-white/15 text-[0.95rem] font-bold text-white"
        >
          Request
        </button>
        <button
          type="button"
          onClick={() => router.push("/pay/details")}
          className="h-12 flex-1 rounded-full bg-white/15 text-[0.95rem] font-bold text-white"
        >
          Pay
        </button>
      </div>

      <BottomTabBar tone="dark" />
    </div>
  );
}
