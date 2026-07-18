"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { GroupCard } from "@/components/ui/group-card";
import { CircleEmptyIcon } from "@/components/ui/circle-empty-icon";
import { cn, formatHtg } from "@/lib/utils";
import { useCurrentAppUser } from "@/lib/use-current-app-user";
import { createClient } from "@/lib/supabase/client";

interface GroupCardData {
  id: string;
  name: string;
  potAmount: number;
  contribution: number;
  memberCount: number;
  yourPosition: number;
  startDate: string;
  endDate: string;
  adminFees: number;
}

const ACTIVE_STATES = ["active", "collecting", "pot_ready", "pot_sent", "next_month"];
const COLLECTION_FEE_RATE_BRONZE = 0.005;
const COLLECTION_FEE_RATE_SILVER_GOLD = 0.02;

function formatMonth(date: Date) {
  const label = new Intl.DateTimeFormat("fr-FR", { month: "short", year: "numeric" }).format(date);
  return label.charAt(0).toUpperCase() + label.slice(1).replace(".", "");
}

function estimateAdminFees(monthlyAmount: number, totalMembers: number, tier: string | null) {
  const rate = tier === "bronze" || !tier ? COLLECTION_FEE_RATE_BRONZE : COLLECTION_FEE_RATE_SILVER_GOLD;
  return Math.round(monthlyAmount * rate) * totalMembers;
}

