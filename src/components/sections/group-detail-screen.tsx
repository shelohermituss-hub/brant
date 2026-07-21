"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TrainTrack, type TrainStation } from "@/components/ui/train-track";
import { LiquidGauge } from "@/components/ui/liquid-gauge";
import { PaymentCountdown } from "@/components/ui/payment-countdown";
import { SurfaceCard } from "@/components/ui/surface-card";
import { PillButton } from "@/components/ui/pill-button";
import { AssetIcon } from "@/components/ui/asset-icon";
import { Skeleton } from "@/components/ui/skeleton";
import { ConnectedAccountsCard } from "@/components/ui/connected-accounts-card";
import { useCurrentAppUser } from "@/lib/use-current-app-user";
import { createClient } from "@/lib/supabase/client";
import { avatarColorFor, initialFor } from "@/lib/avatar-color";
import { formatHtg } from "@/lib/utils";

interface GroupDetailScreenProps {
  groupId?: string;
}

interface GroupRow {
  id: string;
  name: string;
  monthly_amount: number;
  total_members: number;
  pot_day: number;
  state: string;
  current_cycle: number;
}

function nextPotDate(potDay: number): Date {
  const now = new Date();
  const candidate = new Date(now.getFullYear(), now.getMonth(), potDay);
  if (candidate.getTime() <= now.getTime()) candidate.setMonth(candidate.getMonth() + 1);
  return candidate;
}

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function GroupDetailScreen({ groupId }: GroupDetailScreenProps) {
  const router = useRouter();
  const { loading: userLoading, authUserId, profile } = useCurrentAppUser();
  const [group, setGroup] = useState<GroupRow | null | undefined>(undefined);
  const [stations, setStations] = useState<TrainStation[]>([]);
  const [currentMemberName, setCurrentMemberName] = useState<string | null>(null);
  const [potProgress, setPotProgress] = useState<number | null>(null);
  const [myDue, setMyDue] = useState<{ amount: number; state: string } | null>(null);

  useEffect(() => {
    if (!groupId || !authUserId) return;
    let cancelled = false;
    const supabase = createClient();

    async function load(gid: string, uid: string) {
      const { data: groupRow } = await supabase
        .from("groups")
        .select("id, name, monthly_amount, total_members, pot_day, state, current_cycle")
        .eq("id", gid)
        .maybeSingle();

      const { data: membershipRows } = await supabase
        .from("memberships")
        .select("position, user_id, users(full_name, avatar_url)")
        .eq("group_id", gid)
        .order("position");

      const { data: myMembership } = await supabase
        .from("memberships")
        .select("id")
        .eq("group_id", gid)
        .eq("user_id", uid)
        .maybeSingle();

      let due: { amount: number; state: string } | null = null;
      let paidCount: number | null = null;
      if (groupRow) {
        if (myMembership) {
          const { data: contribution } = await supabase
            .from("contributions")
            .select("amount, state")
            .eq("membership_id", myMembership.id)
            .eq("cycle_number", groupRow.current_cycle)
            .maybeSingle();
          due = contribution;
        }

        if (groupRow.state !== "forming") {
          const { data: cycleContributions } = await supabase
            .from("contributions")
            .select("state")
            .eq("group_id", gid)
            .eq("cycle_number", groupRow.current_cycle);
          paidCount = (cycleContributions ?? []).filter((c) => c.state === "paid").length;
        }
      }

      if (cancelled) return;
      setGroup(groupRow ?? null);
      const currentCycle = groupRow?.current_cycle ?? 0;
      const current = (membershipRows ?? []).find((m) => m.position === currentCycle);
      setCurrentMemberName(current?.users?.full_name ?? null);
      setStations(
        (membershipRows ?? []).map(
          (m): TrainStation => ({
            position: m.position,
            status: m.position < currentCycle ? "done" : m.position === currentCycle ? "now" : "todo",
            avatarUrl: m.users?.avatar_url ?? null,
            initial: initialFor(m.users?.full_name ?? "?"),
            color: avatarColorFor(m.user_id),
          })
        )
      );
      setMyDue(due);
      setPotProgress(paidCount);
    }

    load(groupId, authUserId);
    return () => {
      cancelled = true;
    };
  }, [groupId, authUserId]);

  if (!groupId) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-5 text-center">
        <p className="text-[0.95rem] text-ink-secondary">Chwazi yon sik nan lis ou a.</p>
        <PillButton className="mt-2" onClick={() => router.push("/card")}>
          Retounen
        </PillButton>
      </div>
    );
  }

  if (!userLoading && !authUserId) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-5 text-center">
        <p className="text-[0.95rem] text-ink-secondary">Konekte pou wè sik sa a.</p>
        <PillButton className="mt-2" onClick={() => router.push("/onboarding/signin")}>
          Konekte
        </PillButton>
      </div>
    );
  }

  if (group === undefined) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-24" />
      </div>
    );
  }

  if (group === null) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-5 text-center">
        <p className="text-[0.95rem] text-ink-secondary">Nou pa jwenn sik sa a.</p>
        <PillButton className="mt-2" onClick={() => router.push("/card")}>
          Retounen
        </PillButton>
      </div>
    );
  }

  const potDate = nextPotDate(group.pot_day);
  const isForming = group.state === "forming";
  const owedAmount = myDue?.amount ?? group.monthly_amount;
  const isPaid = myDue?.state === "paid";

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-surface-muted">
      <div className="flex items-center justify-between bg-surface px-4 pt-4 pb-2">
        <button type="button" onClick={() => router.push("/card")} aria-label="Retour">
          <AssetIcon name="chevron-left" className="text-ink" size={22} />
        </button>
        <span className="text-lg font-bold text-ink">{group.name}</span>
        <span className="w-[22px]" />
      </div>

      <div className="flex flex-col gap-3 bg-surface pb-4">
        <TrainTrack variant="detailed" stations={stations} />
        {currentMemberName && (
          <p className="text-center text-[0.9rem] text-ink-secondary">
            <span className="font-bold text-ink">{currentMemberName}</span> ap resevwa pot la mwa sa a
          </p>
        )}
        {!isForming && potProgress !== null && (
          <LiquidGauge paid={potProgress} total={group.total_members} label="Kotizasyon mwa sa a" className="mt-1" />
        )}
      </div>

      <div className="flex flex-col gap-1 px-5 pt-5 pb-3">
        <span className="text-[0.9rem] text-ink-secondary">
          {isForming ? "Sik la poko kòmanse" : isPaid ? "Ou pa dwe anyen" : "Ou dwe peye"}
        </span>
        {!isForming && !isPaid && (
          <p className="text-[2.5rem] leading-none font-bold text-ink">{formatHtg(owedAmount)}</p>
        )}
      </div>

      <div className="px-4 pb-4">
        <SurfaceCard className="flex flex-col gap-5">
          <span className="text-lg font-bold text-ink">Detay</span>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[0.9rem] text-ink-secondary">Manm</span>
              <span className="text-[0.9rem] font-bold text-ink">{group.total_members}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[0.9rem] text-ink-secondary">Dire sik la</span>
              <span className="text-[0.9rem] font-bold text-ink">{group.total_members} mwa</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[0.9rem] text-ink-secondary">Frekans peman</span>
              <span className="text-[0.9rem] font-bold text-ink">Chak mwa</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[0.9rem] text-ink-secondary">Kantite pou chak vèsman</span>
              <span className="text-[0.9rem] font-bold text-ink">{formatHtg(group.monthly_amount)}</span>
            </div>
          </div>

          {!isForming && (
            <div className="flex flex-col gap-2">
              <span className="text-[0.9rem] font-bold text-ink">Pwochen peman nan</span>
              <PaymentCountdown targetDate={potDate} />
            </div>
          )}

          <div className="flex items-center justify-between border-t border-border pt-4">
            <span className="text-[0.9rem] text-ink-secondary">Dat pwochen peman</span>
            <span className="text-[0.9rem] font-bold text-ink">{dateFormatter.format(potDate)}</span>
          </div>
        </SurfaceCard>
      </div>

      <div className="px-5 pt-2 pb-2">
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

      {!isForming && (
        <div className="mt-auto flex gap-3 px-4 pb-6">
          <PillButton
            variant="primary"
            className="flex-1"
            disabled={isPaid}
            onClick={() => router.push(`/stocks/cycle/buy?groupId=${groupId}`)}
          >
            {isPaid ? "Peye" : "Peye kotizasyon"}
          </PillButton>
        </div>
      )}
    </div>
  );
}
