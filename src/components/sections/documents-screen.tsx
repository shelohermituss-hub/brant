"use client";

import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import { SettingsListRow } from "@/components/ui/settings-list-row";
import { AssetIcon } from "@/components/ui/asset-icon";
import { useCurrentAppUser } from "@/lib/use-current-app-user";

const KYC_STATUS_LABEL: Record<string, { label: string; tone: "paid" | "wait" }> = {
  verified: { label: "Verifye", tone: "paid" },
  pending: { label: "An atant", tone: "wait" },
  rejected: { label: "Rejte", tone: "wait" },
};

export function DocumentsScreen() {
  const router = useRouter();
  const { loading, authUserId, profile } = useCurrentAppUser();
  const kyc = profile ? KYC_STATUS_LABEL[profile.kyc_status] : null;

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

      {!loading && !authUserId ? (
        <p className="px-5 py-6 text-center text-[0.9rem] text-ink-secondary">
          Konekte pou wè dokiman ou.
        </p>
      ) : (
        <div className="mx-4 mb-8 flex flex-col rounded-lg bg-surface">
          <SettingsListRow
            icon={FileText}
            label="Kat idantite (CIN)"
            iconStyle="badge"
            badge={kyc?.label}
            badgeTone={kyc?.tone}
            showChevron={false}
          />
        </div>
      )}
    </div>
  );
}
