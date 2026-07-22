"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DollarSign, Landmark, Loader, Receipt, type LucideIcon } from "lucide-react";
import { AssetIcon, type AssetIconName } from "@/components/ui/asset-icon";
import { cn } from "@/lib/utils";

const TABS: { href: string; icon: AssetIconName | LucideIcon }[] = [
  { href: "/home", icon: Landmark },
  { href: "/card", icon: Loader },
  { href: "/payment-hub/wallet", icon: DollarSign },
  { href: "/search", icon: "search" },
  { href: "/payment-hub", icon: Receipt },
];

interface BottomTabBarProps {
  tone?: "light" | "dark";
}

export function BottomTabBar({ tone = "light" }: BottomTabBarProps) {
  const pathname = usePathname();
  const isDark = tone === "dark";

  return (
    <nav className={cn("w-full shrink-0", !isDark && "bg-surface")}>
      <div className="flex items-center justify-between px-8 py-3">
        {TABS.map(({ href, icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="p-2 transition-transform duration-[var(--duration-tap)] ease-[var(--ease-out)] active:scale-[0.9] motion-reduce:active:scale-100"
            >
              {typeof icon === "string" ? (
                <AssetIcon
                  name={icon}
                  size={26}
                  tone={isDark ? "white" : "dark"}
                  className={cn(
                    "transition-opacity duration-[var(--duration-tap)]",
                    !active && "opacity-50"
                  )}
                />
              ) : (
                (() => {
                  const Icon = icon;
                  return (
                    <Icon
                      size={26}
                      strokeWidth={2.5}
                      className={cn(
                        "transition-opacity duration-[var(--duration-tap)]",
                        isDark ? "text-white" : "text-ink",
                        !active && "opacity-50"
                      )}
                    />
                  );
                })()
              )}
            </Link>
          );
        })}
      </div>
      <div className="pb-[max(0.5rem,env(safe-area-inset-bottom))]" />
    </nav>
  );
}
