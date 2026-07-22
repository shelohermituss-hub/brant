"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AssetIcon } from "@/components/ui/asset-icon";
import { AuthField } from "@/components/ui/auth-field";
import { PillButton } from "@/components/ui/pill-button";
import { useCurrentAppUser } from "@/lib/use-current-app-user";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/database.types";

type Profile = Tables<"users">;

export function AccountPersonalScreen() {
  const router = useRouter();
  const { loading, authUserId, profile } = useCurrentAppUser();

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-surface-muted">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-5 pt-4">
        <button type="button" onClick={() => router.push("/account")} aria-label="Retou">
          <AssetIcon name="chevron-left" className="text-ink" size={22} />
        </button>
        <span className="text-lg font-bold text-ink">Pèsonèl</span>
        <span />
      </div>

      {!loading && !authUserId ? (
        <p className="px-5 py-8 text-center text-[0.9rem] text-ink-secondary">
          Konekte pou modifye enfòmasyon ou.
        </p>
      ) : profile ? (
        <PersonalForm authUserId={authUserId!} profile={profile} />
      ) : null}
    </div>
  );
}

function PersonalForm({ authUserId, profile }: { authUserId: string; profile: Profile }) {
  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [username, setUsername] = useState(profile.username ?? "");
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [moncashNumber, setMoncashNumber] = useState(profile.moncash_number ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setIsSaving(true);
    setError(null);
    setSaved(false);

    const { error: updateError } = await createClient()
      .from("users")
      .update({
        full_name: fullName,
        username: username || null,
        phone,
        moncash_number: moncashNumber,
      })
      .eq("id", authUserId);

    setIsSaving(false);

    if (updateError) {
      if (updateError.code === "23505" && updateError.message.includes("users_username")) {
        setError("Non itilizatè a fèk pran. Chwazi yon lòt.");
      } else if (updateError.code === "23505" && updateError.message.includes("users_moncash_number")) {
        setError("Nimewo MonCash sa a deja itilize pa yon lòt kont.");
      } else {
        setError("Nou pa kapab anrejistre chanjman yo. Tanpri eseye ankò.");
      }
      return;
    }

    setSaved(true);
  }

  return (
    <div className="flex flex-col gap-5 px-5 pt-6 pb-8">
      <AuthField label="Non konplè" value={fullName} onChange={setFullName} placeholder="Non konplè ou" />
      <AuthField label="Non itilizatè" value={username} onChange={setUsername} placeholder="Non itilizatè ou" />
      <AuthField label="Nimewo telefòn" value={phone} onChange={setPhone} placeholder="Nimewo telefòn ou" />
      <AuthField
        label="Nimewo MonCash"
        value={moncashNumber}
        onChange={setMoncashNumber}
        placeholder="Nimewo MonCash ou"
      />

      {error && <p className="text-[0.85rem] text-late">{error}</p>}
      {saved && !error && <p className="text-[0.85rem] text-green-deep">Chanjman yo anrejistre.</p>}

      <PillButton
        className="mt-2 w-full"
        disabled={isSaving || !fullName || !phone || !moncashNumber}
        onClick={handleSave}
      >
        {isSaving ? "Anrejistreman..." : "Anrejistre"}
      </PillButton>
    </div>
  );
}
