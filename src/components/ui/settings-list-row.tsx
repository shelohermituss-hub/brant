import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { AssetIcon, type AssetIconName } from "@/components/ui/asset-icon";

type BadgeTone = "paid" | "wait";

const BADGE_TONE_CLASSES: Record<BadgeTone, string> = {
  paid: "bg-paid/10 text-paid",
  wait: "bg-wait/10 text-wait",
};

interface SettingsListRowProps {
  icon: LucideIcon | AssetIconName;
  label: string;
  badge?: string;
  badgeTone?: BadgeTone;
  iconStyle?: "bare" | "badge";
  showChevron?: boolean;
  onClick?: () => void;
}

export function SettingsListRow({
  icon,
  label,
  badge,
  badgeTone = "paid",
  iconStyle = "bare",
  showChevron = true,
  onClick,
}: SettingsListRowProps) {
  const renderIcon = (size: number, className?: string) =>
    typeof icon === "string" ? (
      <AssetIcon name={icon} size={size} className={className} />
    ) : (
      (() => {
        const Icon = icon;
        return <Icon size={size} className={className} />;
      })()
    );

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 border-b border-border px-5 py-4 text-left outline-none last:border-b-0 transition-transform duration-[var(--duration-tap)] ease-[var(--ease-out)] active:scale-[0.97] motion-reduce:active:scale-100 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset"
    >
      {iconStyle === "badge" ? (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-ink text-white">
          {renderIcon(16)}
        </span>
      ) : (
        renderIcon(20, cn("shrink-0 text-ink"))
      )}
      <span className="flex-1 text-[0.95rem] font-bold text-ink">{label}</span>
      {badge && (
        <span className={cn("rounded-full px-3 py-1 text-sm font-bold", BADGE_TONE_CLASSES[badgeTone])}>
          {badge}
        </span>
      )}
      {showChevron && <AssetIcon name="chevron-right" className="text-ink-secondary" size={16} />}
    </button>
  );
}
