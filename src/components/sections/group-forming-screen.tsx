"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserCheck, UserRoundX } from "lucide-react";
import { WonnPath, type WonnMember } from "@/components/ui/wonn-path";
import { SettingsListRow } from "@/components/ui/settings-list-row";
import { AssetIcon } from "@/components/ui/asset-icon";
import { PillButton } from "@/components/ui/pill-button";
import { useCurrentAppUser } from "@/lib/use-current-app-user";
import { createClient } from "@/lib/supabase/client";

interface GroupFormingScreenProps {
  groupId?: string;
}

interface GroupRow {
  name: string;
  total_members: number;
}

interface InviteeRow {
  name: string;
  confirmed: boolean;
}

export function GroupFormingScreen({ groupId }: GroupFormingScreenProps) {
  const router = useRouter();
  const { loading: userLoading, authUserId } = useCurrentAppUser();
  const [group, setGroup] = useState<GroupRow | null | undefined>(undefined);
  const [invitees, setInvitees] = useState<InviteeRow[]>([]);

  useEffect(() => {
    if (!groupId || !authUserId) return;
    let cancelled = false;
    const supabase = createClient();

    async function load(gid: string) {
      const { data: groupRow } = await supabase
        .from("groups")
        .select("name, total_members")
        .eq("id", gid)
        .maybeSingle();

      const { data: memberships } = await supabase
        .from("memberships")
        .select("users(full_name)")
        .eq("group_id", gid)
        .order("position");

      const { data: pending } = await supabase
        .from("membership_requests")
        .select("users!membership_requests_user_id_fkey(full_name)")
        .eq("group_id", gid)
        .eq("status", "pending");

      if (cancelled) return;
      setGroup(groupRow ?? null);
      setInvitees([
        ...(memberships ?? []).map((m) => ({ name: m.users?.full_name ?? "Manm", confirmed: true })),
        ...(pending ?? []).map((p) => ({ name: p.users?.full_name ?? "Envite", confirmed: false })),
      ]);
    }

    load(groupId);
    return () => {
      cancelled = true;
    };
  }, [groupId, authUserId]);

  if (!groupId || group === null) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-5 text-center">
        <p className="text-[0.95rem] text-ink-secondary">Nou pa jwenn sik sa a.</p>
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
      <div className="flex flex-1 items-center justify-center">
        <p className="text-[0.95rem] text-ink-secondary">Chajman...</p>
      </div>
    );
  }

  const members: WonnMember[] = Array.from({ length: group.total_members }, (_, i) => ({
    position: i + 1,
    status: "upcoming" as const,
  }));
  const confirmedCount = invitees.filter((i) => i.confirmed).length;

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="flex items-center justify-between px-4 pt-4">
        <button type="button" onClick={() => router.push("/card")} aria-label="Retour">
          <AssetIcon name="chevron-left" className="text-ink" size={22} />
        </button>
        <span className="text-lg font-bold text-ink">{group.name}</span>
        <span className="w-[22px]" />
      </div>

      <WonnPath
        members={members}
        beneficiaryPosition={0}
        potAmount="An fòmasyon"
        beneficiaryName="Sik la poko kòmanse"
      />

      <p className="px-5 pb-2 text-center text-[0.95rem] text-ink-secondary">
        {confirmedCount} sou {invitees.length} manm konfime — sik la kòmanse
        lè tout moun antre
      </p>

      <div className="mx-4 mt-4 mb-8 flex flex-col rounded-lg bg-surface-muted">
        {invitees.length === 0 ? (
          <p className="px-5 py-6 text-center text-[0.9rem] text-ink-secondary">
            Ou poko envite okenn manm.
          </p>
        ) : (
          invitees.map((invitee, i) => (
            <SettingsListRow
              key={`${invitee.name}-${i}`}
              icon={invitee.confirmed ? UserCheck : UserRoundX}
              label={invitee.name}
              badge={invitee.confirmed ? "Konfime" : "An atant"}
              badgeTone={invitee.confirmed ? "paid" : "wait"}
              showChevron={false}
            />
          ))
        )}
      </div>
    </div>
  );
}
