import { cn } from "@/lib/utils";

interface StepProgressBarProps {
  step: number;
  total: number;
  label: string;
}

export function StepProgressBar({ step, total, label }: StepProgressBarProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1.5">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={cn("h-1.5 flex-1 rounded-full", i < step ? "bg-green" : "bg-surface-muted")}
          />
        ))}
      </div>
      <span className="text-[0.85rem] text-ink-secondary">
        Etap {step} sou {total} — {label}
      </span>
    </div>
  );
}
