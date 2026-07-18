"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { NumericKeypad } from "@/components/ui/numeric-keypad";
import { cn } from "@/lib/utils";

const PIN_LENGTH = 4;

export function ConfirmPinScreen() {
  const router = useRouter();
  const [pin, setPin] = useState("");

  useEffect(() => {
    if (pin.length === PIN_LENGTH) {
      const timeout = setTimeout(() => router.push("/"), 300);
      return () => clearTimeout(timeout);
    }
  }, [pin, router]);

  const appendDigit = (digit: string) => {
    setPin((prev) => (prev.length < PIN_LENGTH ? prev + digit : prev));
  };

  const backspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-end gap-4 px-5 pt-4">
        <button
          type="button"
          aria-label="Aide"
          className="text-2xl font-medium text-ink"
        >
          ?
        </button>
        <button
          type="button"
          onClick={() => router.push("/")}
          aria-label="Fermer"
        >
          <X className="text-ink" size={24} />
        </button>
      </div>

      <h1 className="px-5 pt-4 text-xl font-bold text-ink">
        Confirm your Cash PIN
      </h1>

      <div className="flex gap-3 px-5 pt-5">
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-4 w-4 rounded-full",
              i < pin.length ? "bg-ink" : "bg-border-strong"
            )}
          />
        ))}
      </div>

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
