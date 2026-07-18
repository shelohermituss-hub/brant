"use client";

import { useRouter } from "next/navigation";
import { CheckboxRow } from "@/components/ui/checkbox-row";
import { AssetIcon } from "@/components/ui/asset-icon";

const REQUIREMENTS = [
  { label: "Idantite verifye (CIN)", checked: true },
  { label: "Metòd peman konfime", checked: true },
  { label: "Konsantman siyen", checked: false },
];

export function EligibilityScreen() {
  const router = useRouter();
  const allDone = REQUIREMENTS.every((r) => r.checked);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-surface-muted">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-5 pt-4">
        <button type="button" onClick={() => router.push("/payment-hub")} aria-label="Retour">
          <AssetIcon name="chevron-left" className="text-ink" size={22} />
        </button>
        <span className="text-lg font-bold text-ink">Elijibilite</span>
        <span />
      </div>

      <div className="px-5 pt-4 pb-2">
        <p className="text-[0.95rem] text-ink-secondary">
          {allDone
            ? "Ou elijib pou resevwa yon pot."
            : "Konplete kondisyon sa yo pou w ka resevwa yon pot."}
        </p>
      </div>

      <div className="bg-surface-muted py-3" />

      <div className="bg-surface">
        {REQUIREMENTS.map((req) => (
          <CheckboxRow key={req.label} label={req.label} checked={req.checked} readOnly />
        ))}
      </div>
    </div>
  );
}
