"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckboxRowProps {
  label: string;
  checked: boolean;
  onToggle?: () => void;
  trailing?: React.ReactNode;
}

export function CheckboxRow({ label, checked, onToggle, trailing }: CheckboxRowProps) {
  return (
    <div className="flex items-center gap-4 border-b border-border px-5 py-4 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={checked}
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border",
          checked ? "border-green bg-green" : "border-border-strong bg-transparent"
        )}
      >
        {checked && <Check className="text-white" size={16} strokeWidth={3} />}
      </button>
      <span className="flex-1 text-[0.95rem] font-bold text-ink">{label}</span>
      {trailing}
    </div>
  );
}
