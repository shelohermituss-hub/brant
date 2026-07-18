"use client";

import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Check } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";
import { AssetIcon } from "@/components/ui/asset-icon";
import { StepProgressBar } from "@/components/ui/step-progress-bar";
import { cn } from "@/lib/utils";

const SLOTS = [
  { position: 7, month: "Jen 2026", available: true },
  { position: 3, month: "Fevriye 2026", available: false },
  { position: 1, month: "Desanm 2025", available: false },
];

export function GroupCreatePositionScreen() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 pt-4 pb-6">
      <button
        type="button"
        onClick={() => router.push("/group/create/duration")}
        aria-label="Retour"
      >
        <AssetIcon name="chevron-left" className="text-ink" size={22} />
      </button>

      <div className="pt-6">
        <StepProgressBar step={3} total={5} label="Pozisyon ou" />
      </div>

      <h1 className="pt-6 text-[1.6rem] leading-tight font-bold text-ink">
        Chwazi tou ou
      </h1>
      <p className="pt-2 text-[0.95rem] text-ink-secondary">
        Kredi/Skò ou detèmine ki kreno ki disponib — pa yon chwa lib
      </p>

      <div className="flex flex-col gap-3 pt-6">
        {SLOTS.map((slot) => (
          <div
            key={slot.position}
            className={cn(
              "flex items-center gap-4 rounded-lg border p-4",
              slot.available
                ? "border-green bg-green/5"
                : "border-border-strong bg-surface-muted opacity-60"
            )}
          >
            <span
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                slot.available ? "bg-green" : "bg-border-strong"
              )}
            >
              {slot.available ? (
                <Check className="text-white" size={20} strokeWidth={3} />
              ) : (
                <Lock className="text-ink-secondary" size={18} />
              )}
            </span>
            <div className="flex flex-1 flex-col">
              <span className="text-[0.95rem] font-bold text-ink">Sik {slot.position}</span>
              <span className="text-sm text-ink-secondary">{slot.month}</span>
            </div>
            {!slot.available && (
              <span className="max-w-[110px] text-right text-xs text-ink-secondary">
                Ba w plis nan Kredi/Skò pou w jwenn sa a
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-lg bg-surface-muted px-4 py-3">
        <ShieldCheck className="text-ink" size={20} />
        <span className="text-[0.85rem] text-ink-secondary">
          Skò fyabilite aktyèl ou : <span className="font-bold text-ink">92/100</span>
        </span>
      </div>

      <div className="mt-auto pt-6">
        <PillButton className="w-full" onClick={() => router.push("/group/create/members")}>
          Next
        </PillButton>
      </div>
    </div>
  );
}
