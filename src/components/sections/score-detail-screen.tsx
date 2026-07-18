"use client";

import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { AssetIcon } from "@/components/ui/asset-icon";
import { cn } from "@/lib/utils";

const SIK_HISTORY: { sik: number; status: "paid" | "wait" | "late" }[] = [
  { sik: 1, status: "paid" },
  { sik: 2, status: "paid" },
  { sik: 3, status: "paid" },
  { sik: 4, status: "late" },
  { sik: 5, status: "paid" },
  { sik: 6, status: "paid" },
];

const HEIGHT_BY_STATUS: Record<(typeof SIK_HISTORY)[number]["status"], string> = {
  paid: "h-full bg-paid",
  wait: "h-2/3 bg-wait",
  late: "h-1/3 bg-late",
};

const INFO_ROWS = [
  { label: "Skò aktyèl", value: "92 / 100" },
  { label: "Sik peye alè", value: "5 sou 6" },
  { label: "Pozisyon aksesib", value: "4 – 10" },
];

export function ScoreDetailScreen() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="px-4 pt-4">
        <button type="button" onClick={() => router.push("/stocks")} aria-label="Retour">
          <AssetIcon name="chevron-left" className="text-ink" size={22} />
        </button>
      </div>

      <div className="flex flex-col gap-2 px-5 pt-3 pb-2">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-muted">
          <ShieldCheck className="text-ink" size={26} />
        </span>
        <span className="text-xl font-bold text-ink">Kredi/Skò</span>
        <span className="text-[0.95rem] font-medium text-ink-secondary">
          Istwa pa sik, pa jou
        </span>
      </div>

      <div className="flex h-28 items-end gap-2 px-5 pt-6">
        {SIK_HISTORY.map(({ sik, status }) => (
          <div key={sik} className="flex h-full flex-1 items-end">
            <span className={cn("w-full rounded-full", HEIGHT_BY_STATUS[status])} />
          </div>
        ))}
      </div>
      <div className="flex gap-2 px-5 pb-2">
        {SIK_HISTORY.map(({ sik }) => (
          <span key={sik} className="flex-1 text-center text-xs text-ink-secondary">
            S{sik}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-4 px-5 pt-4 pb-8">
        {INFO_ROWS.map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <span className="text-[0.95rem] text-ink-secondary">{row.label}</span>
            <span className="text-[0.95rem] font-bold text-ink">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
