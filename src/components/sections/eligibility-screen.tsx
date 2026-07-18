"use client";

import { useRouter } from "next/navigation";
import { CheckboxRow } from "@/components/ui/checkbox-row";
import { AssetIcon } from "@/components/ui/asset-icon";
import { useCurrentAppUser } from "@/lib/use-current-app-user";

export function EligibilityScreen() {
  const router = useRouter();
  const { loading, authUserId, profile } = useCurrentAppUser();

  const requirements = [
    { label: "Idantite verifye (CIN)", checked: profile?.kyc_status === "verified" },
    { label: "Metòd peman konfime", checked: !!profile?.moncash_number },
    { label: "Konsantman siyen", checked: !!profile?.consent_signed_at },
  ];
  const allDone = requirements.every((r) => r.checked);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-surface-muted">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-5 pt-4">
        <button type="button" onClick={() => router.push("/payment-hub")} aria-label="Retour">
          <AssetIcon name="chevron-left" className="text-ink" size={22} />
        </button>
        <span className="text-lg font-bold text-ink">Elijibilite</span>
        <span />
      </div>

      {!loading && !authUserId ? (
        <p className="px-5 py-8 text-center text-[0.9rem] text-ink-secondary">
          Konekte pou wè elijibilite ou.
        </p>
      ) : (
        <>
          <div className="px-5 pt-4 pb-2">
            <p className="text-[0.95rem] text-ink-secondary">
              {allDone
                ? "Ou elijib pou resevwa yon pot."
                : "Konplete kondisyon sa yo pou w ka resevwa yon pot."}
            </p>
          </div>

          <div className="bg-surface-muted py-3" />

          <div className="bg-surface">
            {requirements.map((req) => (
              <CheckboxRow key={req.label} label={req.label} checked={req.checked} readOnly />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
