import { cn } from "@/lib/utils";
import { AssetIcon } from "@/components/ui/asset-icon";

type NumericKeypadVariant = "boxed" | "plain" | "green";

interface NumericKeypadProps {
  variant?: NumericKeypadVariant;
  showDecimal?: boolean;
  onDigit?: (digit: string) => void;
  onDecimal?: () => void;
  onBackspace?: () => void;
  className?: string;
}

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "backspace"];

export function NumericKeypad({
  variant = "plain",
  showDecimal = true,
  onDigit,
  onDecimal,
  onBackspace,
  className,
}: NumericKeypadProps) {
  const isBoxed = variant === "boxed";
  const isGreen = variant === "green";

  return (
    <div
      className={cn(
        "grid grid-cols-3 gap-x-2 gap-y-1 px-4 pb-4",
        isBoxed && "bg-surface-muted pt-4",
        className
      )}
    >
      {KEYS.map((key) => {
        const isBackspace = key === "backspace";
        const isDecimal = key === ".";

        if (isDecimal && !showDecimal) {
          return <div key={key} aria-hidden="true" />;
        }

        return (
          <button
            key={key}
            type="button"
            aria-label={isBackspace ? "Effacer" : key}
            onClick={() => {
              if (isBackspace) return onBackspace?.();
              if (isDecimal) return onDecimal?.();
              onDigit?.(key);
            }}
            className={cn(
              "flex h-14 items-center justify-center text-[1.75rem] font-medium tabular-nums",
              isBoxed && "m-1 rounded-md bg-surface",
              isGreen ? "text-white" : "text-ink"
            )}
          >
            {isBackspace ? (
              <AssetIcon name="chevron-left" size={22} tone={isGreen ? "white" : "dark"} />
            ) : (
              key
            )}
          </button>
        );
      })}
    </div>
  );
}
