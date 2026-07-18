import Image from "next/image";
import { cn } from "@/lib/utils";

const ICONS = {
  card: "/icons/card.png",
  cross: "/icons/cross.png",
  gift: "/icons/gift.png",
  history: "/icons/history.png",
  notifications: "/icons/notifications.png",
  pay: "/icons/pay.png",
  save: "/icons/save.png",
  scan: "/icons/scan.png",
  search: "/icons/search.png",
  user: "/icons/user.png",
  arrow: "/icons/arrow.png",
  "chevron-left": "/icons/chevron-left.png",
  "chevron-right": "/icons/chevron-right.png",
  "chevron-down": "/icons/chevron-down.png",
} as const;

export type AssetIconName = keyof typeof ICONS;

interface AssetIconProps {
  name: AssetIconName;
  size?: number;
  className?: string;
  /** "dark" garde la couleur d'origine (proche de --color-ink) ; "white" l'inverse pour les fonds colorés. */
  tone?: "dark" | "white";
}

/**
 * Icône pixel-exacte extraite du kit de composants Figma réel
 * (design-refs/Cash_App_UI_2023_Community_extra2/Icon/*.png).
 */
export function AssetIcon({ name, size = 24, className, tone = "dark" }: AssetIconProps) {
  return (
    <Image
      src={ICONS[name]}
      alt=""
      width={size}
      height={size}
      unoptimized
      className={cn(
        "inline-block shrink-0 object-contain",
        tone === "white" && "brightness-0 invert",
        className
      )}
    />
  );
}
