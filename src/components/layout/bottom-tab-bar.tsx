"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AssetIcon, type AssetIconName } from "@/components/ui/asset-icon";
import { cn } from "@/lib/utils";

const TABS: { href: string; icon: AssetIconName }[] = [
  { href: "/home", icon: "save" },
  { href: "/card", icon: "card" },
  { href: "/pay", icon: "pay" },
  { href: "/search", icon: "search" },
  { href: "/activity", icon: "history" },
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
            <Link key={href} href={href} className="p-2">
              <AssetIcon
                name={icon}
                size={26}
                tone={isDark ? "white" : "dark"}
                className={cn(!active && "opacity-50")}
              />
            </Link>
          );
        })}
      </div>
      <div className="flex justify-center pb-2">
        <div className={cn("h-[5px] w-32 rounded-full", isDark ? "bg-white" : "bg-ink")} />
      </div>
    </nav>
  );
}
