"use client";

import { useRouter } from "next/navigation";
import { ShieldCheck, Clock, HelpCircle } from "lucide-react";
import { SettingsListRow } from "@/components/ui/settings-list-row";
import { SurfaceCard } from "@/components/ui/surface-card";

export function PaymentHubScreen() {
  const router = useRouter();

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
