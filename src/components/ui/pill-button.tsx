import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

type PillButtonVariant =
  | "primary"
  | "secondary"
  | "blue"
  | "purple"
  | "orange"
  | "cyan"
  | "outline";

interface PillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: PillButtonVariant;
}

const backgroundByVariant: Record<PillButtonVariant, string> = {
  primary: "bg-green",
  secondary: "bg-secondary",
  blue: "bg-blue",
  purple: "bg-purple",
  orange: "bg-orange",
  cyan: "bg-cyan",
  outline: "bg-transparent border border-border",
};

const lightTextVariants: PillButtonVariant[] = [
  "primary",
  "blue",
  "purple",
  "orange",
  "cyan",
];

export function PillButton({
  variant = "primary",
  className,
  disabled,
  ...props
}: PillButtonProps) {
  const isLightText = lightTextVariants.includes(variant);

  return (
    <button
      disabled={disabled}
      className={cn(
        "flex h-14 shrink-0 items-center justify-center rounded-full text-base font-bold transition-colors disabled:pointer-events-none",
        backgroundByVariant[variant],
        isLightText
          ? disabled
            ? "text-white/50"
            : "text-white"
          : disabled
            ? "text-ink/40"
            : "text-ink",
        className
      )}
      {...props}
    />
  );
}
