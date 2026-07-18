import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { ButtonHTMLAttributes } from "react";

type ChipVariant = "primary" | "secondary" | "outline";

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ChipVariant;
  withChevron?: boolean;
}

const classesByVariant: Record<ChipVariant, string> = {
  primary: "bg-green-bright text-white",
  secondary: "bg-surface-muted text-ink",
  outline: "bg-surface text-ink border border-border-strong",
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
        "inline-flex h-10 shrink-0 items-center gap-1 rounded-full px-4 text-[0.95rem] font-bold",
        classesByVariant[variant],
        className
      )}
      {...props}
    >
      {children}
      {withChevron && <ChevronDown size={16} strokeWidth={2.5} />}
    </button>
  );
}
