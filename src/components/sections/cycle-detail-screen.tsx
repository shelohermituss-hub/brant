"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";
import { AssetIcon } from "@/components/ui/asset-icon";
import { cn, formatHtg } from "@/lib/utils";
import { useCurrentAppUser } from "@/lib/use-current-app-user";
import { createClient } from "@/lib/supabase/client";

interface CycleDetailScreenProps {
  groupId?: string;
}

interface CycleData {
  id: string;
  amount: number;
  monthlyAmount: number;
  totalMembers: number;
  currentCycle: number;
  myPosition: number;
}

const ACTIVE_STATES = ["active", "collecting", "pot_ready", "pot_sent", "next_month"];

export function CycleDetailScreen({ groupId }: CycleDetailScreenProps) {
  const router = useRouter();
  const { loading: userLoading, authUserId } = useCurrentAppUser();
  const [cycle, setCycle] = useState<CycleData | null | undefined>(undefined);

  useEffect(() => {
    if (!authUserId) return;
    let cancelled = false;
    const supabase = createClient();

    async function load(uid: string) {
      const { data: memberships } = await supabase
        .from("memberships")
        .select("position, groups(id, amount, monthly_amount, total_members, current_cycle, state)")
        .eq("user_id", uid);

      const match = groupId
        ? (memberships ?? []).find((m) => m.groups?.id === groupId)
        : (memberships ?? []).find((m) => m.groups && ACTIVE_STATES.includes(m.groups.state));

      if (cancelled) return;
      if (!match || !match.groups) {
        setCycle(null);
        return;
      }

      setCycle({
        id: match.groups.id,
        amount: match.groups.amount,
        monthlyAmount: match.groups.monthly_amount,
        totalMembers: match.groups.total_members,
        currentCycle: match.groups.current_cycle,
        myPosition: match.position,
      });
    }

    load(authUserId);
    return () => {
      cancelled = true;
    };
  }, [authUserId, groupId]);

  if (!userLoading && !authUserId) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-5 text-center">
        <p className="text-[0.95rem] text-ink-secondary">Konekte pou wè pwochen sik ou.</p>
        <PillButton className="mt-2" onClick={() => router.push("/onboarding/email")}>
          Konekte
        </PillButton>
      </div>
    );
  }

  if (cycle === undefined) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-[0.95rem] text-ink-secondary">Chajman...</p>
      </div>
    );
  }

  if (cycle === null) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-5 text-center">
        <p className="text-[0.95rem] text-ink-secondary">Ou pa gen sik an kou kounye a.</p>
        <PillButton className="mt-2" onClick={() => router.push("/card")}>
          Wè sik ou yo
        </PillButton>
      </div>
    );
  }

  const totalSik = cycle.totalMembers;
  const currentSik = cycle.currentCycle;

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="px-4 pt-4">
        <button type="button" onClick={() => router.push("/stocks")} aria-label="Retour">
          <AssetIcon name="chevron-left" className="text-ink" size={22} />
        </button>
      </div>

      <div className="flex flex-col gap-2 px-5 pt-3 pb-2">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-muted">
          <Users className="text-ink" size={26} />
        </span>
        <span className="text-xl font-bold text-ink">Pwochen sik</span>
        <span className="text-[0.95rem] font-medium text-ink-secondary">
          Sik {currentSik} sou {totalSik} — an kou
        </span>
      </div>

      <div className="flex gap-1.5 px-5 pt-4 pb-2">
        {Array.from({ length: totalSik }, (_, i) => i + 1).map((sik) => (
          <span
            key={sik}
            className={cn(
              "h-2 flex-1 rounded-full",
              sik < currentSik
                ? "bg-green"
                : sik === currentSik
                  ? "bg-green-bright"
                  : "bg-surface-muted"
            )}
          />
        ))}
      </div>
      <p className="px-5 pb-6 text-sm text-ink-secondary">
        {currentSik - 1} sou {totalSik} sik konplete
      </p>

      <div className="flex flex-col gap-4 px-5 pb-8">
        <div className="flex items-center justify-between">
          <span className="text-[0.95rem] text-ink-secondary">Pot</span>
          <span className="text-[0.95rem] font-bold text-ink">{formatHtg(cycle.amount)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[0.95rem] text-ink-secondary">Kotizasyon mansyèl</span>
          <span className="text-[0.95rem] font-bold text-ink">{formatHtg(cycle.monthlyAmount)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[0.95rem] text-ink-secondary">Pozisyon ou</span>
          <span className="text-[0.95rem] font-bold text-ink">
            {cycle.myPosition} sou {totalSik}
          </span>
        </div>
      </div>

      <div className="mt-auto flex gap-3 px-4 pb-6">
        <PillButton
          variant="primary"
          className="flex-1"
          onClick={() => router.push(`/stocks/cycle/buy?groupId=${cycle.id}`)}
        >
          Peye kotizasyon
        </PillButton>
      </div>
    </div>
  );
}
