import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { AssetIcon, type AssetIconName } from "@/components/ui/asset-icon";

interface SettingsListRowProps {
  icon: LucideIcon | AssetIconName;
  label: string;
  badge?: string;
  iconStyle?: "bare" | "badge";
  showChevron?: boolean;
  onClick?: () => void;
}

export function SettingsListRow({
  icon,
  label,
  badge,
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
      className="flex w-full items-center gap-4 border-b border-border px-5 py-4 text-left last:border-b-0"
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
        <span className="rounded-full bg-green/10 px-3 py-1 text-sm font-bold text-green">
          {badge}
        </span>
      )}
      {showChevron && <AssetIcon name="chevron-right" className="text-ink-secondary" size={16} />}
    </button>
  );
}
