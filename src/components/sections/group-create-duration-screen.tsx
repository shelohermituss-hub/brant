"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AssetIcon } from "@/components/ui/asset-icon";
import { StepProgressBar } from "@/components/ui/step-progress-bar";
import { PillButton } from "@/components/ui/pill-button";
import { cn } from "@/lib/utils";
import { readGroupCreateDraft, writeGroupCreateDraft, type Frequency } from "@/lib/group-create-store";

const DURATION_OPTIONS = [5, 10, 20];

const FREQUENCY_OPTIONS: { key: Frequency; label: string; installmentsPerMonth: number }[] = [
  { key: "mwa", label: "Chak mwa", installmentsPerMonth: 1 },
  { key: "2-semenn", label: "Chak 2 semenn", installmentsPerMonth: 2 },
  { key: "3-jou", label: "Chak 3 jou", installmentsPerMonth: 10 },
];

const formatAmount = (value: number) => Math.round(value).toLocaleString("fr-FR").replace(/,/g, " ");

export function GroupCreateDurationScreen() {
  const router = useRouter();
  const [potAmount] = useState(() => readGroupCreateDraft().potAmount ?? null);
  const [duration, setDuration] = useState(() => readGroupCreateDraft().durationMonths ?? 10);
  const [frequency, setFrequency] = useState<Frequency>(
    () => readGroupCreateDraft().frequency ?? "mwa"
  );

  useEffect(() => {
    if (!potAmount) router.replace("/group/create/amount");
  }, [potAmount, router]);

  if (!potAmount) return null;

  const monthlyAmount = potAmount / duration;
  const activeFrequency = FREQUENCY_OPTIONS.find((f) => f.key === frequency)!;
  const perInstallment = monthlyAmount / activeFrequency.installmentsPerMonth;

  function handleNext() {
    writeGroupCreateDraft({
      durationMonths: duration,
      frequency,
      installmentsPerMonth: activeFrequency.installmentsPerMonth,
    });
    router.push("/group/create/position");
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 pt-4 pb-6">
      <button
        type="button"
        onClick={() => router.push("/group/create/amount")}
        aria-label="Retour"
      >
        <AssetIcon name="chevron-left" className="text-ink" size={22} />
      </button>

      <div className="pt-6">
        <StepProgressBar step={2} total={5} label="Dire ak frekans" />
      </div>

      <h1 className="pt-6 text-[1.6rem] leading-tight font-bold text-ink">
        Chwazi dire sik la
      </h1>
      <p className="pt-2 text-[0.95rem] text-ink-secondary">
        Pot la ({formatAmount(potAmount)} HTG) separe sou kantite mwa ou chwazi a
      </p>

      <div className="flex gap-3 pt-6">
        {DURATION_OPTIONS.map((months) => (
          <button
            key={months}
            type="button"
            onClick={() => setDuration(months)}
            className={cn(
              "flex flex-1 flex-col items-center gap-2 rounded-lg border p-4",
              duration === months ? "border-green-deep bg-green-deep/5" : "border-border-strong bg-surface"
            )}
          >
            <span
              className={cn(
                "text-2xl font-bold",
                duration === months ? "text-green-deep" : "text-ink"
              )}
            >
              {months}
            </span>
            <span className="text-xs text-ink-secondary">Mwa</span>
            <span className="h-px w-full bg-border" />
            <span className="text-center text-sm font-bold text-ink">
              {formatAmount(potAmount / months)}
              <br />
              HTG/mwa
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 pt-8">
        <span className="text-[0.95rem] font-bold text-ink">Frekans peman</span>
        <div className="flex gap-2">
          {FREQUENCY_OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setFrequency(option.key)}
              className={cn(
                "flex-1 rounded-full px-3 py-2 text-[0.85rem] font-bold",
                frequency === option.key ? "bg-green text-ink" : "bg-surface-muted text-ink"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-lg bg-surface-muted px-4 py-4">
        <span className="text-[0.9rem] text-ink-secondary">Kantite pou chak vèsman</span>
        <span className="text-[1.05rem] font-bold text-ink">{formatAmount(perInstallment)} HTG</span>
      </div>

      <div className="mt-auto pt-6">
        <PillButton className="w-full" onClick={handleNext}>
          Next
        </PillButton>
      </div>
    </div>
  );
}
