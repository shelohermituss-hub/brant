"use client";

import { useRouter } from "next/navigation";
import { PillButton } from "@/components/ui/pill-button";
import { AssetIcon } from "@/components/ui/asset-icon";
import { StepProgressBar } from "@/components/ui/step-progress-bar";

const POT_AMOUNT = 50_000;
const DURATION_MONTHS = 10;
const INSTALLMENTS_PER_MONTH = 1;
const MEMBERS_INVITED = 8;

const PER_INSTALLMENT = POT_AMOUNT / DURATION_MONTHS / INSTALLMENTS_PER_MONTH;

// Barème réel du skill moncash-flow (Règle 6.1) — palier Bronze par défaut.
const COLLECTION_FEE_RATE_BRONZE = 0.005;
const collectionFeePerInstallment = Math.round(PER_INSTALLMENT * COLLECTION_FEE_RATE_BRONZE);
const totalInstallments = DURATION_MONTHS * INSTALLMENTS_PER_MONTH * MEMBERS_INVITED;
const totalAdminFees = collectionFeePerInstallment * totalInstallments;

const formatAmount = (value: number) => Math.round(value).toLocaleString("fr-FR").replace(/,/g, " ");

const ROWS = [
  { label: "Pot", value: `${formatAmount(POT_AMOUNT)} HTG` },
  { label: "Dire sik la", value: `${DURATION_MONTHS} mwa` },
  { label: "Frekans peman", value: "Chak mwa" },
  { label: "Kantite pou chak vèsman", value: `${formatAmount(PER_INSTALLMENT)} HTG` },
  { label: "Pozisyon ou", value: "7 sou 10" },
  { label: "Manm envite", value: `${MEMBERS_INVITED}` },
];

export function GroupCreateReviewScreen() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-5 pt-4 pb-6">
      <button
        type="button"
        onClick={() => router.push("/group/create/members")}
        aria-label="Retour"
      >
        <AssetIcon name="chevron-left" className="text-ink" size={22} />
      </button>

      <StepProgressBar step={5} total={5} label="Konfime" />

      <div className="flex flex-col gap-1">
        <h1 className="text-[1.6rem] font-bold text-ink">Konfime patisipasyon ou</h1>
        <p className="text-sm font-medium tracking-wide text-ink-secondary uppercase">
          Sòl Fanmi
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {ROWS.map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <span className="text-[0.95rem] text-ink-secondary">{row.label}</span>
            <span className="text-[0.95rem] font-bold text-ink">{row.value}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 rounded-lg bg-surface-muted px-4 py-4">
        <div className="flex items-center justify-between">
          <span className="text-[0.9rem] text-ink-secondary">Frè administratif (tout sik la)</span>
          <span className="text-[0.95rem] font-bold text-ink">{formatAmount(totalAdminFees)} HTG</span>
        </div>
        <span className="text-xs text-ink-secondary">
          {collectionFeePerInstallment} HTG × {totalInstallments} vèsman (frè kolèkt 0,5 %)
        </span>
      </div>

      <p className="mt-auto text-center text-sm text-ink-secondary">
        Lè ou konfime, ou antre reyèlman nan gwoup la ak angajman prelèvman
        chak mwa jiskaske ou resevwa pot ou.
      </p>

      <PillButton
        variant="primary"
        className="w-full"
        onClick={() => router.push("/group/forming")}
      >
        Konfime
      </PillButton>
    </div>
  );
}
