"use client";

import { useRouter } from "next/navigation";
import { AssetIcon } from "@/components/ui/asset-icon";
import { SurfaceCard } from "@/components/ui/surface-card";
import { useCurrentAppUser } from "@/lib/use-current-app-user";
import { MERCHANT_TIERS, type MerchantTier } from "@/lib/merchant-tiers";
import { formatHtg } from "@/lib/utils";

const TIER_ORDER: MerchantTier[] = ["bronze", "silver", "gold"];

export function AccountTierScreen() {
  const router = useRouter();
  const { profile } = useCurrentAppUser();
  const currentTier: MerchantTier =
    profile?.merchant_tier === "silver" || profile?.merchant_tier === "gold"
      ? profile.merchant_tier
      : "bronze";

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-surface-muted">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-5 pt-4">
        <button type="button" onClick={() => router.push("/account")} aria-label="Retou">
          <AssetIcon name="chevron-left" className="text-ink" size={22} />
        </button>
        <span className="text-lg font-bold text-ink">Kategori kont</span>
        <span />
      </div>

      <p className="px-5 pt-4 pb-2 text-[0.95rem] text-ink-secondary">
        Kategori kont ou detèmine plafon wallet ou ak frè kolèkt sou chak
        kotizasyon.
      </p>

      <div className="flex flex-col gap-3 px-4 pt-2 pb-8">
        {TIER_ORDER.map((tier) => {
          const info = MERCHANT_TIERS[tier];
          const isCurrent = tier === currentTier;
          return (
            <SurfaceCard
              key={tier}
              className={isCurrent ? "flex flex-col gap-3 ring-2 ring-green-deep" : "flex flex-col gap-3"}
            >
              <div className="flex items-center justify-between">
                <span className="text-[1.1rem] font-bold text-ink">{info.label}</span>
                {isCurrent && (
                  <span className="rounded-full bg-green-deep/10 px-3 py-1 text-xs font-bold text-green-deep">
                    Kategori aktyèl ou
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between text-[0.9rem]">
                <span className="text-ink-secondary">Plafon wallet</span>
                <span className="font-bold text-ink">{formatHtg(info.walletCeiling)}</span>
              </div>
              <div className="flex items-center justify-between text-[0.9rem]">
                <span className="text-ink-secondary">Frè kolèkt</span>
                <span className="font-bold text-ink">{(info.collectionFeeRate * 100).toString().replace(".", ",")} %</span>
              </div>
              <div className="flex items-center justify-between text-[0.9rem]">
                <span className="text-ink-secondary">Kont bankè</span>
                <span className="font-bold text-ink">{info.bankAccount}</span>
              </div>
            </SurfaceCard>
          );
        })}
      </div>
    </div>
  );
}
