"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { PillButton } from "@/components/ui/pill-button";
import { AssetIcon } from "@/components/ui/asset-icon";
import { StepProgressBar } from "@/components/ui/step-progress-bar";
import { useCurrentAppUser } from "@/lib/use-current-app-user";
import { createClient } from "@/lib/supabase/client";
import {
  clearGroupCreateDraft,
  readGroupCreateDraft,
  type Frequency,
} from "@/lib/group-create-store";

const FREQUENCY_LABELS: Record<Frequency, string> = {
  mwa: "Chak mwa",
  "2-semenn": "Chak 2 semenn",
  "3-jou": "Chak 3 jou",
};

const formatAmount = (value: number) => Math.round(value).toLocaleString("fr-FR").replace(/,/g, " ");

export function GroupCreateReviewScreen() {
  const router = useRouter();
  const { authUserId, profile } = useCurrentAppUser();
  const [draft] = useState(() => readGroupCreateDraft());
  const [collectionFee, setCollectionFee] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const potAmount = draft.potAmount ?? 0;
  const durationMonths = draft.durationMonths ?? 1;
  const installmentsPerMonth = draft.installmentsPerMonth ?? 1;
  const invitedUserIds = draft.invitedUserIds ?? [];
  const totalMembers = invitedUserIds.length + 1;
  const perInstallment = potAmount / durationMonths / installmentsPerMonth;
  const totalInstallments = durationMonths * installmentsPerMonth;

  useEffect(() => {
    if (!draft.potAmount || !draft.durationMonths || !draft.invitedUserIds) {
      router.replace("/group/create/amount");
    }
  }, [draft, router]);

  useEffect(() => {
    if (!profile?.merchant_tier || !perInstallment) return;
    const supabase = createClient();
    supabase
      .rpc("calculate_collection_fee", {
        p_amount: Math.round(perInstallment),
        p_tier: profile.merchant_tier,
      })
      .then(({ data }) => setCollectionFee(typeof data === "number" ? data : null));
  }, [profile?.merchant_tier, perInstallment]);

  async function handleConfirm() {
    if (!authUserId) {
      router.push("/onboarding/signin");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    const supabase = createClient();

    const { data: group, error: groupError } = await supabase
      .from("groups")
      .insert({
        name: draft.name ?? "Sòl",
        organizer_id: authUserId,
        amount: potAmount,
        monthly_amount: Math.round(potAmount / durationMonths),
        pot_day: Math.min(28, new Date().getDate()),
        total_members: totalMembers,
      })
      .select()
      .single();

    if (groupError || !group) {
      setIsSubmitting(false);
      setError("Nou pa kapab kreye gwoup la. Tanpri eseye ankò.");
      return;
    }

    const { data: position, error: positionError } = await supabase.rpc("assign_position", {
      p_group_id: group.id,
      p_user_id: authUserId,
    });

    if (positionError || position == null) {
      setIsSubmitting(false);
      setError("Nou pa kapab detèmine pozisyon ou.");
      return;
    }

    await supabase.from("memberships").insert({
      group_id: group.id,
      user_id: authUserId,
      position,
    });

    if (invitedUserIds.length > 0) {
      await supabase.from("membership_requests").insert(
        invitedUserIds.map((userId) => ({
          group_id: group.id,
          user_id: userId,
          status: "pending",
        }))
      );
    }

    clearGroupCreateDraft();
    setIsSubmitting(false);
    router.push("/group/forming");
  }

  const rows = [
    { label: "Pot", value: `${formatAmount(potAmount)} HTG` },
    { label: "Dire sik la", value: `${durationMonths} mwa` },
    { label: "Frekans peman", value: FREQUENCY_LABELS[draft.frequency ?? "mwa"] },
    { label: "Kantite pou chak vèsman", value: `${formatAmount(perInstallment)} HTG` },
    { label: "Manm envite", value: `${invitedUserIds.length}` },
  ];

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-5 pt-4 pb-6">
      <button
        type="button"
        onClick={() => router.push("/group/create/members")}
        aria-label="Retour"
      >
        <AssetIcon name="chevron-left" className="text-ink" size={22} />
      </button>

      <StepProgressBar step={5} total={5} label="Konfime" />

      <div className="flex flex-col gap-1">
        <h1 className="text-[1.6rem] font-bold text-ink">Konfime patisipasyon ou</h1>
        <p className="text-sm font-medium tracking-wide text-ink-secondary uppercase">
          {draft.name ?? "Sòl"}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className="stagger-item flex items-center justify-between"
            style={{ "--stagger-index": i } as CSSProperties}
          >
            <span className="text-[0.95rem] text-ink-secondary">{row.label}</span>
            <span className="text-[0.95rem] font-bold text-ink">{row.value}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 rounded-lg bg-surface-muted px-4 py-4">
        <div className="flex items-center justify-between">
          <span className="text-[0.9rem] text-ink-secondary">Frè administratif (chak vèsman)</span>
          <span className="text-[0.95rem] font-bold text-ink">
            {collectionFee === null ? "…" : `${formatAmount(collectionFee)} HTG`}
          </span>
        </div>
        <span className="text-xs text-ink-secondary">
          {collectionFee === null ? "Kalkil an kou" : `${formatAmount(collectionFee)} HTG × ${totalInstallments} vèsman`}
        </span>
      </div>

      {error && <p className="text-center text-[0.85rem] text-late">{error}</p>}

      <p className="mt-auto text-center text-sm text-ink-secondary">
        Lè ou konfime, ou antre reyèlman nan gwoup la ak angajman prelèvman
        chak mwa jiskaske ou resevwa pot ou. Manm envite yo resevwa yon
        envitasyon pou yo konfime.
      </p>

      <PillButton
        variant="primary"
        className="w-full"
        disabled={isSubmitting}
        onClick={handleConfirm}
      >
        {isSubmitting ? "Kreyasyon..." : "Konfime"}
      </PillButton>
    </div>
  );
}
