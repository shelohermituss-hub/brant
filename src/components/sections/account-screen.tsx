"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

export function AccountScreen() {
  const router = useRouter();
  const { loading, authUserId, profile, refresh } = useCurrentAppUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleSignOut() {
    await createClient().auth.signOut();
    router.push("/onboarding/signin");
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !authUserId) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Chwazi yon imaj.");
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setUploadError("Imaj la twò gwo (maksimòm 5 Mo).");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    const supabase = createClient();
    const extension = file.name.split(".").pop() ?? "jpg";
    const path = `${authUserId}/avatar.${extension}`;

    const { error: uploadErr } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, cacheControl: "3600" });

    if (uploadErr) {
      setIsUploading(false);
      setUploadError("Nou pa kapab telechaje foto a. Tanpri eseye ankò.");
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(path);

    const { error: updateErr } = await supabase
      .from("users")
      .update({ avatar_url: `${publicUrl}?t=${Date.now()}` })
      .eq("id", authUserId);

    setIsUploading(false);

    if (updateErr) {
      setUploadError("Nou pa kapab anrejistre foto a. Tanpri eseye ankò.");
      return;
    }

    refresh();
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
            <button
              type="button"
              aria-label="Chanje foto pwofil"
              disabled={!authUserId || isUploading}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="text-ink" size={20} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          <button
            type="button"
            aria-label="Chanje foto pwofil"
            disabled={!authUserId || isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-ink-secondary/30"
          >
            {profile?.avatar_url && (
              <Image src={profile.avatar_url} alt="" fill className="object-cover" />
            )}
            {isUploading && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-xs font-bold text-white">
                ...
              </span>
            )}
          </button>

          <div className="flex flex-col items-center gap-0.5">
            <span className="text-lg font-bold text-ink">
              {loading ? "…" : (profile?.full_name ?? "Ou pa konekte")}
            </span>
            {profile?.username && (
              <span className="text-sm text-ink-secondary">@{profile.username}</span>
            )}
          </div>

          {uploadError && <p className="text-[0.85rem] text-late">{uploadError}</p>}

          {!authUserId && !loading && (
            <PillButton
              variant="secondary"
              className="h-12 w-full text-[0.95rem]"
              onClick={() => router.push("/onboarding/signin")}
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
            <PlusCircle className="text-ink" size={22} />
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
        <SettingsListRow icon="user" label="Pèsonèl" showChevron={false} />
        <SettingsListRow
          icon={BadgeCheck}
          label="Kategori kont"
          badge={profile ? TIER_LABEL[profile.merchant_tier] : undefined}
          showChevron={false}
        />
        <SettingsListRow
          icon={Shield}
          label="Sekirite ak konfidansyalite"
          onClick={() => router.push("/account/security")}
        />
        <SettingsListRow icon={Globe} label="Lang" badge="Kreyòl" showChevron={false} />
        <SettingsListRow icon={ArrowDownToLine} label="Limit kont" showChevron={false} />
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
