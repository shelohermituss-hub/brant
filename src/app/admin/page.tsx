import { createAdminClient } from "@/lib/supabase/admin";
import { formatHtg } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface StatCardProps {
  label: string;
  value: string | number;
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <span className="text-sm text-ink-secondary">{label}</span>
      <p className="mt-1 text-2xl font-bold text-ink">{value}</p>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const admin = createAdminClient();

  const [{ count: pendingKyc }, { count: activeGroups }, { data: recentTransactions }] =
    await Promise.all([
      admin.from("users").select("id", { count: "exact", head: true }).eq("kyc_status", "pending"),
      admin
        .from("groups")
        .select("id", { count: "exact", head: true })
        .in("state", ["active", "collecting", "pot_ready"]),
      admin
        .from("wallet_transactions")
        .select("id, type, amount, created_at")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  return (
    <div className="flex flex-col gap-6 p-8">
      <h1 className="text-2xl font-bold text-ink">Tablo bò</h1>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="KYC an atant" value={pendingKyc ?? 0} />
        <StatCard label="Gwoup aktif" value={activeGroups ?? 0} />
        <StatCard label="Tranzaksyon total" value={recentTransactions?.length ?? 0} />
      </div>

      <div className="rounded-lg border border-border bg-surface">
        <div className="border-b border-border px-5 py-3">
          <span className="text-sm font-bold text-ink">Dènye tranzaksyon</span>
        </div>
        {!recentTransactions || recentTransactions.length === 0 ? (
          <p className="px-5 py-6 text-sm text-ink-secondary">Okenn tranzaksyon.</p>
        ) : (
          <div className="flex flex-col">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between border-b border-border px-5 py-3 text-sm last:border-b-0"
              >
                <span className="text-ink">{tx.type}</span>
                <span className="font-bold text-ink">{formatHtg(tx.amount)}</span>
                <span className="text-ink-secondary">
                  {new Date(tx.created_at).toLocaleDateString("fr-FR")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
