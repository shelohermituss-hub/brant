"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { AssetIcon } from "@/components/ui/asset-icon";
import { ListSkeleton } from "@/components/ui/list-skeleton";
import { useCurrentAppUser } from "@/lib/use-current-app-user";
import { createClient } from "@/lib/supabase/client";

interface InviteRow {
  name: string;
  status: string;
}

export function ReferScreen() {
  const router = useRouter();
  const { loading: userLoading, authUserId, profile } = useCurrentAppUser();
  const [copied, setCopied] = useState(false);
  const [invites, setInvites] = useState<InviteRow[] | null>(null);

  useEffect(() => {
    if (!authUserId) return;
    let cancelled = false;

    createClient()
      .from("referrals")
      .select("status, users!referrals_referred_id_fkey(full_name)")
      .eq("referrer_id", authUserId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (cancelled) return;
        setInvites(
          (data ?? []).map((row) => ({
            name: row.users?.full_name ?? "Zanmi",
            status: row.status === "completed" ? "Konfime" : "An atant",
          }))
        );
      });

    return () => {
      cancelled = true;
    };
  }, [authUserId]);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 pt-4 pb-6">
      <button type="button" onClick={() => router.push("/account")} aria-label="Retour">
        <AssetIcon name="chevron-left" className="text-ink" size={22} />
      </button>

      <div className="flex flex-col gap-1 pt-6">
        <h1 className="text-[1.6rem] leading-tight font-bold text-ink">Envite zanmi ou</h1>
        <p className="text-[0.95rem] text-ink-secondary">
          Jwenn 50 HTG pou chak zanmi ki antre nan yon sòl
        </p>
      </div>

      {!userLoading && !authUserId ? (
        <p className="pt-8 text-center text-[0.9rem] text-ink-secondary">
          Konekte pou wè kòd pèsonèl ou.
        </p>
      ) : (
        <>
          <div className="pt-6">
            <SurfaceCard className="flex flex-col items-center gap-3">
              <span className="text-sm text-ink-secondary">Kòd pèsonèl ou</span>
              <span className="text-[1.75rem] font-bold tracking-wide text-ink">
                {profile?.referral_code ?? "…"}
              </span>
              <PillButton
                variant="secondary"
                className="h-11 w-full text-[0.95rem]"
                disabled={!profile?.referral_code}
                onClick={() => {
                  if (!profile?.referral_code) return;
                  navigator.clipboard?.writeText(profile.referral_code);
                  setCopied(true);
                }}
              >
                {copied ? (
                  <span className="flex items-center gap-2">
                    <Check size={16} /> Kopye
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Copy size={16} /> Kopye kòd la
                  </span>
                )}
              </PillButton>
            </SurfaceCard>
          </div>

          <div className="flex flex-col gap-1 pt-8 pb-2">
            <span className="text-[0.95rem] font-bold text-ink">Envitasyon ou yo</span>
          </div>
          <div className="flex flex-col rounded-lg bg-surface-muted">
            {invites === null ? (
              <ListSkeleton rows={2} />
            ) : invites.length === 0 ? (
              <p className="px-4 py-6 text-center text-[0.9rem] text-ink-secondary">
                Ou poko envite pèsonn.
              </p>
            ) : (
              invites.map((invite, i) => (
                <div
                  key={`${invite.name}-${i}`}
                  className="stagger-item flex items-center justify-between border-b border-border px-4 py-3 last:border-b-0"
                  style={{ "--stagger-index": i } as CSSProperties}
                >
                  <span className="text-[0.95rem] text-ink">{invite.name}</span>
                  <span className="text-sm text-ink-secondary">{invite.status}</span>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
