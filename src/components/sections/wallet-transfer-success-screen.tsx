"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";
import { AssetIcon } from "@/components/ui/asset-icon";
import { formatHtg } from "@/lib/utils";

interface WalletTransferSuccessScreenProps {
  amount: number;
  kind?: "transfer" | "deposit";
}

const CONTENT = {
  transfer: {
    title: (amount: string) => `Ou voye ${amount} nan MonCash ou`,
    body: "Lajan an ap parèt sou kont MonCash ou nan kèk minit.",
  },
  deposit: {
    title: (amount: string) => `Ou ajoute ${amount} nan wallet ou`,
    body: "Balans wallet Sòlid ou fèk mete ajou.",
  },
};

export function WalletTransferSuccessScreen({
  amount,
  kind = "transfer",
}: WalletTransferSuccessScreenProps) {
  const router = useRouter();
  const content = CONTENT[kind];

  return (
    <div className="flex flex-1 flex-col gap-8 overflow-y-auto px-5 pt-4 pb-6">
      <div className="flex items-start justify-between">
        <div className="success-pop flex h-11 w-11 items-center justify-center rounded-full bg-green">
          <Check className="text-white" size={24} strokeWidth={3} />
        </div>
        <button type="button" onClick={() => router.push("/payment-hub")} aria-label="Fermer">
          <AssetIcon name="cross" className="text-ink" size={20} />
        </button>
      </div>

      <p className="text-[1.6rem] leading-tight font-bold text-ink">
        {content.title(formatHtg(amount))}
      </p>

      <div className="mt-auto flex flex-col gap-4 rounded-lg border border-border p-5">
        <div className="relative mx-auto flex aspect-[16/9] w-full max-w-[220px] items-center justify-center">
          <Image
            src="/images/illustration-wallet-transfer-success.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <p className="text-[0.95rem] text-ink-secondary">{content.body}</p>
      </div>

      <PillButton className="w-full" onClick={() => router.push("/payment-hub/wallet")}>
        Done
      </PillButton>
    </div>
  );
}
