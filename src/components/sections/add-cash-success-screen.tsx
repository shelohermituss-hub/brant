"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";

export function AddCashSuccessScreen() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col gap-8 px-5 pt-4 pb-6">
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green">
          <Check className="text-white" size={24} strokeWidth={3} />
        </div>
        <button
          type="button"
          onClick={() => router.push("/")}
          aria-label="Fermer"
        >
          <X className="text-ink" size={24} />
        </button>
      </div>

      <p className="text-[1.6rem] leading-tight font-bold text-ink">
        You added $50 to your Cash App
      </p>

      <div className="mt-auto flex flex-col gap-4 rounded-lg border border-border p-5">
        <div className="relative mx-auto aspect-[16/9] w-full max-w-[220px]">
          <Image
            src="/images/illustration-success-deposit.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <p className="text-[1.05rem] font-bold text-ink">
          Get paid up to 2 days faster with direct deposit
        </p>
        <PillButton variant="secondary" className="h-12 w-full text-[0.95rem]">
          Get Started
        </PillButton>
      </div>

      <PillButton className="w-full" onClick={() => router.push("/")}>
        Done
      </PillButton>
    </div>
  );
}
