"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import { SettingsListRow } from "@/components/ui/settings-list-row";
import { AssetIcon } from "@/components/ui/asset-icon";
import { useCurrentAppUser } from "@/lib/use-current-app-user";
import { createClient } from "@/lib/supabase/client";

const KYC_STATUS_LABEL: Record<string, { label: string; tone: "paid" | "wait" }> = {
  verified: { label: "Verifye", tone: "paid" },
  pending: { label: "An atant", tone: "wait" },
  rejected: { label: "Rejte", tone: "wait" },
};

const MAX_DOCUMENT_BYTES = 8 * 1024 * 1024;

export function DocumentsScreen() {
  const router = useRouter();
  const { loading, authUserId, profile } = useCurrentAppUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hasDocument, setHasDocument] = useState<boolean | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const kyc = profile ? KYC_STATUS_LABEL[profile.kyc_status] : null;

  useEffect(() => {
    if (!authUserId) return;
    let cancelled = false;
    createClient()
      .storage.from("documents")
      .list(authUserId)
      .then(({ data }) => {
        if (!cancelled) setHasDocument((data?.length ?? 0) > 0);
      });
    return () => {
      cancelled = true;
    };
  }, [authUserId]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !authUserId) return;

    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      setError("Chwazi yon imaj oswa yon PDF.");
      return;
    }
    if (file.size > MAX_DOCUMENT_BYTES) {
      setError("Fichye a twò gwo (maksimòm 8 Mo).");
      return;
    }

    setIsUploading(true);
    setError(null);

    const extension = file.name.split(".").pop() ?? "jpg";
    const path = `${authUserId}/cin.${extension}`;

    const { error: uploadError } = await createClient()
      .storage.from("documents")
      .upload(path, file, { upsert: true });

    setIsUploading(false);

    if (uploadError) {
      setError("Nou pa kapab telechaje dokiman an. Tanpri eseye ankò.");
      return;
    }

    setHasDocument(true);
  }

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
        <>
          <div className="mx-4 flex flex-col rounded-lg bg-surface">
            <SettingsListRow
              icon={FileText}
              label="Kat idantite (CIN)"
              iconStyle="badge"
              badge={hasDocument ? kyc?.label : "Voye dokiman"}
              badgeTone={hasDocument ? kyc?.tone : "wait"}
              showChevron={false}
              onClick={() => fileInputRef.current?.click()}
            />
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={handleUpload}
          />

          <div className="px-5 pt-4">
            {isUploading && <p className="text-[0.85rem] text-ink-secondary">Telechajman...</p>}
            {error && <p className="text-[0.85rem] text-late">{error}</p>}
            {hasDocument && !isUploading && !error && (
              <p className="text-[0.85rem] text-ink-secondary">
                Dokiman ou voye deja. Peze ankò pou ranplase l.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
