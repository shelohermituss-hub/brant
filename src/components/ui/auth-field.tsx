"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface AuthFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: "text" | "email" | "password";
  autoFocus?: boolean;
  rightSlot?: React.ReactNode;
}

export function AuthField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoFocus,
  rightSlot,
}: AuthFieldProps) {
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (revealed ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm text-ink-secondary">{label}</label>
        {rightSlot}
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3.5">
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full border-none bg-transparent text-base text-ink placeholder:text-placeholder focus:outline-none"
        />
        {isPassword && (
          <button
            type="button"
            aria-label={revealed ? "Kache modpas" : "Montre modpas"}
            onClick={() => setRevealed((r) => !r)}
            className="shrink-0 text-ink-secondary"
          >
            {revealed ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}
