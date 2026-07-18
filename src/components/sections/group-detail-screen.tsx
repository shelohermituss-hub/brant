"use client";

import { useRouter } from "next/navigation";
import { Wallet, Smartphone } from "lucide-react";
import { WonnAvatarRoute, type AvatarMember } from "@/components/ui/wonn-avatar-route";
import { PaymentCountdown } from "@/components/ui/payment-countdown";
import { SurfaceCard } from "@/components/ui/surface-card";
import { Chip } from "@/components/ui/chip";
import { PillButton } from "@/components/ui/pill-button";
import { AssetIcon } from "@/components/ui/asset-icon";

const MEMBERS: AvatarMember[] = [
  { position: 1, name: "Marie L.", initial: "M", color: "var(--color-purple)" },
  { position: 2, name: "Peterson J.", initial: "P", color: "var(--color-blue)" },
  { position: 3, name: "Sandy G.", initial: "S", color: "var(--color-orange)" },
  { position: 4, name: "Diego M.", initial: "D", color: "var(--color-cyan)" },
  { position: 5, name: "Fabiola R.", initial: "F", color: "var(--color-purple)" },
  { position: 6, name: "Sara D.", initial: "S", color: "var(--color-green-deep)" },
  { position: 7, name: "Junior P.", initial: "J", color: "var(--color-blue)" },
  { position: 8, name: "Nadège C.", initial: "N", color: "var(--color-orange)" },
  { position: 9, name: "Wilson B.", initial: "W", color: "var(--color-cyan)" },
  { position: 10, name: "Kettelie A.", initial: "K", color: "var(--color-purple)" },
];

const MOTIF_TAGS = ["Lekòl", "Bòdwo", "Telefòn"];

const POT_ROWS = [
  { label: "Manm", value: "10" },
  { label: "Dire sik la", value: "30 jou" },
  { label: "Frekans peman", value: "Chak 3 jou" },
  { label: "Kantite pou chak vèsman", value: "5 000 HTG" },
];

const NEXT_PAYMENT_DATE = new Date("2026-07-21T00:00:00");

export function GroupDetailScreen() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-surface-muted">
      <div className="flex items-center justify-between bg-surface px-4 pt-4 pb-2">
        <button type="button" onClick={() => router.push("/card")} aria-label="Retour">
          <AssetIcon name="chevron-left" className="text-ink" size={22} />
        </button>
        <span className="text-lg font-bold text-ink">Sòl Fanmi</span>
        <span className="w-[22px]" />
      </div>

      <div className="bg-surface pb-4">
        <WonnAvatarRoute members={MEMBERS} currentPosition={6} />
      </div>

      <div className="flex flex-col gap-1 px-5 pt-5 pb-3">
        <span className="text-[0.9rem] text-ink-secondary">Ou dwe peye</span>
        <p className="text-[2.5rem] leading-none font-bold text-ink">5 000 HTG</p>
      </div>

      <div className="px-4 pb-4">
        <SurfaceCard className="flex flex-col gap-5">
          <span className="text-lg font-bold text-ink">Detay</span>

          <div className="flex gap-2 overflow-x-auto">
            {MOTIF_TAGS.map((tag) => (
              <Chip key={tag} variant="secondary" className="pointer-events-none">
                {tag}
              </Chip>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {POT_ROWS.map((row) => (
              <div key={row.label} className="flex items-center justify-between">
                <span className="text-[0.9rem] text-ink-secondary">{row.label}</span>
                <span className="text-[0.9rem] font-bold text-ink">{row.value}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[0.9rem] font-bold text-ink">Pwochen peman nan</span>
            <PaymentCountdown targetDate={NEXT_PAYMENT_DATE} />
          </div>

          <div className="flex items-center justify-between border-t border-border pt-4">
            <span className="text-[0.9rem] text-ink-secondary">Dat pwochen peman</span>
            <span className="text-[0.9rem] font-bold text-ink">21 jiyè 2026</span>
          </div>
        </SurfaceCard>
      </div>

      <div className="px-5 pt-2 pb-2">
        <span className="text-xs font-semibold tracking-wide text-ink-secondary">
          KONT KONEKTE
        </span>
      </div>

      <div className="mx-4 mb-6 flex flex-col rounded-lg bg-surface">
        <div className="flex items-center gap-4 border-b border-border px-5 py-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green">
            <Wallet className="text-white" size={20} />
          </span>
          <div className="flex flex-1 flex-col">
            <span className="text-[0.95rem] font-bold text-ink">Wallet Sòlid</span>
            <span className="text-sm text-ink-secondary">Balans entèn</span>
          </div>
          <span className="text-[0.95rem] font-bold text-ink">1 250 HTG</span>
        </div>

        <div className="flex items-center gap-4 px-5 py-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue">
            <Smartphone className="text-white" size={20} />
          </span>
          <div className="flex flex-1 flex-col">
            <span className="text-[0.95rem] font-bold text-ink">MonCash</span>
            <span className="text-sm text-ink-secondary">3711 2345 — konekte</span>
          </div>
          <AssetIcon name="chevron-right" className="text-ink-secondary" size={16} />
        </div>
      </div>

      <div className="mt-auto flex gap-3 px-4 pb-6">
        <PillButton
          variant="primary"
          className="flex-1"
          onClick={() => router.push("/stocks/cycle/buy")}
        >
          Peye kotizasyon
        </PillButton>
      </div>
    </div>
  );
}
