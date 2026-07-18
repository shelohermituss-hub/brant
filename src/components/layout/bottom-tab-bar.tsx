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

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="w-full shrink-0 bg-surface">
      <div className="flex items-center justify-between px-8 py-3">
        {TABS.map(({ href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} className="p-2">
              <Icon
                size={26}
                strokeWidth={2}
                className={cn(active ? "text-ink" : "text-ink-secondary/60")}
              />
            </Link>
          );
        })}
      </div>
      <div className="flex justify-center pb-2">
        <div className="h-[5px] w-32 rounded-full bg-ink" />
      </div>
    </nav>
  );
}
