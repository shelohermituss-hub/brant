"use client";

import { useRouter } from "next/navigation";
import { StockDetailScreen } from "@/components/sections/stock-detail-screen";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Chip } from "@/components/ui/chip";
import { AmountGrid } from "@/components/ui/amount-grid";
import { PillButton } from "@/components/ui/pill-button";

export function BuyStockSheetScreen() {
  const router = useRouter();

  return (
    <div className="relative flex flex-1 flex-col">
      <div className="pointer-events-none absolute inset-0">
        <StockDetailScreen />
      </div>

      <Sheet
        open
        onOpenChange={(open) => {
          if (!open) router.push("/stocks/meta");
        }}
      >
        <SheetContent className="gap-6 pb-8">
          <div className="flex flex-col items-center gap-1">
            <SheetTitle className="text-lg font-bold text-ink">
              Buy Meta
            </SheetTitle>
            <span className="text-[0.95rem] text-ink-secondary">
              One-Time Order
            </span>
            <Chip variant="outline" withChevron className="mt-1 text-blue">
              Change Order Type
            </Chip>
          </div>

          <AmountGrid
            onSelect={() => router.push("/stocks/meta/review")}
          />

          <div className="px-4">
            <PillButton
              variant="blue"
              className="w-full"
              onClick={() => router.push("/stocks/meta/review")}
            >
              Add
            </PillButton>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
