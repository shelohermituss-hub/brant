"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckboxRow } from "@/components/ui/checkbox-row";
import { AssetIcon } from "@/components/ui/asset-icon";
import { ListSkeleton } from "@/components/ui/list-skeleton";
import { useCurrentAppUser } from "@/lib/use-current-app-user";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/database.types";

type Profile = Tables<"users">;

export function SecurityPrivacyScreen() {
  const router = useRouter();
  const { loading, authUserId, profile } = useCurrentAppUser();

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-surface-muted">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-5 pt-4">
        <button type="button" onClick={() => router.push("/account")} aria-label="Retour">
          <AssetIcon name="chevron-left" className="text-ink" size={22} />
        </button>
        <span className="text-lg font-bold text-ink">Sekirite ak konfidansyalite</span>
        <span />
      </div>

      <div className="bg-surface-muted px-5 py-3 pt-6">
        <span className="text-xs font-semibold tracking-wide text-ink-secondary">SEKIRITE</span>
      </div>

      <div className="bg-surface">
        <p className="px-5 py-4 text-[0.95rem] text-ink-secondary">
          Mande yon kòd PIN pou fè yon vèsman oswa pou debloke aplikasyon an
          apre yon peryòd san aktivite.
        </p>

        {!authUserId && !loading ? (
          <p className="px-5 pb-4 text-[0.9rem] text-ink-secondary">Konekte pou jere reglaj sa yo.</p>
        ) : !profile ? (
          <ListSkeleton rows={2} />
        ) : (
          <SecurityToggles authUserId={authUserId!} profile={profile} />
        )}

        <div className="py-5 text-center">
          <button
            type="button"
            onClick={() => router.push("/pin/setup")}
            className="text-[1.05rem] font-bold text-green-deep"
          >
            Chanje kòd PIN
          </button>
        </div>
      </div>
    </div>
  );
}

function SecurityToggles({ authUserId, profile }: { authUserId: string; profile: Profile }) {
  const [moveMoney, setMoveMoney] = useState(profile.require_pin_move_money);
  const [unlockApp, setUnlockApp] = useState(profile.require_pin_unlock_app);

  return (
    <>
      <CheckboxRow
        label="Fè yon vèsman"
        checked={moveMoney}
        onToggle={() => {
          const next = !moveMoney;
          setMoveMoney(next);
          createClient().from("users").update({ require_pin_move_money: next }).eq("id", authUserId);
        }}
      />
      <CheckboxRow
        label="Debloke aplikasyon an"
        checked={unlockApp}
        onToggle={() => {
          const next = !unlockApp;
          setUnlockApp(next);
          createClient().from("users").update({ require_pin_unlock_app: next }).eq("id", authUserId);
        }}
      />
    </>
  );
}
