"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { Check, Plus } from "lucide-react";
import { AssetIcon } from "@/components/ui/asset-icon";
import { ListSkeleton } from "@/components/ui/list-skeleton";
import { StepProgressBar } from "@/components/ui/step-progress-bar";
import { PillButton } from "@/components/ui/pill-button";
import { cn } from "@/lib/utils";
import { avatarColorFor, initialFor } from "@/lib/avatar-color";
import { useCurrentAppUser } from "@/lib/use-current-app-user";
import { createClient } from "@/lib/supabase/client";
import { readGroupCreateDraft, writeGroupCreateDraft } from "@/lib/group-create-store";

// Temporairement à 1 (au lieu de 5) : pas encore d'autres utilisateurs
// Sòlid pour tester, permet de créer un sik solo. À remettre à 5 une
// fois qu'il y a de vrais utilisateurs à inviter.
export const MIN_MEMBERS = 0;
export const MAX_MEMBERS = 25;

interface AppUser {
  id: string;
  full_name: string;
  phone: string;
}

export function GroupCreateMembersScreen() {
  const router = useRouter();
  const { loading: userLoading, authUserId } = useCurrentAppUser();
  const [candidates, setCandidates] = useState<AppUser[] | null>(null);
  const [invited, setInvited] = useState<string[]>(() => readGroupCreateDraft().invitedUserIds ?? []);

  useEffect(() => {
    if (!authUserId) return;
    let cancelled = false;
    const supabase = createClient();

    supabase
      .from("users")
      .select("id, full_name, phone")
      .neq("id", authUserId)
      .order("full_name")
      .then(({ data }) => {
        if (!cancelled) setCandidates(data ?? []);
      });

    return () => {
      cancelled = true;
    };
  }, [authUserId]);

  const toggle = (id: string) => {
    setInvited((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const count = invited.length;
  const withinBounds = count >= MIN_MEMBERS && count <= MAX_MEMBERS;

  function handleNext() {
    writeGroupCreateDraft({ invitedUserIds: invited });
    router.push("/group/create/review");
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 pt-4 pb-6">
      <button
        type="button"
        onClick={() => router.push("/group/create/position")}
        aria-label="Retour"
      >
        <AssetIcon name="chevron-left" className="text-ink" size={22} />
      </button>

      <div className="pt-6">
        <StepProgressBar step={4} total={5} label="Envite manm" />
      </div>

      <h1 className="pt-6 text-[1.6rem] leading-tight font-bold text-ink">
        Envite manm
      </h1>
      <p className="pt-2 text-[0.95rem] text-ink-secondary">
        Minimòm {MIN_MEMBERS}, maksimòm {MAX_MEMBERS} manm (san konte ou)
      </p>

      <div className="flex flex-col pt-4">
        {!userLoading && !authUserId ? (
          <p className="py-6 text-center text-[0.9rem] text-ink-secondary">
            Konekte pou envite manm.
          </p>
        ) : candidates === null ? (
          <ListSkeleton rows={3} />
        ) : candidates.length === 0 ? (
          <p className="py-6 text-center text-[0.9rem] text-ink-secondary">
            Pa gen lòt itilizatè Sòlid pou envite kounye a.
          </p>
        ) : (
          candidates.map((contact, index) => {
            const isInvited = invited.includes(contact.id);
            return (
              <div
                key={contact.id}
                className="stagger-item flex items-center gap-3 border-b border-border py-3 last:border-b-0"
                style={{ "--stagger-index": index } as CSSProperties}
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-bold text-white"
                  style={{ backgroundColor: avatarColorFor(contact.id) }}
                >
                  {initialFor(contact.full_name)}
                </span>
                <div className="flex flex-1 flex-col">
                  <span className="text-[0.95rem] font-bold text-ink">{contact.full_name}</span>
                  <span className="text-sm text-ink-secondary">{contact.phone}</span>
                </div>
                <button
                  type="button"
                  onClick={() => toggle(contact.id)}
                  className={cn(
                    "flex h-9 items-center gap-1 rounded-full px-4 text-[0.85rem] font-bold",
                    isInvited ? "bg-green/10 text-green" : "bg-green text-white"
                  )}
                >
                  {isInvited ? (
                    <>
                      <Check size={14} strokeWidth={3} /> Envite
                    </>
                  ) : (
                    <>
                      <Plus size={14} strokeWidth={3} /> Envite
                    </>
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-lg bg-surface-muted px-4 py-3">
        <span className="text-[0.9rem] text-ink-secondary">Manm envite</span>
        <span
          className={cn(
            "text-[0.95rem] font-bold",
            withinBounds ? "text-ink" : "text-late"
          )}
        >
          {count} / {MIN_MEMBERS}-{MAX_MEMBERS}
        </span>
      </div>

      <div className="mt-auto pt-6">
        <PillButton className="w-full" disabled={!withinBounds} onClick={handleNext}>
          Next
        </PillButton>
      </div>
    </div>
  );
}
