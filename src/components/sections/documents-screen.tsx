"use client";

import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import { SettingsListRow } from "@/components/ui/settings-list-row";
import { AssetIcon } from "@/components/ui/asset-icon";

const DOCUMENTS = [
  { label: "Kat idantite (CIN)", status: "Verifye" },
  { label: "Prèv revni", status: "An atant" },
];

export function DocumentsScreen() {
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
        <h1 className="text-[1.9rem] leading-tight font-bold text-ink">Documents</h1>
        <p className="text-[0.95rem] text-ink-secondary">
          Dokiman ki nesesè pou konfime elijibilite ou.
        </p>
      </div>

      <div className="mx-4 mb-8 flex flex-col rounded-lg bg-surface">
        {DOCUMENTS.map((doc) => (
          <SettingsListRow
            key={doc.label}
            icon={FileText}
            label={doc.label}
            iconStyle="badge"
            badge={doc.status}
            showChevron={false}
          />
        ))}
      </div>
    </div>
  );
}
