"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ArrowDown, Gift, Infinity as InfinityIcon } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";
import { NewsCard } from "@/components/ui/news-card";
import { cn } from "@/lib/utils";

const RANGES = ["1D", "1W", "1M", "1Y", "ALL"] as const;

export function StockDetailScreen() {
  const router = useRouter();
  const [range, setRange] = useState<(typeof RANGES)[number]>("1D");

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="px-4 pt-4">
        <button type="button" onClick={() => router.push("/stocks")} aria-label="Retour">
          <ChevronLeft className="text-ink" size={26} />
        </button>
      </div>

      <div className="flex flex-col gap-2 px-5 pt-3 pb-2">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-muted">
          <InfinityIcon className="text-blue" size={28} />
        </span>
        <span className="text-xl font-bold text-ink">Meta</span>
        <span className="flex items-center gap-1 text-[0.95rem] font-medium text-blue">
          <ArrowDown size={14} />
          0.56%
        </span>
      </div>

      <div className="px-2 pt-4 pb-2">
        <svg viewBox="0 0 393 140" className="h-36 w-full" fill="none">
          <path
            d="M0,108 L20,120 L40,84 L62,96 L78,58 L96,64 L112,86 L128,96 L146,76 L164,60 L182,64 L200,52 L218,58 L238,40 L258,44 L280,28 L300,34 L320,26 L340,20 L360,24 L380,16 L393,20"
            stroke="var(--color-blue)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="flex justify-between px-5 pb-5">
        {RANGES.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRange(r)}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm font-medium",
              r === range ? "bg-surface-muted text-ink" : "text-ink-secondary"
            )}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="flex gap-3 px-4 pb-6">
        <PillButton
          variant="blue"
          className="flex-1"
          onClick={() => router.push("/stocks/meta/buy")}
        >
          Buy
        </PillButton>
        <PillButton variant="blue" className="flex-1">
          Follow
        </PillButton>
        <PillButton variant="blue" className="w-16 shrink-0">
          <Gift size={20} />
        </PillButton>
      </div>

      <div className="flex gap-3 overflow-x-auto px-4 pb-8">
        <NewsCard
          sourceInitials="C"
          sourceColor="#2D65DB"
          sourceName="CNBC"
          time="8H AGO"
          headline="Top Wall Street analysts expect these stocks to compound their returns"
        />
        <NewsCard
          sourceInitials="MW"
          sourceColor="#111111"
          sourceName="MarketWatch"
          time="8H AGO"
          headline="Expectations for Nvidia's earnings are massive. Will they even matter?"
        />
      </div>
    </div>
  );
}
