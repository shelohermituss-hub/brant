"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { AssetIcon } from "@/components/ui/asset-icon";
import { cn } from "@/lib/utils";
import { useCurrentAppUser } from "@/lib/use-current-app-user";
import { createClient } from "@/lib/supabase/client";
import { minPositionFor, type PositionPolicy } from "@/lib/position-policy";

type SikStatus = "paid" | "wait" | "late";

interface SikEntry {
  sik: number;
  status: SikStatus;
}

const HEIGHT_BY_STATUS: Record<SikStatus, string> = {
  paid: "h-full bg-paid",
  wait: "h-2/3 bg-wait",
  late: "h-1/3 bg-late",
};

const CONTRIBUTION_STATE_TO_STATUS: Record<string, SikStatus> = {
  paid: "paid",
  pending: "wait",
  due: "wait",
  late: "late",
  defaulted: "late",
};

export function ScoreDetailScreen() {
  const router = useRouter();
  const { loading: userLoading, authUserId, profile } = useCurrentAppUser();
  const [history, setHistory] = useState<SikEntry[] | null>(null);
  const [positionRange, setPositionRange] = useState<{ min: number; max: number } | null>(null);

  useEffect(() => {
    if (!authUserId) return;
    let cancelled = false;
    const supabase = createClient();

    async function load(uid: string) {
      const { data: memberships } = await supabase
        .from("memberships")
        .select("id, groups(total_members)")
        .eq("user_id", uid)
        .limit(1);

      const membership = memberships?.[0];
      if (!membership) {
        if (!cancelled) setHistory([]);
        return;
      }

      const { data: contributions } = await supabase
        .from("contributions")
        .select("cycle_number, state")
        .eq("membership_id", membership.id)
        .order("cycle_number");

      const { data: policy } = await supabase
        .from("position_assignment_policy")
        .select("min_score_for_any_position, min_score_for_20th_percentile, min_score_for_50th_percentile")
        .maybeSingle();

      if (cancelled) return;

      setHistory(
        (contributions ?? []).map((c) => ({
          sik: c.cycle_number,
          status: CONTRIBUTION_STATE_TO_STATUS[c.state] ?? "wait",
        }))
      );

      if (policy && membership.groups) {
        const totalMembers = membership.groups.total_members;
        const score = profile?.trust_score ?? 0;
        setPositionRange({
          min: minPositionFor(score, totalMembers, policy as PositionPolicy),
          max: totalMembers,
        });
      }
    }

    load(authUserId);
    return () => {
      cancelled = true;
    };
  }, [authUserId, profile?.trust_score]);

  if (!userLoading && !authUserId) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-5 text-center">
        <p className="text-[0.95rem] text-ink-secondary">Konekte pou wè Kredi/Skò ou.</p>
      </div>
    );
  }

  const paidCount = (history ?? []).filter((h) => h.status === "paid").length;
  const infoRows = [
    { label: "Skò aktyèl", value: `${profile?.trust_score ?? 0} / 100` },
    { label: "Sik peye alè", value: `${paidCount} sou ${history?.length ?? 0}` },
    {
      label: "Pozisyon aksesib",
      value: positionRange ? `${positionRange.min} – ${positionRange.max}` : "—",
    },
  ];

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="px-4 pt-4">
        <button type="button" onClick={() => router.push("/stocks")} aria-label="Retour">
          <AssetIcon name="chevron-left" className="text-ink" size={22} />
        </button>
      </div>

      <div className="flex flex-col gap-2 px-5 pt-3 pb-2">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-muted">
          <ShieldCheck className="text-ink" size={26} />
        </span>
        <span className="text-xl font-bold text-ink">Kredi/Skò</span>
        <span className="text-[0.95rem] font-medium text-ink-secondary">
          Istwa pa sik, pa jou
        </span>
      </div>

      {history === null ? (
        <p className="px-5 py-8 text-center text-[0.9rem] text-ink-secondary">Chajman...</p>
      ) : history.length === 0 ? (
        <p className="px-5 py-8 text-center text-[0.9rem] text-ink-secondary">
          Ou poko gen istwa sik.
        </p>
      ) : (
        <>
          <div className="flex h-28 items-end gap-2 px-5 pt-6">
            {history.map(({ sik, status }) => (
              <div key={sik} className="flex h-full flex-1 items-end">
                <span className={cn("w-full rounded-full", HEIGHT_BY_STATUS[status])} />
              </div>
            ))}
          </div>
          <div className="flex gap-2 px-5 pb-2">
            {history.map(({ sik }) => (
              <span key={sik} className="flex-1 text-center text-xs text-ink-secondary">
                S{sik}
              </span>
            ))}
          </div>
        </>
      )}

      <div className="flex flex-col gap-4 px-5 pt-4 pb-8">
        {infoRows.map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <span className="text-[0.95rem] text-ink-secondary">{row.label}</span>
            <span className="text-[0.95rem] font-bold text-ink">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
