"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckboxRow } from "@/components/ui/checkbox-row";
import { AssetIcon } from "@/components/ui/asset-icon";
import { ListSkeleton } from "@/components/ui/list-skeleton";
import { useCurrentAppUser } from "@/lib/use-current-app-user";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/database.types";

type Profile = Tables<"users">;

interface NotificationPreferences {
  push: boolean;
  sms: boolean;
  email: boolean;
  payment_reminders: boolean;
  group_activity: boolean;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  push: false,
  sms: true,
  email: false,
  payment_reminders: true,
  group_activity: false,
};

function readPreferences(raw: Profile["notification_preferences"]): NotificationPreferences {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return DEFAULT_PREFERENCES;
  const value = raw as Record<string, unknown>;
  return {
    push: typeof value.push === "boolean" ? value.push : DEFAULT_PREFERENCES.push,
    sms: typeof value.sms === "boolean" ? value.sms : DEFAULT_PREFERENCES.sms,
    email: typeof value.email === "boolean" ? value.email : DEFAULT_PREFERENCES.email,
    payment_reminders:
      typeof value.payment_reminders === "boolean"
        ? value.payment_reminders
        : DEFAULT_PREFERENCES.payment_reminders,
    group_activity:
      typeof value.group_activity === "boolean"
        ? value.group_activity
        : DEFAULT_PREFERENCES.group_activity,
  };
}

export function NotificationsScreen() {
  const router = useRouter();
  const { loading, authUserId, profile } = useCurrentAppUser();

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-surface-muted">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-5 pt-4">
        <button type="button" onClick={() => router.push("/account")} aria-label="Retour">
          <AssetIcon name="chevron-left" className="text-ink" size={22} />
        </button>
        <span className="text-lg font-bold text-ink">Notifications</span>
        <span />
      </div>

      <div className="bg-surface-muted py-4" />

      {!authUserId && !loading ? (
        <p className="px-5 pb-6 text-center text-[0.9rem] text-ink-secondary">
          Konekte pou jere notifikasyon ou.
        </p>
      ) : !profile ? (
        <ListSkeleton rows={3} />
      ) : (
        <NotificationToggles authUserId={authUserId!} profile={profile} />
      )}
    </div>
  );
}

function NotificationToggles({ authUserId, profile }: { authUserId: string; profile: Profile }) {
  const [prefs, setPrefs] = useState(() => readPreferences(profile.notification_preferences));

  function toggle(key: keyof NotificationPreferences) {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    createClient().from("users").update({ notification_preferences: next }).eq("id", authUserId);
  }

  return (
    <>
      <div className="bg-surface">
        <CheckboxRow label="Notifikasyon Push" checked={prefs.push} onToggle={() => toggle("push")} />
        <CheckboxRow label="Notifikasyon SMS" checked={prefs.sms} onToggle={() => toggle("sms")} />
        <CheckboxRow label="Notifikasyon Imel" checked={prefs.email} onToggle={() => toggle("email")} />
      </div>

      <div className="bg-surface-muted py-3" />

      <div className="bg-surface">
        <CheckboxRow
          label="Rapèl kotizasyon"
          checked={prefs.payment_reminders}
          onToggle={() => toggle("payment_reminders")}
        />
        <CheckboxRow
          label="Aktivite gwoup"
          checked={prefs.group_activity}
          onToggle={() => toggle("group_activity")}
        />
      </div>
    </>
  );
}
