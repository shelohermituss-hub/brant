"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { AssetIcon } from "@/components/ui/asset-icon";

const CODE = "JUDY-SM7K";

const INVITES = [
  { name: "Marie L.", status: "Konfime" },
  { name: "Peterson J.", status: "An atant" },
];

export function ReferScreen() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 pt-4 pb-6">
      <button type="button" onClick={() => router.push("/account")} aria-label="Retour">
        <AssetIcon name="chevron-left" className="text-ink" size={22} />
      </button>

      <div className="flex flex-col gap-1 pt-6">
        <h1 className="text-[1.6rem] leading-tight font-bold text-ink">Envite zanmi ou</h1>
        <p className="text-[0.95rem] text-ink-secondary">
          Jwenn 50 HTG pou chak zanmi ki antre nan yon sòl
        </p>
      </div>

      <div className="pt-6">
        <SurfaceCard className="flex flex-col items-center gap-3">
          <span className="text-sm text-ink-secondary">Kòd pèsonèl ou</span>
          <span className="text-[1.75rem] font-bold tracking-wide text-ink">{CODE}</span>
          <PillButton
            variant="secondary"
            className="h-11 w-full text-[0.95rem]"
            onClick={() => {
              navigator.clipboard?.writeText(CODE);
              setCopied(true);
            }}
          >
            {copied ? (
              <span className="flex items-center gap-2">
                <Check size={16} /> Kopye
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Copy size={16} /> Kopye kòd la
              </span>
            )}
          </PillButton>
        </SurfaceCard>
      </div>

      <div className="flex flex-col gap-1 pt-8 pb-2">
        <span className="text-[0.95rem] font-bold text-ink">Envitasyon ou yo</span>
      </div>
      <div className="flex flex-col rounded-lg bg-surface-muted">
        {INVITES.map((invite) => (
          <div
            key={invite.name}
            className="flex items-center justify-between border-b border-border px-4 py-3 last:border-b-0"
          >
            <span className="text-[0.95rem] text-ink">{invite.name}</span>
            <span className="text-sm text-ink-secondary">{invite.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
