import { cn } from "@/lib/utils";

export function SurfaceCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("rounded-lg bg-surface p-5", className)}
      {...props}
    />
  );
}
