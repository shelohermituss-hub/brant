"use client";

import Image from "next/image";
import Link from "next/link";
import { SurfaceCard } from "@/components/ui/surface-card";
import { PillButton } from "@/components/ui/pill-button";
import { SavingsIcon } from "@/components/ui/savings-icon";
import { AssetIcon } from "@/components/ui/asset-icon";
import { useCurrentAppUser } from "@/lib/use-current-app-user";
import { formatHtg } from "@/lib/utils";

function CardTitle({ label, interactive = false }: { label: string; interactive?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[1.05rem] font-bold text-ink">{label}</span>
      {interactive && <AssetIcon name="chevron-right" size={16} className="text-ink-secondary" />}
    </div>
  );
}

export function HomeScreen() {
  const { profile } = useCurrentAppUser();

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-surface-muted px-4 pt-4 pb-6">
      <header className="flex items-center justify-between px-1 pb-1">
        <h1 className="text-[2.1rem] font-bold text-ink">Sòlid</h1>
        <Link
          href="/account"
          aria-label="Kont ou"
          className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-ink-secondary/30"
        >
          {profile?.avatar_url && (
            <Image src={profile.avatar_url} alt="" fill className="object-cover" />
          )}
        </Link>
      </header>

      <SurfaceCard className="flex flex-col gap-7">
        <div className="flex items-start justify-between">
          <span className="text-lg font-bold text-ink">Balans Wallet</span>
          <Link
            href="/payment-hub/wallet"
            className="flex items-center gap-0.5 text-sm text-ink-secondary"
          >
            Detay
            <AssetIcon name="chevron-right" size={14} />
          </Link>
        </div>
        <p className="text-[2.75rem] leading-none font-bold text-ink">
          {formatHtg(profile?.wallets?.balance ?? 0)}
        </p>
        <div className="flex gap-3">
          <PillButton
            variant="secondary"
            href="/payment-hub/wallet/deposit"
            className="h-12 flex-1 text-[0.95rem]"
          >
            Ajoute lajan
          </PillButton>
          <PillButton
            variant="secondary"
            href="/payment-hub/wallet/transfer"
            className="h-12 flex-1 text-[0.95rem]"
          >
            Retire lajan
          </PillButton>
        </div>
      </SurfaceCard>

      <div className="grid grid-cols-2 gap-3">
        <SurfaceCard className="flex flex-col gap-4">
          <CardTitle label="Savings" />
          <SavingsIcon />
          <div>
            <p className="text-xl font-bold text-ink">$0.00</p>
            <p className="text-sm text-ink-secondary">Save for a goal</p>
          </div>
        </SurfaceCard>

        <SurfaceCard className="flex flex-col gap-4">
          <CardTitle label="Buy bitcoin" />
          <div className="relative -mx-1 -mb-1 aspect-square overflow-hidden rounded-md">
            <Image
              src="/images/illustration-bitcoin.png"
              alt="Buy bitcoin"
              fill
              className="object-cover"
            />
          </div>
        </SurfaceCard>

        <SurfaceCard as={Link} href="/stocks" className="flex flex-col gap-4">
          <CardTitle label="Invest in stocks" interactive />
          <div className="relative -mx-1 -mb-1 aspect-square overflow-hidden rounded-md">
            <Image
              src="/images/illustration-stocks.png"
              alt="Invest in stocks"
              fill
              className="object-cover"
            />
          </div>
        </SurfaceCard>

        <SurfaceCard className="flex flex-col gap-4">
          <CardTitle label="Free tax filing" />
          <div className="relative -mx-1 -mb-1 aspect-square overflow-hidden rounded-md">
            <Image
              src="/images/illustration-tax-filing.png"
              alt="Free tax filing"
              fill
              className="object-cover"
            />
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
