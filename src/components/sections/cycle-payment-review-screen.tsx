"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PillButton } from "@/components/ui/pill-button";
import { AssetIcon } from "@/components/ui/asset-icon";
import { useCurrentAppUser } from "@/lib/use-current-app-user";
import { createClient } from "@/lib/supabase/client";
import { formatHtg } from "@/lib/utils";

interface CyclePaymentReviewScreenProps {
  groupId?: string;
}

interface ReviewData {
  monthlyAmount: number;
  currentCycle: number;
  totalMembers: number;
  collectionFee: number;
}

export function CyclePaymentReviewScreen({ groupId }: CyclePaymentReviewScreenProps) {
  const router = useRouter();
  const { authUserId, profile } = useCurrentAppUser();
  const [data, setData] = useState<ReviewData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!groupId) return;
    let cancelled = false;
    const supabase = createClient();

    async function load(gid: string) {
      const { data: group } = await supabase
        .from("groups")
        .select("monthly_amount, current_cycle, total_members, organizer:users!organizer_id(merchant_tier)")
        .eq("id", gid)
        .maybeSingle();
      if (!group) return;

      const { data: fee } = await supabase.rpc("calculate_collection_fee", {
        p_amount: group.monthly_amount,
        p_tier: group.organizer?.merchant_tier ?? "bronze",
      });

      if (!cancelled) {
        setData({
          monthlyAmount: group.monthly_amount,
          currentCycle: group.current_cycle,
          totalMembers: group.total_members,
          collectionFee: typeof fee === "number" ? fee : 0,
        });
      }
    }

    load(groupId);
    return () => {
      cancelled = true;
    };
  }, [groupId]);

  async function handleConfirm() {
    if (!groupId || !authUserId) return;
    setIsSubmitting(true);
    setError(null);

    const res = await fetch("/api/moncash/simulate-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId }),
    });
    const body = await res.json().catch(() => null);

    setIsSubmitting(false);

    if (!res.ok) {
      setError(body?.error ?? "Nou pa kapab konfime kotizasyon an. Tanpri eseye ankò.");
      return;
    }

    router.push(`/payment-status?contributionId=${body.contribution.id}`);
  }

  if (!groupId || !data) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-[0.95rem] text-ink-secondary">Chajman...</p>
      </div>
    );
  }

  const total = data.monthlyAmount + data.collectionFee;
  const rows = [
    { label: "Metòd peman", value: "MonCash" },
    { label: "Sik", value: `${data.currentCycle} sou ${data.totalMembers}` },
    { label: "Kotizasyon", value: formatHtg(data.monthlyAmount) },
  ];
  const totalRows = [
    { label: "Kotizasyon", value: formatHtg(data.monthlyAmount) },
    { label: "Frè kolèkt", value: formatHtg(data.collectionFee) },
    { label: "Total", value: formatHtg(total) },
  ];

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-5 pt-4 pb-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.push(`/group?id=${groupId}`)}
          aria-label="Fermer"
        >
          <AssetIcon name="cross" className="text-ink" size={20} />
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-[1.6rem] font-bold text-ink">Konfime kotizasyon</h1>
        <p className="text-sm font-medium tracking-wide text-ink-secondary uppercase">
          Peman imedya
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <span className="text-[0.95rem] text-ink-secondary">{row.label}</span>
            <span className="text-[0.95rem] text-ink-secondary">{row.value}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {totalRows.map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <span className="text-[0.95rem] text-ink-secondary">{row.label}</span>
            <span className="text-[0.95rem] text-ink-secondary">{row.value}</span>
          </div>
        ))}
      </div>

      {error && <p className="text-center text-[0.85rem] text-late">{error}</p>}

      <p className="mt-auto text-center text-sm text-ink-secondary">
        Yon resi ak referans MonCash ap voye ba ou apre konfimasyon.
      </p>

      <PillButton
        variant="primary"
        className="w-full"
        disabled={isSubmitting || !profile?.moncash_number}
        onClick={handleConfirm}
      >
        {isSubmitting ? "Konfimasyon..." : "Konfime"}
      </PillButton>
    </div>
  );
}
