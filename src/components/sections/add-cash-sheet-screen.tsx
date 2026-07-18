"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HomeScreen } from "@/components/sections/home-screen";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { AmountGrid } from "@/components/ui/amount-grid";
import { PillButton } from "@/components/ui/pill-button";

export function AddCashSheetScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="relative flex flex-1 flex-col">
      <div className="pointer-events-none absolute inset-0">
        <HomeScreen variant="empty" />
      </div>

      <Sheet
        open
        onOpenChange={(open) => {
          if (!open) router.push("/home");
        }}
      >
        <SheetContent className="gap-7 pb-8">
          <SheetTitle className="text-center text-[1.05rem] font-normal text-ink">
            Add Cash
          </SheetTitle>

          <AmountGrid
            onSelect={(label) => {
              if (label === "...") {
                router.push("/add-cash/amount");
              } else {
                setSelected(label);
              }
            }}
          />

          <div className="px-4">
            <PillButton
              className="w-full"
              onClick={() =>
                router.push(selected ? "/add-cash/success" : "/add-cash/amount")
              }
            >
              Add
            </PillButton>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
