import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { StatusBadge } from "@/components/admin/status-badge";

export const dynamic = "force-dynamic";
import { formatHtg } from "@/lib/utils";

const GROUP_STATE_LABEL: Record<string, string> = {
  forming: "K ap fòme",
  active: "Aktif",
  collecting: "K ap kolekte",
  pot_ready: "Pot pare",
  pot_sent: "Pot voye",
  next_month: "Mwa pwochen",
  completed: "Konplete",
};

export default async function AdminGroupsPage() {
  const admin = createAdminClient();
  const { data: groups } = await admin
    .from("groups")
    .select("id, name, state, current_cycle, total_members, monthly_amount")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="flex flex-col gap-6 p-8">
      <h1 className="text-2xl font-bold text-ink">Gwoup / Sòl</h1>

      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-ink-secondary">
              <th className="px-4 py-3 font-medium">Non</th>
              <th className="px-4 py-3 font-medium">Eta</th>
              <th className="px-4 py-3 font-medium">Sik</th>
              <th className="px-4 py-3 font-medium">Manm</th>
              <th className="px-4 py-3 font-medium">Kotizasyon</th>
            </tr>
          </thead>
          <tbody>
            {!groups || groups.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-ink-secondary">
                  Okenn gwoup.
                </td>
              </tr>
            ) : (
              groups.map((group) => (
                <tr key={group.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 font-bold text-ink">
                    <Link href={`/admin/groups/${group.id}`} className="hover:underline">
                      {group.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge label={GROUP_STATE_LABEL[group.state] ?? group.state} tone="neutral" />
                  </td>
                  <td className="px-4 py-3 text-ink-secondary">{group.current_cycle}</td>
                  <td className="px-4 py-3 text-ink-secondary">{group.total_members}</td>
                  <td className="px-4 py-3 text-ink">{formatHtg(group.monthly_amount)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
