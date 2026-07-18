"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";

const ROWS = [
  { label: "Funding Source", value: "Debit Card" },
  { label: "Order Type", value: "Standard" },
  { label: "Approx Share Price", value: "$612.40", hasChevron: true },
  { label: "Approx Shares", value: "0.016", hasChevron: true },
  { label: "Symbol", value: "META" },
];

const TOTAL_ROWS = [
  { label: "Total Purchase Amount", value: "$10.00" },
  { label: "Fees", value: "$0.00" },
  { label: "Total Cost", value: "$10.00" },
];

export function OrderReviewScreen() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col gap-6 px-5 pt-4 pb-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.push("/")}
          aria-label="Fermer"
        >
          <X className="text-ink" size={24} />
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-[1.6rem] font-bold text-ink">Buy $10 of Meta</h1>
        <p className="text-sm font-medium tracking-wide text-ink-secondary uppercase">
          Tomorrow at 6:30 AM
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {ROWS.map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-[0.95rem] text-ink-secondary">
              {row.label}
              {row.hasChevron && <span className="text-ink-secondary">›</span>}
            </span>
            <span className="text-[0.95rem] text-ink-secondary">{row.value}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {TOTAL_ROWS.map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <span className="text-[0.95rem] text-ink-secondary">{row.label}</span>
            <span className="text-[0.95rem] text-ink-secondary">{row.value}</span>
          </div>
        ))}
      </div>

      <p className="text-center text-sm leading-relaxed text-ink-secondary">
        By proceeding, I certify under penalties of perjury that I reviewed
        the info on this{" "}
        <span className="underline">Form W-9</span> and that it&apos;s
        correct. The IRS doesn&apos;t require my consent to any provision of
        this document other than the certifications required to avoid
        backup withholding.
      </p>

      <p className="mt-auto text-center text-sm text-ink-secondary">
        Brokerage services provided by Cash App Investing LLC, member
        FINRA / SIPC.
      </p>

      <PillButton
        variant="orange"
        className="w-full"
        onClick={() => router.push("/")}
      >
        Schedule
      </PillButton>
    </div>
  );
}
