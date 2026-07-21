"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckboxRowProps {
  label: string;
  checked: boolean;
  onToggle?: () => void;
  trailing?: React.ReactNode;
  /** Lecture seule : l'état est déterminé par le système (ex. éligibilité), pas par un tap utilisateur. */
  readOnly?: boolean;
}

export function CheckboxRow({ label, checked, onToggle, trailing, readOnly = false }: CheckboxRowProps) {
  const indicator = (
    <span
      aria-pressed={checked}
      className={cn(
        "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-[background-color,border-color,transform] duration-150 ease-[var(--ease-out)]",
        checked ? "border-green bg-green" : "border-border-strong bg-transparent"
      )}
    >
      {checked && <Check className="text-white" size={16} strokeWidth={3} />}
    </span>
  );

  return (
    <div className="flex items-center gap-4 border-b border-border px-5 py-4 last:border-b-0">
      {readOnly ? indicator : (
        <button type="button" onClick={onToggle} className="rounded-md outline-none active:scale-[0.95] transition-transform duration-[var(--duration-tap)] ease-[var(--ease-out)] motion-reduce:active:scale-100 focus-visible:ring-2 focus-visible:ring-ring/50">
          {indicator}
        </button>
      )}
      <span className="flex-1 text-[0.95rem] font-bold text-ink">{label}</span>
      {trailing}
    </div>
  );
}
