"use client";

import { useRouter } from "next/navigation";
import { Chip } from "@/components/ui/chip";
import { AssetIcon } from "@/components/ui/asset-icon";

const CONTRIBUTIONS = [
  { date: "15 jen 2026", amount: "5 000 HTG", status: "paid" as const, ref: "MC-88213" },
  { date: "15 me 2026", amount: "5 000 HTG", status: "paid" as const, ref: "MC-87950" },
  { date: "15 avril 2026", amount: "5 000 HTG", status: "late" as const, ref: "MC-87602" },
];

const PAYOUTS = [{ date: "15 janvye 2026", amount: "50 000 HTG", status: "paid" as const, ref: "MC-84410" }];

const STATUS_LABEL = { paid: "Peye", wait: "An atant", late: "An reta" } as const;

function HistoryRow({
  date,
  amount,
  status,
  ref,
}: {
  date: string;
  amount: string;
  status: "paid" | "wait" | "late";
  ref: string;
}) {
  const router = useRouter();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => router.push(`/payment-status?state=${status}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter") router.push(`/payment-status?state=${status}`);
      }}
      className="flex w-full items-center justify-between border-b border-border px-5 py-4 text-left last:border-b-0"
    >
      <div className="flex flex-col">
        <span className="text-[0.95rem] font-bold text-ink">{amount}</span>
        <span className="text-sm text-ink-secondary">{date}</span>
        <span className="text-xs text-ink-secondary">Ref. {ref}</span>
      </div>
      <Chip variant={status} className="h-7 px-3 text-xs pointer-events-none">
        {STATUS_LABEL[status]}
      </Chip>
    </div>
  );
}

export function HistoryScreen() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-surface-muted">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-5 pt-4">
        <button type="button" onClick={() => router.push("/payment-hub")} aria-label="Retour">
          <AssetIcon name="chevron-left" className="text-ink" size={22} />
        </button>
        <span className="text-lg font-bold text-ink">Istwa</span>
        <span />
      </div>

      <div className="bg-surface-muted px-5 py-3 pt-6">
        <span className="text-xs font-semibold tracking-wide text-ink-secondary">
          KOTIZASYON PEYE
        </span>
      </div>
      <div className="bg-surface">
        {CONTRIBUTIONS.map((row) => (
          <HistoryRow key={row.ref} {...row} />
        ))}
      </div>

      <div className="bg-surface-muted px-5 py-3 pt-6">
        <span className="text-xs font-semibold tracking-wide text-ink-secondary">
          POT RESEVWA
        </span>
      </div>
      <div className="bg-surface">
        {PAYOUTS.map((row) => (
          <HistoryRow key={row.ref} {...row} />
        ))}
      </div>
    </div>
  );
}
