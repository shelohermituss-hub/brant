import { ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsListRowProps {
  icon: LucideIcon;
  label: string;
  badge?: string;
  iconStyle?: "bare" | "badge";
  showChevron?: boolean;
  onClick?: () => void;
}

export function SettingsListRow({
  icon: Icon,
  label,
  badge,
  iconStyle = "bare",
  showChevron = true,
  onClick,
}: SettingsListRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 border-b border-border px-5 py-4 text-left last:border-b-0"
    >
      {iconStyle === "badge" ? (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-ink text-white">
          <Icon size={16} />
        </span>
      ) : (
        <Icon className={cn("shrink-0 text-ink")} size={22} />
      )}
      <span className="flex-1 text-[0.95rem] font-bold text-ink">{label}</span>
      {badge && (
        <span className="rounded-full bg-green/10 px-3 py-1 text-sm font-bold text-green">
          {badge}
        </span>
      )}
      {showChevron && <ChevronRight className="text-ink-secondary" size={18} />}
    </button>
  );
}
