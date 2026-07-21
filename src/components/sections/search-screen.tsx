"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { Search } from "lucide-react";
import { GroupCard } from "@/components/ui/group-card";
import { ListSkeleton } from "@/components/ui/list-skeleton";
import { useCurrentAppUser } from "@/lib/use-current-app-user";
import { createClient } from "@/lib/supabase/client";

interface GroupResult {
  id: string;
  name: string;
  potAmount: number;
  contribution: number;
  memberCount: number;
  yourPosition: number;
}

function formatHtg(n: number) {
  return `${n.toLocaleString("fr-FR")} HTG`;
}

export function SearchScreen() {
  const { authUserId, profile } = useCurrentAppUser();
  const [query, setQuery] = useState("");
  const [groups, setGroups] = useState<GroupResult[] | null>(null);
  const [requested, setRequested] = useState<string[]>([]);

  useEffect(() => {
    if (!authUserId) return;
    let cancelled = false;
    const supabase = createClient();

    async function load(userId: string) {
      const { data: memberships } = await supabase
        .from("memberships")
        .select("group_id")
        .eq("user_id", userId);
      const joinedGroupIds = new Set((memberships ?? []).map((m) => m.group_id));

      const { data: pendingRequests } = await supabase
        .from("membership_requests")
        .select("group_id")
        .eq("user_id", userId)
        .eq("status", "pending");

      const { data: formingGroups } = await supabase
        .from("groups")
        .select("id, name, amount, monthly_amount, total_members")
        .eq("state", "forming");

      if (cancelled) return;

      setRequested((pendingRequests ?? []).map((r) => r.group_id));
      setGroups(
        (formingGroups ?? [])
          .filter((g) => !joinedGroupIds.has(g.id))
          .map((g) => ({
            id: g.id,
            name: g.name,
            potAmount: g.amount,
            contribution: g.monthly_amount,
            memberCount: g.total_members,
            yourPosition: g.total_members,
          }))
      );
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

  const results =
    groups?.filter((g) => g.name.toLowerCase().includes(query.trim().toLowerCase())) ?? null;

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-surface-muted px-4 pt-4 pb-6">
      <h1 className="pb-3 text-[2.1rem] font-bold text-ink">Chèche</h1>

      <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-3">
        <Search className="shrink-0 text-ink-secondary" size={18} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Chèche yon sòl pa non"
          className="w-full border-none bg-transparent text-[0.95rem] text-ink placeholder:text-placeholder focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-3 pt-5">
        {!authUserId ? (
          <p className="py-8 text-center text-[0.95rem] text-ink-secondary">
            Konekte pou chèche yon sòl.
          </p>
        ) : groups === null ? (
          <ListSkeleton rows={3} />
        ) : results === null || results.length === 0 ? (
          <p className="py-8 text-center text-[0.95rem] text-ink-secondary">
            {query.trim()
              ? "Nou pa jwenn okenn sòl ak non sa a."
              : "Pa gen sòl an fòmasyon pou rejwenn kounye a."}
          </p>
        ) : (
          results.map((group, index) => (
            <div key={group.id} className="stagger-item" style={{ "--stagger-index": index } as CSSProperties}>
              <p className="pb-2 text-[1.05rem] font-bold text-ink">{group.name}</p>
              <GroupCard
                potAmount={formatHtg(group.potAmount)}
                contribution={formatHtg(group.contribution)}
                memberCount={group.memberCount}
                yourPosition={group.yourPosition}
                startDate=""
                endDate=""
                adminFees="—"
                yourAvatarUrl={profile?.avatar_url ?? null}
                joined={false}
                requested={requested.includes(group.id)}
                onJoin={() => handleJoin(group.id)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
