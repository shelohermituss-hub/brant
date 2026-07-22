"use client";

import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import { SettingsListRow } from "@/components/ui/settings-list-row";
import { AssetIcon } from "@/components/ui/asset-icon";

const ARTICLES = [
  "Kijan pou antre nan yon sòl",
  "Kijan kotizasyon ak vèsman mache",
  "Konekte nimewo MonCash ou",
  "Sekirite ak kòd PIN wallet la",
  "Dokiman ki nesesè pou konfime idantite ou",
  "Kontakte sipò",
];

export function AccountHelpScreen() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-surface-muted">
      <div className="flex items-center justify-between px-5 pt-4">
        <button type="button" onClick={() => router.push("/account")} aria-label="Retour">
          <AssetIcon name="chevron-left" className="text-ink" size={22} />
        </button>
        <button type="button" onClick={() => router.push("/home")} aria-label="Fermer">
          <AssetIcon name="cross" className="text-ink" size={20} />
        </button>
      </div>

      <div className="flex flex-col gap-3 px-5 pt-4 pb-6">
        <h1 className="text-[1.9rem] leading-tight font-bold text-ink">Èd</h1>
        <p className="text-[0.95rem] text-ink-secondary">
          Aprann jere enfòmasyon, pwofil, ak reglaj sekirite ou.
        </p>
      </div>

      <div className="mx-4 mb-8 flex flex-col rounded-lg bg-surface">
        {ARTICLES.map((label) => (
          <SettingsListRow
            key={label}
            icon={FileText}
            label={label}
            iconStyle="badge"
            showChevron={false}
          />
        ))}
      </div>
    </div>
  );
}
