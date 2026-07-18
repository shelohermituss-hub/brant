"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";

const INFO_ROWS = [
  { label: "Òganizatè", value: "Marie L." },
  { label: "Pot", value: "50 000 HTG" },
  { label: "Kotizasyon mansyèl", value: "5 000 HTG" },
  { label: "Pozisyon ofri", value: "9 sou 10" },
];

export function GroupInviteScreen() {
  const router = useRouter();
  const [declined, setDeclined] = useState(false);

  if (declined) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 text-center">
        <p className="text-[1.1rem] font-bold text-ink">Ou refize envitasyon an</p>
        <p className="text-[0.95rem] text-ink-secondary">
          Ou ka toujou jwenn yon lòt envitasyon pita.
        </p>
        <PillButton className="mt-4 h-12 px-8 text-[0.95rem]" onClick={() => router.push("/home")}>
          Retounen
        </PillButton>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 pt-4 pb-6">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-muted">
        <Users className="text-ink" size={26} />
      </span>

      <h1 className="pt-6 text-[1.6rem] leading-tight font-bold text-ink">
        Marie L. envite w nan Sòl Vwazinaj
      </h1>
      <p className="pt-2 text-[0.95rem] text-ink-secondary">
        Gade detay gwoup la anvan ou deside.
      </p>

      <div className="flex flex-col gap-4 pt-8">
        {INFO_ROWS.map((row) => (
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
          onClick={() => setDeclined(true)}
        >
          Refize
        </PillButton>
        <PillButton
          variant="primary"
          className="flex-1"
          onClick={() => router.push("/group/create/position")}
        >
          Aksepte
        </PillButton>
      </div>
    </div>
  );
}
