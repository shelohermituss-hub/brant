"use client";

import { useRouter } from "next/navigation";
import { Bell, ShieldCheck } from "lucide-react";
import { AssetIcon } from "@/components/ui/asset-icon";

const CYCLE_PROGRESS = 6;
const CYCLE_TOTAL = 10;

export function StocksScreen() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button type="button" onClick={() => router.push("/home")} aria-label="Retour">
          <AssetIcon name="chevron-left" className="text-ink" size={22} />
        </button>
        <span className="text-lg font-bold text-ink">Sik yo</span>
        <Bell className="text-purple" size={22} />
      </div>

      <div className="flex gap-3 overflow-x-auto px-4 pt-4 pb-8">
        <button
          type="button"
          onClick={() => router.push("/stocks/cycle")}
          className="relative flex h-40 w-24 shrink-0 flex-col justify-between overflow-hidden rounded-lg bg-green-deep p-3 text-left"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">
            {CYCLE_PROGRESS}
          </span>
          <div className="flex flex-col gap-2">
            <span className="text-[0.85rem] leading-tight font-bold text-white">
              Pwochen sik
            </span>
            <span className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
              <span
                className="block h-full rounded-full bg-white"
                style={{ width: `${(CYCLE_PROGRESS / CYCLE_TOTAL) * 100}%` }}
              />
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => router.push("/stocks/score")}
          className="flex h-40 w-24 shrink-0 flex-col justify-between rounded-lg bg-ink p-3 text-left"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
            <ShieldCheck className="text-white" size={16} />
          </span>
          <div>
            <p className="text-xl font-bold text-white">92</p>
            <p className="text-[0.85rem] text-white/70">Kredi/Skò</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => router.push("/refer")}
          className="flex h-40 w-24 shrink-0 flex-col justify-between rounded-lg bg-purple p-3 text-left"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <AssetIcon name="gift" size={16} tone="white" />
          </span>
          <div>
            <p className="text-[0.85rem] leading-tight font-bold text-white">Envite</p>
            <p className="text-[0.8rem] text-white/70">+50 HTG</p>
          </div>
        </button>
      </div>
    </div>
  );
}
