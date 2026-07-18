"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Chip } from "@/components/ui/chip";
import { AssetIcon } from "@/components/ui/asset-icon";
import { useCurrentAppUser } from "@/lib/use-current-app-user";
import { createClient } from "@/lib/supabase/client";
import { formatHtg } from "@/lib/utils";

type RowStatus = "paid" | "wait" | "late";

interface HistoryEntry {
  id: string;
  date: string;
  amount: number;
  status: RowStatus;
  ref: string | null;
}

const STATUS_LABEL: Record<RowStatus, string> = { paid: "Peye", wait: "An atant", late: "An reta" };

const CONTRIBUTION_STATE_TO_STATUS: Record<string, RowStatus> = {
  paid: "paid",
  pending: "wait",
  due: "wait",
  late: "late",
  defaulted: "late",
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });

function HistoryRow({ id, date, amount, status, ref }: HistoryEntry) {
  const router = useRouter();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => router.push(`/payment-status?contributionId=${id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter") router.push(`/payment-status?contributionId=${id}`);
      }}
      className="flex w-full items-center justify-between border-b border-border px-5 py-4 text-left last:border-b-0"
    >
      <div className="flex flex-col">
        <span className="text-[0.95rem] font-bold text-ink">{formatHtg(amount)}</span>
        <span className="text-sm text-ink-secondary">{date}</span>
        {ref && <span className="text-xs text-ink-secondary">Ref. {ref}</span>}
      </div>
      <Chip variant={status} className="h-7 px-3 text-xs pointer-events-none">
        {STATUS_LABEL[status]}
      </Chip>
    </div>
  );
}

export function HistoryScreen() {
  const router = useRouter();
  const { loading: userLoading, authUserId } = useCurrentAppUser();
  const [contributions, setContributions] = useState<HistoryEntry[] | null>(null);
  const [payouts, setPayouts] = useState<HistoryEntry[] | null>(null);

  useEffect(() => {
    if (!authUserId) return;
    let cancelled = false;
    const supabase = createClient();

    async function load(uid: string) {
      const { data: memberships } = await supabase.from("memberships").select("id").eq("user_id", uid);
      const membershipIds = (memberships ?? []).map((m) => m.id);

      if (membershipIds.length === 0) {
        if (!cancelled) {
          setContributions([]);
          setPayouts([]);
        }
        return;
      }

      const { data: contributionRows } = await supabase
        .from("contributions")
        .select("id, amount, state, moncash_ref, month")
        .in("membership_id", membershipIds)
        .order("month", { ascending: false });

      const { data: payoutRows } = await supabase
        .from("payouts")
        .select("id, amount, state, moncash_ref, month")
        .in("beneficiary_membership_id", membershipIds)
        .order("month", { ascending: false });

      if (cancelled) return;

      setContributions(
        (contributionRows ?? []).map((c) => ({
          id: c.id,
          date: dateFormatter.format(new Date(c.month)),
          amount: c.amount,
          status: CONTRIBUTION_STATE_TO_STATUS[c.state] ?? "wait",
          ref: c.moncash_ref,
        }))
      );
      setPayouts(
        (payoutRows ?? []).map((p) => ({
          id: p.id,
          date: dateFormatter.format(new Date(p.month)),
          amount: p.amount,
          status: p.state === "confirmed" ? "paid" : p.state === "failed" ? "late" : "wait",
          ref: p.moncash_ref,
        }))
      );
    }

    load(authUserId);
    return () => {
      cancelled = true;
    };
  }, [authUserId]);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-surface-muted">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-5 pt-4">
        <button type="button" onClick={() => router.push("/payment-hub")} aria-label="Retour">
          <AssetIcon name="chevron-left" className="text-ink" size={22} />
        </button>
        <span className="text-lg font-bold text-ink">Istwa</span>
        <span />
      </div>

      {!userLoading && !authUserId ? (
        <p className="px-5 py-8 text-center text-[0.9rem] text-ink-secondary">
          Konekte pou wè istwa peman ou.
        </p>
      ) : (
        <>
          <div className="bg-surface-muted px-5 py-3 pt-6">
            <span className="text-xs font-semibold tracking-wide text-ink-secondary">
              KOTIZASYON PEYE
            </span>
          </div>
          <div className="bg-surface">
            {contributions === null ? (
              <p className="px-5 py-6 text-center text-[0.9rem] text-ink-secondary">Chajman...</p>
            ) : contributions.length === 0 ? (
              <p className="px-5 py-6 text-center text-[0.9rem] text-ink-secondary">
                Ou poko gen okenn kotizasyon.
              </p>
            ) : (
              contributions.map((row) => <HistoryRow key={row.id} {...row} />)
            )}
          </div>

          <div className="bg-surface-muted px-5 py-3 pt-6">
            <span className="text-xs font-semibold tracking-wide text-ink-secondary">
              POT RESEVWA
            </span>
          </div>
          <div className="bg-surface">
            {payouts === null ? (
              <p className="px-5 py-6 text-center text-[0.9rem] text-ink-secondary">Chajman...</p>
            ) : payouts.length === 0 ? (
              <p className="px-5 py-6 text-center text-[0.9rem] text-ink-secondary">
                Ou poko resevwa okenn pot.
              </p>
            ) : (
              payouts.map((row) => <HistoryRow key={row.id} {...row} />)
            )}
          </div>
        </>
      )}
    </div>
  );
}
