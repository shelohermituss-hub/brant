"use client";

import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Bell,
  Search,
  Asterisk,
  Landmark,
  Briefcase,
  Infinity as InfinityIcon,
  ArrowDown,
} from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";
import { NewsCard } from "@/components/ui/news-card";
import { Sparkline } from "@/components/ui/sparkline";

const STOCK_CARDS = [
  { name: "Nike", bg: "#000000", label: null },
  { name: "GE", bg: "#4871B3", label: "GE" },
  { name: "Coca-Cola", bg: "#CF3830", label: "Coca-Cola" },
  { name: "Walmart", bg: "#347BC0", label: null },
] as const;

const CATEGORIES = [
  { name: "Banking & Finance", bg: "#CC6B42", icon: Landmark },
  { name: "Business Services", bg: "#D39C64", icon: Briefcase },
  { name: "Retail", bg: "#F5BA61", icon: Briefcase },
] as const;

function StockLogoCard({ name, bg, label }: (typeof STOCK_CARDS)[number]) {
  return (
    <div
      className="relative flex h-40 w-24 shrink-0 flex-col items-center justify-center overflow-hidden rounded-lg"
      style={{ backgroundColor: bg }}
    >
      {name === "Walmart" ? (
        <Asterisk className="text-[#FFC220]" size={30} strokeWidth={3} />
      ) : name === "Nike" ? (
        <svg width="34" height="20" viewBox="0 0 34 20" fill="none">
          <path
            d="M0 15 C6 17 12 15 18 9 C22 5 27 1 34 0 C25 4 21 10 15 16 C10 20 4 19 0 15Z"
            fill="white"
          />
        </svg>
      ) : (
        <span
          className={
            label === "Coca-Cola"
              ? "font-serif text-[0.95rem] font-bold text-white italic"
              : "flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white"
          }
        >
          {label}
        </span>
      )}
      <div className="absolute right-0 bottom-3 left-0 px-2">
        <Sparkline
          color="white"
          path="M2,20 L14,18 L26,22 L38,10 L50,14 L62,4 L74,8 L86,2 L98,6"
        />
      </div>
    </div>
  );
}

export function StocksScreen() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button type="button" onClick={() => router.push("/")} aria-label="Retour">
          <ChevronLeft className="text-ink" size={26} />
        </button>
        <span className="text-lg font-bold text-ink">Stocks</span>
        <Bell className="text-purple" size={24} />
      </div>

      <div className="px-4 pb-5">
        <div className="flex h-11 items-center gap-2 rounded-full bg-surface-muted px-4">
          <Search className="text-ink-secondary" size={18} />
          <span className="text-[0.95rem] text-placeholder">
            Search Stocks and Categories
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 px-6 pb-5 text-center">
        <h1 className="text-[1.75rem] leading-tight font-bold text-ink">
          Start investing with just $1
        </h1>
        <p className="text-[0.95rem] text-ink-secondary">
          Buy stocks in your favorite companies to give your money a chance to
          grow.
        </p>
      </div>

      <div className="flex gap-3 overflow-x-auto px-4 pb-6">
        {STOCK_CARDS.map((card) => (
          <StockLogoCard key={card.name} {...card} />
        ))}
      </div>

      <div className="px-4 pb-6">
        <PillButton variant="purple" className="w-full">
          Buy stocks
        </PillButton>
      </div>

      <div className="flex gap-3 overflow-x-auto px-4 pb-6">
        <NewsCard
          sourceInitials="MW"
          sourceColor="#111111"
          sourceName="MarketWatch"
          time="8H AGO"
          headline="Expectations for Nvidia's earnings are massive. Will they even matter?"
        />
        <NewsCard
          sourceInitials="C"
          sourceColor="#2D65DB"
          sourceName="CNBC"
          time="8H AGO"
          headline="Top Wall Street analysts expect these stocks to compound their returns"
        />
      </div>

      <div className="flex gap-3 overflow-x-auto px-4 pb-6">
        {CATEGORIES.map(({ name, bg, icon: Icon }) => (
          <div
            key={name}
            className="flex h-32 w-32 shrink-0 flex-col items-start justify-between rounded-lg p-4"
            style={{ backgroundColor: bg }}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
              <Icon className="text-ink" size={16} />
            </span>
            <span className="text-[0.95rem] leading-tight font-bold text-white">
              {name}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 px-4 pb-8">
        <div>
          <h2 className="text-xl font-bold text-ink">Most Traded Monthly</h2>
          <p className="pt-1 text-[0.95rem] text-ink-secondary">
            These stocks were bought and sold more over the last 30 days than
            any other stocks available on Cash App.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/stocks/meta")}
          className="flex items-center gap-3 text-left"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-muted">
            <InfinityIcon className="text-blue" size={18} />
          </span>
          <span className="flex-1 text-[0.95rem] font-bold text-ink">Meta</span>
          <span className="flex items-center gap-1 text-[0.95rem] text-ink-secondary">
            <ArrowDown size={14} />
            1.70%
          </span>
        </button>
      </div>
    </div>
  );
}
