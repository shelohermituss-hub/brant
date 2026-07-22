import { cn } from "@/lib/utils";

type BadgeTone = "paid" | "wait" | "late" | "neutral";

interface StatusBadgeProps {
  label: string;
  tone: BadgeTone;
  className?: string;
}

const classesByTone: Record<BadgeTone, string> = {
  paid: "bg-paid/10 text-paid",
  wait: "bg-wait/10 text-wait",
  late: "bg-late/10 text-late",
  neutral: "bg-surface-muted text-ink-secondary",
};

export function StatusBadge({ label, tone, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center rounded-full px-2.5 text-xs font-bold",
        classesByTone[tone],
        className
      )}
    >
      {label}
    </span>
  );
}
