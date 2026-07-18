"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Landmark, CreditCard, DollarSign, Search, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", icon: Landmark },
  { href: "/card", icon: CreditCard },
  { href: "/pay", icon: DollarSign },
  { href: "/search", icon: Search },
  { href: "/activity", icon: Clock },
] as const;

interface BottomTabBarProps {
  tone?: "light" | "dark";
}

export function BottomTabBar({ tone = "light" }: BottomTabBarProps) {
  const pathname = usePathname();
  const isDark = tone === "dark";

  return (
    <nav className={cn("w-full shrink-0", !isDark && "bg-surface")}>
      <div className="flex items-center justify-between px-8 py-3">
        {TABS.map(({ href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} className="p-2">
              <Icon
                size={26}
                strokeWidth={2}
                className={cn(
                  isDark
                    ? active
                      ? "text-white"
                      : "text-white/60"
                    : active
                      ? "text-ink"
                      : "text-ink-secondary/60"
                )}
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