export function CardScreen() {
  const { authUserId } = useCurrentAppUser();
  const [tab, setTab] = useState<"active" | "finished">("active");
  const [myGroups, setMyGroups] = useState<GroupCardData[] | null>(null);
  const [myGroupStates, setMyGroupStates] = useState<Record<string, string>>({});
  const [recommended, setRecommended] = useState<GroupCardData[] | null>(null);
  const [requested, setRequested] = useState<string[]>([]);

  useEffect(() => {
    if (!authUserId) return;
    let cancelled = false;
    const supabase = createClient();

    async function load(userId: string) {
      const { data: memberships } = await supabase
        .from("memberships")
        .select(
          "position, groups(id, name, amount, monthly_amount, total_members, state, created_at, organizer:users!organizer_id(merchant_tier))"
        )
        .eq("user_id", userId);

      const joinedGroupIds = new Set<string>();
      const states: Record<string, string> = {};
      const mine: GroupCardData[] = [];

      for (const row of memberships ?? []) {
        const g = row.groups;
        if (!g) continue;
        joinedGroupIds.add(g.id);
        states[g.id] = g.state;
        const start = new Date(g.created_at);
        const end = new Date(start);
        end.setMonth(end.getMonth() + g.total_members);
        mine.push({
          id: g.id,
          name: g.name,
          potAmount: g.amount,
          contribution: g.monthly_amount,
          memberCount: g.total_members,
          yourPosition: row.position,
          startDate: formatMonth(start),
          endDate: formatMonth(end),
          adminFees: estimateAdminFees(g.monthly_amount, g.total_members, g.organizer?.merchant_tier ?? null),
        });
      }

      const { data: pendingRequests } = await supabase
        .from("membership_requests")
        .select("group_id")
        .eq("user_id", userId)
        .eq("status", "pending");

      const requestedGroupIds = new Set((pendingRequests ?? []).map((r) => r.group_id));

      const { data: formingGroups } = await supabase
        .from("groups")
        .select(
          "id, name, amount, monthly_amount, total_members, state, created_at, organizer:users!organizer_id(merchant_tier)"
        )
        .eq("state", "forming");

      const rec: GroupCardData[] = [];
      for (const g of formingGroups ?? []) {
        if (joinedGroupIds.has(g.id)) continue;
        const start = new Date(g.created_at);
        const end = new Date(start);
        end.setMonth(end.getMonth() + g.total_members);

        const { data: previewPosition } = await supabase.rpc("assign_position", {
          p_group_id: g.id,
          p_user_id: userId,
        });

        rec.push({
          id: g.id,
          name: g.name,
          potAmount: g.amount,
          contribution: g.monthly_amount,
          memberCount: g.total_members,
          yourPosition: previewPosition ?? g.total_members,
          startDate: formatMonth(start),
          endDate: formatMonth(end),
          adminFees: estimateAdminFees(g.monthly_amount, g.total_members, g.organizer?.merchant_tier ?? null),
        });
      }

      if (!cancelled) {
        setMyGroups(mine);
        setMyGroupStates(states);
        setRecommended(rec);
        setRequested([...requestedGroupIds]);
      }
    }

    load(authUserId);
    return () => {
      cancelled = true;
    };
  }, [authUserId]);

  async function handleJoin(groupId: string) {
    if (!authUserId) return;
    const supabase = createClient();
    const { error } = await supabase
      .from("membership_requests")
      .insert({ group_id: groupId, user_id: authUserId, status: "pending" });
    if (!error) setRequested((prev) => [...prev, groupId]);
  }

  const list = (myGroups ?? []).filter((g) =>
    tab === "active" ? ACTIVE_STATES.includes(myGroupStates[g.id]) || myGroupStates[g.id] === "forming" : myGroupStates[g.id] === "completed"
  );

  return (
    <div className="flex flex-1 flex-col gap-5 overflow-y-auto bg-surface-muted px-4 pt-4 pb-6">
      <header className="flex items-center justify-between px-1 pb-1">
        <h1 className="text-[2.1rem] font-bold text-ink">Sik mwen yo</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/group/create/amount"
            aria-label="Kreye yon sòl"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green"
          >
            <Plus className="text-white" size={22} strokeWidth={2.5} />
          </Link>
          <Link
            href="/account"
            className="h-11 w-11 shrink-0 rounded-full bg-ink-secondary/30"
          />
        </div>
      </header>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab("active")}
          className={cn(
            "h-11 flex-1 rounded-full text-[0.95rem] font-bold transition-[color,background-color,transform] duration-150 ease-[var(--ease-out)] active:scale-[0.97]",
            tab === "active" ? "bg-green text-white" : "bg-surface text-ink"
          )}
        >
          Aktif
        </button>
        <button
          type="button"
          onClick={() => setTab("finished")}
          className={cn(
            "h-11 flex-1 rounded-full text-[0.95rem] font-bold transition-[color,background-color,transform] duration-150 ease-[var(--ease-out)] active:scale-[0.97]",
            tab === "finished" ? "bg-green text-white" : "bg-surface text-ink"
          )}
        >
          Fini
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-[1.05rem] font-bold text-ink">Sik ou yo</h2>

        {!authUserId ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <CircleEmptyIcon />
            <p className="text-[0.95rem] text-ink-secondary">Konekte pou wè sik ou yo.</p>
          </div>
        ) : myGroups === null ? (
          <p className="py-8 text-center text-[0.95rem] text-ink-secondary">Chajman...</p>
        ) : list.length > 0 ? (
          <div className="flex flex-col gap-3">
            {list.map(({ id, ...circle }, index) => (
              <Link
                key={id}
                href={myGroupStates[id] === "forming" ? `/group/forming?id=${id}` : `/group?id=${id}`}
                className="stagger-item"
                style={{ "--stagger-index": index } as CSSProperties}
              >
                <GroupCard
                  potAmount={formatHtg(circle.potAmount)}
                  contribution={formatHtg(circle.contribution)}
                  memberCount={circle.memberCount}
                  yourPosition={circle.yourPosition}
                  startDate={circle.startDate}
                  endDate={circle.endDate}
                  adminFees={formatHtg(circle.adminFees)}
                  joined
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <CircleEmptyIcon />
            <p className="text-[0.95rem] text-ink-secondary">
              {tab === "active"
                ? "Sik aktif ou yo ap parèt isit la!"
                : "Ou poko gen sik fini."}
            </p>
          </div>
        )}
      </div>

      {tab === "active" && authUserId && (recommended === null || recommended.length > 0) && (
        <div className="flex flex-col gap-3">
          <h2 className="text-[1.05rem] font-bold text-ink">Rekòmande pou ou</h2>
          <div className="flex flex-col gap-3">
            {(recommended ?? []).map(({ id, ...circle }, index) => (
              <div key={id} className="stagger-item" style={{ "--stagger-index": index } as CSSProperties}>
                <GroupCard
                  potAmount={formatHtg(circle.potAmount)}
                  contribution={formatHtg(circle.contribution)}
                  memberCount={circle.memberCount}
                  yourPosition={circle.yourPosition}
                  startDate={circle.startDate}
                  endDate={circle.endDate}
                  adminFees={formatHtg(circle.adminFees)}
                  joined={false}
                  requested={requested.includes(id)}
                  onJoin={() => handleJoin(id)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
