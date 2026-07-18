"use client";

import { useRouter } from "next/navigation";
import {
  Grid2x2,
  Upload,
  PlusCircle,
  Shield,
  ArrowDownToLine,
  FileText,
  Globe,
  Gift,
  BadgeCheck,
} from "lucide-react";
import { SurfaceCard } from "@/components/ui/surface-card";
import { PillButton } from "@/components/ui/pill-button";
import { SettingsListRow } from "@/components/ui/settings-list-row";
import { TwitterIcon, InstagramIcon } from "@/components/ui/social-icons";
import { AssetIcon } from "@/components/ui/asset-icon";
import { useCurrentAppUser } from "@/lib/use-current-app-user";
import { createClient } from "@/lib/supabase/client";

const TIER_LABEL: Record<string, string> = { bronze: "Bronze", silver: "Silver", gold: "Gold" };

export function AccountScreen() {
  const router = useRouter();
  const { loading, authUserId, profile } = useCurrentAppUser();

  async function handleSignOut() {
    await createClient().auth.signOut();
    router.push("/onboarding/email");
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-surface-muted">
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <h1 className="text-[1.75rem] font-bold text-ink">Kont ou</h1>
        <button type="button" onClick={() => router.push("/home")} aria-label="Fermer">
          <AssetIcon name="cross" className="text-ink" size={22} />
        </button>
      </div>

      <div className="px-4 pb-4">
        <SurfaceCard className="flex flex-col items-center gap-4">
          <div className="flex w-full items-start justify-between">
            <Grid2x2 className="text-ink" size={20} />
            <Upload className="text-ink" size={20} />
          </div>
          <div className="h-20 w-20 rounded-full bg-ink-secondary/30" />
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-lg font-bold text-ink">
              {loading ? "…" : (profile?.full_name ?? "Ou pa konekte")}
            </span>
            {profile?.moncash_number && (
              <span className="text-sm text-ink-secondary">{profile.moncash_number}</span>
            )}
          </div>
          {!authUserId && !loading && (
            <PillButton
              variant="secondary"
              className="h-12 w-full text-[0.95rem]"
              onClick={() => router.push("/onboarding/email")}
            >
              Konekte
            </PillButton>
          )}
        </SurfaceCard>
      </div>

      <div className="px-4 pb-6">
        <SurfaceCard
          as="button"
          type="button"
          onClick={() => router.push("/refer")}
          className="flex w-full items-center gap-4 text-left"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green">
            <PlusCircle className="text-white" size={22} />
          </span>
          <div className="flex flex-1 flex-col">
            <span className="text-[0.95rem] font-bold text-ink">Envite zanmi ou</span>
            <span className="text-sm text-ink-secondary">Jwenn 50 HTG</span>
          </div>
        </SurfaceCard>
      </div>

      <div className="bg-surface-muted px-5 py-2">
        <span className="text-xs font-semibold tracking-wide text-ink-secondary">
          KONT AK REGLAJ
        </span>
      </div>

      <div className="flex flex-col bg-surface">
        <SettingsListRow icon="user" label="Pèsonèl" />
        <SettingsListRow
          icon={BadgeCheck}
          label="Kategori kont"
          badge={profile ? TIER_LABEL[profile.merchant_tier] : undefined}
        />
        <SettingsListRow
          icon={Shield}
          label="Sekirite ak konfidansyalite"
          onClick={() => router.push("/account/security")}
        />
        <SettingsListRow icon={Globe} label="Lang" badge="Kreyòl" />
        <SettingsListRow icon={ArrowDownToLine} label="Limit kont" />
        <SettingsListRow
          icon="notifications"
          label="Notifications"
          onClick={() => router.push("/account/notifications")}
        />
        <SettingsListRow
          icon={FileText}
          label="Documents"
          onClick={() => router.push("/account/documents")}
        />
        <SettingsListRow icon={Gift} label="Parennaj" onClick={() => router.push("/refer")} />
        <SettingsListRow
          icon={FileText}
          label="Èd"
          onClick={() => router.push("/account/help")}
        />
      </div>

      <div className="bg-surface-muted py-3" />

      {authUserId && (
        <div className="bg-surface py-5 text-center">
          <button type="button" className="text-[1.05rem] font-bold text-red" onClick={handleSignOut}>
            Dekonekte
          </button>
        </div>
      )}

      <div className="flex flex-col items-center gap-5 bg-surface-muted px-8 py-6 text-center">
        <p className="text-sm text-ink-secondary">
          Sòlid&apos;s <span className="underline">Règleman konfidansyalite</span>,{" "}
          <span className="underline">Kondisyon itilizasyon</span>, ak{" "}
          <span className="underline">Lojisyèl open source</span>
        </p>
        <div className="flex gap-6">
          <TwitterIcon className="text-ink-secondary" size={20} />
          <InstagramIcon className="text-ink-secondary" size={20} />
        </div>
        <p className="text-xs text-ink-secondary">Vèsyon 1.0.0</p>
      </div>
    </div>
  );
}
