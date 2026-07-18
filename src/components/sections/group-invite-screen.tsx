"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";
import { useCurrentAppUser } from "@/lib/use-current-app-user";
import { createClient } from "@/lib/supabase/client";
import { formatHtg } from "@/lib/utils";

interface Invitation {
  id: string;
  groupName: string;
  organizerName: string;
  potAmount: number;
  monthlyAmount: number;
  totalMembers: number;
}

export function GroupInviteScreen() {
  const router = useRouter();
  const { loading: userLoading, authUserId } = useCurrentAppUser();
  const [invitation, setInvitation] = useState<Invitation | null | undefined>(undefined);
  const [decision, setDecision] = useState<"accepted" | "declined" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authUserId) return;
    let cancelled = false;
    const supabase = createClient();

    supabase
      .from("membership_requests")
      .select(
        "id, groups(name, amount, monthly_amount, total_members, organizer:users!organizer_id(full_name))"
      )
      .eq("user_id", authUserId)
      .eq("status", "pending")
      .order("requested_at", { ascending: true })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        if (!data || !data.groups) {
          setInvitation(null);
          return;
        }
        setInvitation({
          id: data.id,
          groupName: data.groups.name,
          organizerName: data.groups.organizer?.full_name ?? "Òganizatè",
          potAmount: data.groups.amount,
          monthlyAmount: data.groups.monthly_amount,
          totalMembers: data.groups.total_members,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [authUserId]);

  async function handleDecision(status: "approved" | "rejected") {
    if (!invitation) return;
    setIsSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("membership_requests")
      .update({ status })
      .eq("id", invitation.id);
    setIsSubmitting(false);
    if (!error) setDecision(status === "approved" ? "accepted" : "declined");
  }

  if (!userLoading && !authUserId) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 text-center">
        <p className="text-[0.95rem] text-ink-secondary">Konekte pou wè envitasyon ou yo.</p>
        <PillButton className="mt-2" onClick={() => router.push("/onboarding/email")}>
          Konekte
        </PillButton>
      </div>
    );
  }

  if (invitation === undefined) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-[0.95rem] text-ink-secondary">Chajman...</p>
      </div>
    );
  }

  if (decision === "declined") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 text-center">
        <p className="text-[1.1rem] font-bold text-ink">Ou refize envitasyon an</p>
        <p className="text-[0.95rem] text-ink-secondary">
          Ou ka toujou jwenn yon lòt envitasyon pita.
        </p>
        <PillButton className="mt-4 h-12 px-8 text-[0.95rem]" onClick={() => router.push("/card")}>
          Retounen
        </PillButton>
      </div>
    );
  }

  if (decision === "accepted") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 text-center">
        <p className="text-[1.1rem] font-bold text-ink">Ou antre nan sik la!</p>
        <p className="text-[0.95rem] text-ink-secondary">
          Ou ka swiv sik la depi paj Sik mwen yo.
        </p>
        <PillButton className="mt-4 h-12 px-8 text-[0.95rem]" onClick={() => router.push("/card")}>
          Wè sik mwen yo
        </PillButton>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 text-center">
        <p className="text-[0.95rem] text-ink-secondary">Ou pa gen envitasyon an atant kounye a.</p>
        <PillButton className="mt-4 h-12 px-8 text-[0.95rem]" onClick={() => router.push("/card")}>
          Retounen
        </PillButton>
      </div>
    );
  }

  const infoRows = [
    { label: "Manman sòl", value: invitation.organizerName },
    { label: "Pot", value: formatHtg(invitation.potAmount) },
    { label: "Kotizasyon mansyèl", value: formatHtg(invitation.monthlyAmount) },
    { label: "Manm", value: `${invitation.totalMembers}` },
  ];

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 pt-4 pb-6">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-muted">
        <Users className="text-ink" size={26} />
      </span>

      <h1 className="pt-6 text-[1.6rem] leading-tight font-bold text-ink">
        {invitation.organizerName} envite w nan {invitation.groupName}
      </h1>
      <p className="pt-2 text-[0.95rem] text-ink-secondary">
        Gade detay gwoup la anvan ou deside.
      </p>

      <div className="flex flex-col gap-4 pt-8">
        {infoRows.map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <span className="text-[0.95rem] text-ink-secondary">{row.label}</span>
            <span className="text-[0.95rem] font-bold text-ink">{row.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto flex gap-3 pt-6">
        <PillButton
          variant="outline"
          className="flex-1"
          disabled={isSubmitting}
          onClick={() => handleDecision("rejected")}
        >
          Refize
        </PillButton>
        <PillButton
          variant="primary"
          className="flex-1"
          disabled={isSubmitting}
          onClick={() => handleDecision("approved")}
        >
          Aksepte
        </PillButton>
      </div>
    </div>
  );
}
