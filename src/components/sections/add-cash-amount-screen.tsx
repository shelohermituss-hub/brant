"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { NumericKeypad } from "@/components/ui/numeric-keypad";
import { PillButton } from "@/components/ui/pill-button";

export function AddCashAmountScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState("0");

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
    <div className="flex flex-1 flex-col">
      <div className="px-5 pt-4">
        <button
          type="button"
          onClick={() => router.push("/add-cash")}
          aria-label="Fermer"
        >
          <X className="text-green" size={26} strokeWidth={2.5} />
        </button>
      </div>

      <p className="pt-2 text-center text-[1.05rem] text-ink">Add Cash</p>

      <div className="flex flex-1 items-center justify-center">
        <p className="text-[4rem] leading-none font-bold text-green-bright">
          ${amount}
        </p>
      </div>

      <NumericKeypad
        variant="plain"
        onDigit={appendDigit}
        onDecimal={appendDecimal}
        onBackspace={backspace}
      />

      <div className="px-4 pb-6">
        <PillButton
          className="w-full"
          onClick={() => router.push("/add-cash/success")}
        >
          Add
        </PillButton>
      </div>
    </div>
  );
}
