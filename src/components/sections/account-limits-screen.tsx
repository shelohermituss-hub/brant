"use client";

import { useRouter } from "next/navigation";
import { AssetIcon } from "@/components/ui/asset-icon";
import { SurfaceCard } from "@/components/ui/surface-card";
import { useCurrentAppUser } from "@/lib/use-current-app-user";
import { merchantTierInfoFor } from "@/lib/merchant-tiers";
import { MONCASH_TRANSFER_MAX } from "@/lib/moncash-limits";
import { formatHtg } from "@/lib/utils";

export function AccountLimitsScreen() {
  const router = useRouter();
  const { profile } = useCurrentAppUser();
  const tierInfo = merchantTierInfoFor(profile?.merchant_tier ?? null);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-surface-muted">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-5 pt-4">
        <button type="button" onClick={() => router.push("/account")} aria-label="Retou">
          <AssetIcon name="chevron-left" className="text-ink" size={22} />
        </button>
        <span className="text-lg font-bold text-ink">Limit kont</span>
        <span />
      </div>

      <div className="flex flex-col gap-4 px-4 pt-6 pb-8">
        <SurfaceCard className="flex flex-col gap-3">
          <span className="text-[0.95rem] font-bold text-ink">Plafon wallet ({tierInfo.label})</span>
          <p className="text-[2rem] leading-none font-bold text-ink">{formatHtg(tierInfo.walletCeiling)}</p>
          <p className="text-sm text-ink-secondary">
            Balans total wallet ou pa ka depase limit sa a, selon kategori kont ou.
          </p>
          <button
            type="button"
            onClick={() => router.push("/account/tier")}
            className="self-start text-sm font-bold text-green-deep"
          >
            Wè lòt kategori yo
          </button>
        </SurfaceCard>

        <SurfaceCard className="flex flex-col gap-3">
          <span className="text-[0.95rem] font-bold text-ink">Plafon vèsman MonCash</span>
          <p className="text-[2rem] leading-none font-bold text-ink">{formatHtg(MONCASH_TRANSFER_MAX)}</p>
          <p className="text-sm text-ink-secondary">
            Maksimòm ou ka voye nan yon sèl vèsman soti nan wallet ou pou MonCash.
            Limit sa a aplike menm jan pou tout kategori kont.
          </p>
        </SurfaceCard>
      </div>
    </div>
  );
}
