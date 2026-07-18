"use client";

import { useRouter } from "next/navigation";
import { WonnPath, type WonnMember } from "@/components/ui/wonn-path";
import { SettingsListRow } from "@/components/ui/settings-list-row";
import { AssetIcon } from "@/components/ui/asset-icon";
import { UserCheck, UserRoundX } from "lucide-react";

const MEMBERS: WonnMember[] = Array.from({ length: 10 }, (_, i) => ({
  position: i + 1,
  status: "upcoming" as const,
}));

// Reflète les manm envite nan group-create-members-screen.tsx (menm woustè
// kontak, menm 3 premye konfime pa defo).
const INVITEES = [
  { name: "Marie L. (manman sòl)", confirmed: true },
  { name: "Peterson J.", confirmed: true },
  { name: "Sandy G.", confirmed: true },
  { name: "Diego M.", confirmed: false },
  { name: "Fabiola R.", confirmed: false },
  { name: "Junior P.", confirmed: false },
  { name: "Nadège C.", confirmed: false },
];

export function GroupFormingScreen() {
  const router = useRouter();
  const confirmedCount = INVITEES.filter((i) => i.confirmed).length;

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="flex items-center justify-between px-4 pt-4">
        <button type="button" onClick={() => router.push("/home")} aria-label="Retour">
          <AssetIcon name="chevron-left" className="text-ink" size={22} />
        </button>
        <span className="text-lg font-bold text-ink">Sòl Vwazinaj</span>
        <span className="w-[22px]" />
      </div>

      <WonnPath members={MEMBERS} beneficiaryPosition={0} potAmount="An fòmasyon" beneficiaryName="Sik la poko kòmanse" />

      <p className="px-5 pb-2 text-center text-[0.95rem] text-ink-secondary">
        {confirmedCount} sou {INVITEES.length} manm konfime — sik la kòmanse
        lè tout moun antre
      </p>

      <div className="mx-4 mt-4 mb-8 flex flex-col rounded-lg bg-surface-muted">
        {INVITEES.map((invitee) => (
          <SettingsListRow
            key={invitee.name}
            icon={invitee.confirmed ? UserCheck : UserRoundX}
            label={invitee.name}
            badge={invitee.confirmed ? "Konfime" : "An atant"}
            badgeTone={invitee.confirmed ? "paid" : "wait"}
            showChevron={false}
          />
        ))}
      </div>
    </div>
  );
}
