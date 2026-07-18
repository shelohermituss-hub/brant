"use client";

import { useRouter } from "next/navigation";
import { ShieldCheck, Clock, HelpCircle } from "lucide-react";
import { SettingsListRow } from "@/components/ui/settings-list-row";
import { SurfaceCard } from "@/components/ui/surface-card";
import { ConnectedAccountsCard } from "@/components/ui/connected-accounts-card";
import { useCurrentAppUser } from "@/lib/use-current-app-user";

export function PaymentHubScreen() {
  const router = useRouter();
  const { profile } = useCurrentAppUser();

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-surface-muted">
      <div className="px-5 pt-4 pb-3">
        <h1 className="text-[1.75rem] font-bold text-ink">Peman</h1>
      </div>

      <div className="px-4 pb-4">
        <SurfaceCard className="flex flex-col items-center gap-1 text-center">
          <span className="text-[0.95rem] text-ink-secondary">Mwa sa a</span>
          <span className="text-lg font-bold text-ink">Ou pa dwe anyen</span>
        </SurfaceCard>
      </div>

      <div className="px-5 pb-2">
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

      <div className="mx-4 mb-8 flex flex-col rounded-lg bg-surface">
        <SettingsListRow
          icon="card"
          label="Metòd peman"
          onClick={() => router.push("/payment-hub/method")}
        />
        <SettingsListRow
          icon={ShieldCheck}
          label="Elijibilite"
          onClick={() => router.push("/payment-hub/eligibility")}
        />
        <SettingsListRow
          icon={Clock}
          label="Istwa"
          onClick={() => router.push("/payment-hub/history")}
        />
        <SettingsListRow
          icon={HelpCircle}
          label="Èd"
          onClick={() => router.push("/account/help")}
        />
      </div>
    </div>
  );
}
