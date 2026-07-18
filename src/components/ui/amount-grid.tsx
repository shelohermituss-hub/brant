const DEFAULT_PRESETS = ["1 000", "2 500", "5 000", "10 000", "25 000", "..."];

interface AmountGridProps {
  presets?: string[];
  onSelect?: (label: string) => void;
}

export function AmountGrid({ presets = DEFAULT_PRESETS, onSelect }: AmountGridProps) {
  return (
    <div className="grid grid-cols-3 gap-3 px-5">
      {presets.map((label) => (
        <button
          key={label}
          type="button"
          onClick={() => onSelect?.(label)}
          className="flex h-16 items-center justify-center rounded-md bg-surface-muted text-lg font-bold text-ink"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
