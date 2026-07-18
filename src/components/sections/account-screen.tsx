"use client";

import { useRouter } from "next/navigation";
import {
  Grid2x2,
  Upload,
  PlusCircle,
  Link as LinkIcon,
  Shield,
  Star,
  Users,
  ArrowDownToLine,
  FileText,
} from "lucide-react";
import { SurfaceCard } from "@/components/ui/surface-card";
import { PillButton } from "@/components/ui/pill-button";
import { SettingsListRow } from "@/components/ui/settings-list-row";
import { TwitterIcon, InstagramIcon } from "@/components/ui/social-icons";
import { AssetIcon } from "@/components/ui/asset-icon";

export function AccountScreen() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-surface-muted">
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <h1 className="text-[1.75rem] font-bold text-ink">Your Account</h1>
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
            <span className="text-lg font-bold text-ink">Judy Smith</span>
            <span className="text-sm text-ink-secondary">$JudySmith</span>
          </div>
          <PillButton variant="secondary" className="h-12 w-full text-[0.95rem]">
            Edit Profile
          </PillButton>
        </SurfaceCard>
      </div>

      <div className="px-4 pb-6">
        <SurfaceCard className="flex items-center gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green">
            <PlusCircle className="text-white" size={22} />
          </span>
          <div className="flex flex-1 flex-col">
            <span className="text-[0.95rem] font-bold text-ink">Invite friends</span>
            <span className="text-sm text-ink-secondary">Get $5</span>
          </div>
        </SurfaceCard>
      </div>

      <div className="bg-surface-muted px-5 py-2">
        <span className="text-xs font-semibold tracking-wide text-ink-secondary">
          ACCOUNT &amp; SETTINGS
        </span>
      </div>

      <div className="flex flex-col bg-surface">
        <SettingsListRow icon="user" label="Personal" />
        <SettingsListRow icon={LinkIcon} label="Linked Banks" />
        <SettingsListRow
          icon={Shield}
          label="Security & Privacy"
          onClick={() => router.push("/account/security")}
        />
        <SettingsListRow icon={Star} label="Favorites" badge="New" />
        <SettingsListRow icon={Users} label="Family" />
        <SettingsListRow icon={ArrowDownToLine} label="Limits" />
        <SettingsListRow
          icon="notifications"
          label="Notifications"
          onClick={() => router.push("/account/notifications")}
        />
        <SettingsListRow icon={FileText} label="Documents" />
        <SettingsListRow
          icon={FileText}
          label="Support"
          onClick={() => router.push("/account/help")}
        />
      </div>

      <div className="bg-surface-muted py-3" />

      <div className="bg-surface py-5 text-center">
        <button type="button" className="text-[1.05rem] font-bold text-red">
          Sign Out
        </button>
      </div>

      <div className="flex flex-col items-center gap-5 bg-surface-muted px-8 py-6 text-center">
        <p className="text-sm text-ink-secondary">
          Cash App&apos;s <span className="underline">Privacy Notice</span>,{" "}
          <span className="underline">Terms of Service</span>, and{" "}
          <span className="underline">Open Source Software</span>
        </p>
        <div className="flex gap-6">
          <TwitterIcon className="text-ink-secondary" size={20} />
          <InstagramIcon className="text-ink-secondary" size={20} />
        </div>
        <p className="text-xs text-ink-secondary">Version 4.7.1 (4071001)</p>
      </div>
    </div>
  );
}
