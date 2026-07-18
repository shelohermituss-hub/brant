"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AssetIcon } from "@/components/ui/asset-icon";
import { createClient } from "@/lib/supabase/client";
import { formatHtg } from "@/lib/utils";

interface CyclePaymentAmountScreenProps {
  groupId?: string;
}

export function CyclePaymentAmountScreen({ groupId }: CyclePaymentAmountScreenProps) {
  const router = useRouter();
  const [monthlyAmount, setMonthlyAmount] = useState<number | null>(null);

  useEffect(() => {
    if (!groupId) return;
    let cancelled = false;
    createClient()
      .from("groups")
      .select("monthly_amount")
      .eq("id", groupId)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setMonthlyAmount(data?.monthly_amount ?? null);
      });
    return () => {
      cancelled = true;
    };
  }, [groupId]);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-green-deep">
      <div className="flex items-center justify-between px-5 pt-4">
        <button
          type="button"
          onClick={() => router.push(groupId ? `/group?id=${groupId}` : "/stocks/cycle")}
          aria-label="Fermer"
        >
          <AssetIcon name="cross" tone="white" size={22} />
        </button>
      </div>

      <p className="pt-2 text-center text-[1.05rem] text-white">Peye kotizasyon</p>

      <div className="flex flex-1 flex-col items-center justify-center gap-2">
        <p className="text-[3.5rem] leading-none font-bold text-white">
          {monthlyAmount === null ? "…" : formatHtg(monthlyAmount)}
        </p>
        <p className="text-sm text-white/70">Kantite fiks pou sik sa a</p>
      </div>

      <div className="px-4 pt-2 pb-6">
        <button
          type="button"
          disabled={!groupId || monthlyAmount === null}
          onClick={() => router.push(`/stocks/cycle/review?groupId=${groupId}`)}
          className="h-14 w-full rounded-full bg-white/15 text-[1.05rem] font-bold text-white disabled:opacity-50"
        >
          Peye
        </button>
      </div>
    </div>
  );
}
