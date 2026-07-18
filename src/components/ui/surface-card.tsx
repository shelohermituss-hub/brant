import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, ElementType } from "react";

interface SurfaceCardProps<T extends ElementType> {
  as?: T;
  className?: string;
}

export function SurfaceCard<T extends ElementType = "div">({
  as,
  className,
  ...props
}: SurfaceCardProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof SurfaceCardProps<T>>) {
  const Component = as || "div";

  return (
    <Component
      className={cn("rounded-lg bg-surface p-5", className)}
      {...props}
    />
  );
}
