import { cn } from "@/lib/utils";
import { AssetIcon } from "@/components/ui/asset-icon";
import { ButtonHTMLAttributes } from "react";

type ChipVariant = "accent" | "secondary" | "outline" | "paid" | "wait" | "late";

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ChipVariant;
  withChevron?: boolean;
}

const classesByVariant: Record<ChipVariant, string> = {
  accent: "bg-green-bright text-white",
  secondary: "bg-surface-muted text-ink",
  outline: "bg-surface text-ink border border-border-strong",
  paid: "bg-paid/10 text-paid",
  wait: "bg-wait/10 text-wait",
  late: "bg-late/10 text-late",
};

export function Chip({
  variant = "secondary",
  withChevron = false,
  className,
  children,
  ...props
}: ChipProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-10 shrink-0 items-center gap-1 rounded-full px-4 text-[0.95rem] font-bold outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
        classesByVariant[variant],
        className
      )}
      {...props}
    >
      {children}
      {withChevron && <AssetIcon name="chevron-down" size={14} />}
    </button>
  );
}
