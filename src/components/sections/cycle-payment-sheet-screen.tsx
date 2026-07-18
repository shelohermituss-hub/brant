"use client";

import { useRouter } from "next/navigation";
import { CycleDetailScreen } from "@/components/sections/cycle-detail-screen";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { AmountGrid } from "@/components/ui/amount-grid";
import { PillButton } from "@/components/ui/pill-button";

export function CyclePaymentSheetScreen() {
  const router = useRouter();

  return (
    <div className="relative flex flex-1 flex-col">
      <div className="pointer-events-none absolute inset-0">
        <CycleDetailScreen />
      </div>

      <Sheet
        open
        onOpenChange={(open) => {
          if (!open) router.push("/stocks/cycle");
        }}
      >
        <SheetContent className="gap-6 pb-8">
          <div className="flex flex-col items-center gap-1">
            <SheetTitle className="text-lg font-bold text-ink">
              Peye kotizasyon
            </SheetTitle>
            <span className="text-[0.95rem] text-ink-secondary">
              Kotizasyon mansyèl — sik 6
            </span>
          </div>

          <AmountGrid onSelect={() => router.push("/stocks/cycle/review")} />

          <div className="px-4">
            <PillButton
              variant="primary"
              className="w-full"
              onClick={() => router.push("/stocks/cycle/review")}
            >
              Konfime
            </PillButton>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
