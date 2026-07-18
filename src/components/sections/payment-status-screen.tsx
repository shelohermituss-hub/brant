"use client";

import { useRouter } from "next/navigation";
import { Check, Clock, X } from "lucide-react";
import { Chip } from "@/components/ui/chip";
import { PillButton } from "@/components/ui/pill-button";
import { AssetIcon } from "@/components/ui/asset-icon";

export type PaymentStatus = "paid" | "wait" | "late";

interface PaymentStatusScreenProps {
  status: PaymentStatus;
}

const CONTENT: Record<
  PaymentStatus,
  { icon: typeof Check; title: string; body: string; chipLabel: string; cta: string }
> = {
  paid: {
    icon: Check,
    title: "Kotizasyon konfime",
    body: "Peman ou verifye ak MonCash. Yon resi ak referans disponib nan istwa ou.",
    chipLabel: "Peye",
    cta: "Wè resi a",
  },
  wait: {
    icon: Clock,
    title: "N ap tann konfimasyon",
    body: "MonCash poko konfime tranzaksyon an. Sa ka pran kèk minit — nou ap verifye otomatikman.",
    chipLabel: "An atant",
    cta: "Verifye estati",
  },
  late: {
    icon: X,
    title: "Peman echwe",
    body: "Nou pa t kapab konfime peman an ak MonCash. Eseye ankò oswa chwazi yon lòt metòd.",
    chipLabel: "An reta",
    cta: "Eseye ankò",
  },
};

export function PaymentStatusScreen({ status }: PaymentStatusScreenProps) {
  const router = useRouter();
  const { icon: Icon, title, body, chipLabel, cta } = CONTENT[status];

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-5 pt-4 pb-6">
      <button type="button" onClick={() => router.push("/payment-hub")} aria-label="Fermer">
        <AssetIcon name="cross" className="text-ink" size={20} />
      </button>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <span
          className="flex h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundColor: `var(--color-${status})` }}
        >
          <Icon className="text-white" size={30} strokeWidth={3} />
        </span>
        <Chip variant={status}>{chipLabel}</Chip>
        <p className="text-[1.4rem] leading-tight font-bold text-ink">{title}</p>
        <p className="max-w-[300px] text-[0.95rem] text-ink-secondary">{body}</p>
      </div>

      <PillButton
        variant="primary"
        className="w-full"
        onClick={() =>
          router.push(status === "late" ? "/stocks/cycle/buy" : "/payment-hub/history")
        }
      >
        {cta}
      </PillButton>
    </div>
  );
}
