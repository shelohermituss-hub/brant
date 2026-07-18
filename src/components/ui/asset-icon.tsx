import {
  CreditCard,
  X,
  Gift,
  History,
  Bell,
  House,
  ScanLine,
  Search,
  User,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS = {
  card: CreditCard,
  cross: X,
  gift: Gift,
  history: History,
  notifications: Bell,
  save: House,
  scan: ScanLine,
  search: Search,
  user: User,
  arrow: ArrowUp,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  "chevron-down": ChevronDown,
} satisfies Record<string, LucideIcon>;

export type AssetIconName = keyof typeof ICONS;

interface AssetIconProps {
  name: AssetIconName;
  size?: number;
  className?: string;
  /** "dark" utilise --color-ink ; "white" pour les fonds colorés. Toujours surchageable via className. */
  tone?: "dark" | "white";
}

/**
 * Icônes lucide-react en trait épais ("bold"), en remplacement des PNG
 * basse résolution (16-32px) extraits du kit Figma qui pixelisaient à
 * l'affichage.
 */
export function AssetIcon({ name, size = 24, className, tone = "dark" }: AssetIconProps) {
  const Icon = ICONS[name];

  return (
    <Icon
      size={size}
      strokeWidth={2.5}
      className={cn(tone === "white" ? "text-white" : "text-ink", "shrink-0", className)}
    />
  );
}
