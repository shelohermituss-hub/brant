import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatHtg } from "@/lib/utils";

export const dynamic = "force-dynamic";

const CONTRIBUTION_TONE: Record<string, "paid" | "wait" | "late"> = {
  paid: "paid",
  pending: "wait",
  due: "wait",
  late: "late",
  defaulted: "late",
};

const PAYOUT_TONE: Record<string, "paid" | "wait" | "late"> = {
  confirmed: "paid",
  sent: "paid",
  verified: "wait",
  pending: "wait",
  failed: "late",
};

export default async function AdminGroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const admin = createAdminClient();

  const { data: group } = await admin.from("groups").select("*").eq("id", id).maybeSingle();
  if (!group) notFound();

  const [{ data: memberships }, { data: contributions }, { data: payouts }] = await Promise.all([
    admin
      .from("memberships")
      .select("id, position, joined_at, users(full_name, phone)")
      .eq("group_id", id)
      .order("position", { ascending: true }),
    admin
      .from("contributions")
      .select("id, month, cycle_number, amount, state, moncash_ref")
      .eq("group_id", id)
      .order("month", { ascending: false })
      .limit(50),
    admin
      .from("payouts")
      .select("id, month, cycle_number, amount, state, moncash_ref, beneficiary_moncash_number")
      .eq("group_id", id)
      .order("month", { ascending: false })
      .limit(50),
  ]);

  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <Link href="/admin/groups" className="text-sm text-ink-secondary hover:underline">
          ← Gwoup / Sòl
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-ink">{group.name}</h1>
        <p className="text-sm text-ink-secondary">
          Sik {group.current_cycle} · {group.total_members} manm · {formatHtg(group.monthly_amount)}/mwa
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-bold text-ink">Manm</h2>
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-ink-secondary">
                <th className="px-4 py-3 font-medium">Pozisyon</th>
                <th className="px-4 py-3 font-medium">Non</th>
                <th className="px-4 py-3 font-medium">Telefòn</th>
              </tr>
            </thead>
            <tbody>
              {!memberships || memberships.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-ink-secondary">
                    Okenn manm.
                  </td>
                </tr>
              ) : (
                memberships.map((m) => (
                  <tr key={m.id} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3 text-ink-secondary">{m.position}</td>
                    <td className="px-4 py-3 font-bold text-ink">{m.users?.full_name ?? "—"}</td>
                    <td className="px-4 py-3 text-ink-secondary">{m.users?.phone ?? "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-bold text-ink">Kotizasyon</h2>
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-ink-secondary">
                <th className="px-4 py-3 font-medium">Sik</th>
                <th className="px-4 py-3 font-medium">Mwa</th>
                <th className="px-4 py-3 font-medium">Montan</th>
                <th className="px-4 py-3 font-medium">Eta</th>
                <th className="px-4 py-3 font-medium">Ref. MonCash</th>
              </tr>
            </thead>
            <tbody>
              {!contributions || contributions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-ink-secondary">
                    Okenn kotizasyon.
                  </td>
                </tr>
              ) : (
                contributions.map((c) => (
                  <tr key={c.id} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3 text-ink-secondary">{c.cycle_number}</td>
                    <td className="px-4 py-3 text-ink-secondary">
                      {new Date(c.month).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3 text-ink">{formatHtg(c.amount)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge label={c.state} tone={CONTRIBUTION_TONE[c.state] ?? "neutral"} />
                    </td>
                    <td className="px-4 py-3 text-ink-secondary">{c.moncash_ref ?? "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-bold text-ink">Vèsman</h2>
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-ink-secondary">
                <th className="px-4 py-3 font-medium">Sik</th>
                <th className="px-4 py-3 font-medium">Mwa</th>
                <th className="px-4 py-3 font-medium">Montan</th>
                <th className="px-4 py-3 font-medium">Eta</th>
                <th className="px-4 py-3 font-medium">MonCash benefisyè</th>
              </tr>
            </thead>
            <tbody>
              {!payouts || payouts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-ink-secondary">
                    Okenn vèsman.
                  </td>
                </tr>
              ) : (
                payouts.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3 text-ink-secondary">{p.cycle_number}</td>
                    <td className="px-4 py-3 text-ink-secondary">
                      {new Date(p.month).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3 text-ink">{formatHtg(p.amount)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge label={p.state} tone={PAYOUT_TONE[p.state] ?? "neutral"} />
                    </td>
                    <td className="px-4 py-3 text-ink-secondary">{p.beneficiary_moncash_number}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
