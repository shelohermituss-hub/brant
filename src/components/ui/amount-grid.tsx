const PRESETS = ["$1", "$10", "$20", "$50", "$100", "..."];

interface AmountGridProps {
  onSelect?: (label: string) => void;
}

export function AmountGrid({ onSelect }: AmountGridProps) {
  return (
    <div className="grid grid-cols-3 gap-3 px-5">
      {PRESETS.map((label) => (
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
