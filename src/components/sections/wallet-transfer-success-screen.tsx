"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";
import { AssetIcon } from "@/components/ui/asset-icon";
import { formatHtg } from "@/lib/utils";

interface WalletTransferSuccessScreenProps {
  amount: number;
}

export function WalletTransferSuccessScreen({ amount }: WalletTransferSuccessScreenProps) {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col gap-8 overflow-y-auto px-5 pt-4 pb-6">
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green">
          <Check className="text-white" size={24} strokeWidth={3} />
        </div>
        <button type="button" onClick={() => router.push("/payment-hub")} aria-label="Fermer">
          <AssetIcon name="cross" className="text-ink" size={20} />
        </button>
      </div>

      <p className="text-[1.6rem] leading-tight font-bold text-ink">
        Ou voye {formatHtg(amount)} nan MonCash ou
      </p>

      <p className="text-[0.95rem] text-ink-secondary">
        Lajan an ap parèt sou kont MonCash ou nan kèk minit.
      </p>

      <PillButton className="mt-auto w-full" onClick={() => router.push("/payment-hub/wallet")}>
        Done
      </PillButton>
    </div>
  );
}
