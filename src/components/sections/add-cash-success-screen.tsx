"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";
import { AssetIcon } from "@/components/ui/asset-icon";
import { SoleyBurst } from "@/components/ui/soley-burst";

interface AddCashSuccessScreenProps {
  variant?: "deposit" | "cycle-complete";
}

export function AddCashSuccessScreen({ variant = "deposit" }: AddCashSuccessScreenProps) {
  const router = useRouter();
  const isCycleComplete = variant === "cycle-complete";

  return (
    <div className="flex flex-1 flex-col gap-8 overflow-y-auto px-5 pt-4 pb-6">
      <div className="flex items-start justify-between">
        <div className="success-pop flex h-11 w-11 items-center justify-center rounded-full bg-green">
          <Check className="text-ink" size={24} strokeWidth={3} />
        </div>
        <button
          type="button"
          onClick={() => router.push("/home")}
          aria-label="Fermer"
        >
          <AssetIcon name="cross" className="text-ink" size={20} />
        </button>
      </div>

      <p className="text-[1.6rem] leading-tight font-bold text-ink">
        {isCycleComplete
          ? "Felisitasyon! Ou fini yon sik konplè"
          : "Ou mete 5 000 HTG nan Sòlid ou"}
      </p>

      <div className="mt-auto flex flex-col gap-4 rounded-lg border border-border p-5">
        <div className="relative mx-auto flex aspect-[16/9] w-full max-w-[220px] items-center justify-center">
          {isCycleComplete ? (
            <SoleyBurst />
          ) : (
            <Image
              src="/images/illustration-success-deposit.png"
              alt=""
              fill
              className="object-contain"
            />
          )}
        </div>
        <p className="text-[1.05rem] font-bold text-ink">
          {isCycleComplete
            ? "Skò fyabilite ou monte apre chak sik konplete"
            : "W ap resevwa yon resi ak referans MonCash apre chak vèsman"}
        </p>
        <PillButton
          variant="secondary"
          className="h-12 w-full text-[0.95rem]"
          onClick={() => router.push(isCycleComplete ? "/stocks/score" : "/payment-hub/wallet")}
        >
          {isCycleComplete ? "Wè Kredi/Skò" : "Wè detay yo"}
        </PillButton>
      </div>

      <PillButton className="w-full" onClick={() => router.push("/home")}>
        Done
      </PillButton>
    </div>
  );
}
