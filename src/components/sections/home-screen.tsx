"use client";

import Image from "next/image";
import Link from "next/link";
import { SurfaceCard } from "@/components/ui/surface-card";
import { Sparkline } from "@/components/ui/sparkline";
import { SavingsIcon } from "@/components/ui/savings-icon";
import { AssetIcon } from "@/components/ui/asset-icon";
import { ConnectedAccountsCard } from "@/components/ui/connected-accounts-card";
import { useCurrentAppUser } from "@/lib/use-current-app-user";

function CardTitle({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[1.05rem] font-bold text-ink">{label}</span>
      <AssetIcon name="chevron-right" size={16} className="text-ink-secondary" />
    </div>
  );
}

export function HomeScreen() {
  const { authUserId, profile } = useCurrentAppUser();
  const populated = !!authUserId;

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

      <div className="px-1 pb-1">
        <span className="text-xs font-semibold tracking-wide text-ink-secondary">
          KONT KONEKTE
        </span>
      </div>
      <ConnectedAccountsCard
        walletBalance={profile?.wallets?.balance ?? null}
        moncashNumber={profile?.moncash_number ?? null}
        walletHref="/payment-hub/wallet"
        moncashHref="/payment-hub/method"
      />

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
          <CardTitle label={populated ? "Bitcoin" : "Buy bitcoin"} />
          {populated ? (
            <>
              <Sparkline
                color="var(--color-cyan)"
                path="M2,28 L14,26 L26,27 L38,18 L50,20 L62,10 L74,13 L86,4 L98,7"
              />
              <div>
                <p className="text-xl font-bold text-ink">$92.05</p>
                <p className="flex items-center gap-1 text-sm text-ink-secondary">
                  <AssetIcon name="arrow" size={10} className="rotate-180" />
                  0.50% today
                </p>
              </div>
            </>
          ) : (
            <div className="relative -mx-1 -mb-1 aspect-square overflow-hidden rounded-md">
              <Image
                src="/images/illustration-bitcoin.png"
                alt="Buy bitcoin"
                fill
                className="object-cover"
              />
            </div>
          )}
        </SurfaceCard>

        <SurfaceCard as={Link} href="/stocks" className="flex flex-col gap-4">
          <CardTitle label={populated ? "Stocks" : "Invest in stocks"} />
          {populated ? (
            <>
              <Sparkline
                color="var(--color-purple)"
                path="M2,6 L10,10 L18,28 L26,24 L34,14 L42,18 L50,26 L58,20 L66,24 L74,17 L82,22 L90,18 L98,21"
              />
              <div>
                <p className="text-xl font-bold text-ink">$2,995.85</p>
                <p className="flex items-center gap-1 text-sm text-ink-secondary">
                  <AssetIcon name="arrow" size={10} />
                  0.80% today
                </p>
              </div>
            </>
          ) : (
            <div className="relative -mx-1 -mb-1 aspect-square overflow-hidden rounded-md">
              <Image
                src="/images/illustration-stocks.png"
                alt="Invest in stocks"
                fill
                className="object-cover"
              />
            </div>
          )}
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
