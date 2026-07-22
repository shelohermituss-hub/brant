import Link from "next/link";
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
  href?: string;
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
  "blue",
  "purple",
  "orange",
  "cyan",
];

export function PillButton({
  variant = "primary",
  className,
  disabled,
  href,
  ...props
}: PillButtonProps) {
  const isLightText = lightTextVariants.includes(variant);

  const classes = cn(
    "flex h-14 shrink-0 items-center justify-center rounded-full text-base font-bold transition-[color,background-color,transform] duration-150 ease-[var(--ease-out)] active:scale-[0.97] disabled:pointer-events-none disabled:active:scale-100",
    backgroundByVariant[variant],
    isLightText
      ? disabled
        ? "text-white/50"
        : "text-white"
      : disabled
        ? "text-ink/40"
        : "text-ink",
    className
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={classes}>
        {props.children}
      </Link>
    );
  }

  return <button disabled={disabled} className={classes} {...props} />;
}
