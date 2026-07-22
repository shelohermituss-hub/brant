import { createAdminClient } from "@/lib/supabase/admin";
import { TransactionsSearch } from "@/components/admin/transactions-search";
import { formatHtg } from "@/lib/utils";

export const dynamic = "force-dynamic";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-bold text-ink">{title}</h2>
      <div className="overflow-hidden rounded-lg border border-border bg-surface">{children}</div>
    </section>
  );
}

function EmptyRow({ colSpan, label }: { colSpan: number; label: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-6 text-center text-sm text-ink-secondary">
        {label}
      </td>
    </tr>
  );
}

export default async function AdminTransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const cleanRef = ref?.replace(/[,()]/g, "").trim();
  const admin = createAdminClient();

  if (!cleanRef) {
    const { data: transactions } = await admin
      .from("wallet_transactions")
      .select("id, type, amount, balance_after, reference, created_at, wallets(users(full_name))")
      .order("created_at", { ascending: false })
      .limit(50);

    return (
      <div className="flex flex-col gap-6 p-8">
        <h1 className="text-2xl font-bold text-ink">Tranzaksyon</h1>
        <TransactionsSearch initialRef="" />
        <Section title="Dènye tranzaksyon wallet">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-ink-secondary">
                <th className="px-4 py-3 font-medium">Dat</th>
                <th className="px-4 py-3 font-medium">Itilizatè</th>
                <th className="px-4 py-3 font-medium">Kalite</th>
                <th className="px-4 py-3 font-medium">Montan</th>
                <th className="px-4 py-3 font-medium">Balans apre</th>
                <th className="px-4 py-3 font-medium">Referans</th>
              </tr>
            </thead>
            <tbody>
              {!transactions || transactions.length === 0 ? (
                <EmptyRow colSpan={6} label="Okenn tranzaksyon." />
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3 text-ink-secondary">
                      {new Date(tx.created_at).toLocaleString("fr-FR")}
                    </td>
                    <td className="px-4 py-3 font-bold text-ink">
                      {tx.wallets?.users?.full_name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-ink-secondary">{tx.type}</td>
                    <td className="px-4 py-3 text-ink">{formatHtg(tx.amount)}</td>
                    <td className="px-4 py-3 text-ink-secondary">{formatHtg(tx.balance_after)}</td>
                    <td className="px-4 py-3 text-ink-secondary">{tx.reference ?? "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Section>
      </div>
    );
  }

  const [{ data: transactions }, { data: contributions }, { data: payouts }, { data: webhooks }] =
    await Promise.all([
      admin
        .from("wallet_transactions")
        .select("id, type, amount, balance_after, reference, created_at, wallets(users(full_name))")
        .ilike("reference", `%${cleanRef}%`)
        .limit(20),
      admin
        .from("contributions")
        .select("id, amount, state, moncash_ref, month")
        .eq("moncash_ref", cleanRef)
        .limit(20),
      admin
        .from("payouts")
        .select("id, amount, state, moncash_ref, month")
        .eq("moncash_ref", cleanRef)
        .limit(20),
      admin
        .from("webhook_events")
        .select("id, idempotency_key, processed, created_at")
        .ilike("idempotency_key", `%${cleanRef}%`)
        .limit(20),
    ]);

  return (
    <div className="flex flex-col gap-6 p-8">
      <h1 className="text-2xl font-bold text-ink">Tranzaksyon</h1>
      <TransactionsSearch initialRef={cleanRef} />

      <Section title="Tranzaksyon wallet">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-ink-secondary">
              <th className="px-4 py-3 font-medium">Dat</th>
              <th className="px-4 py-3 font-medium">Itilizatè</th>
              <th className="px-4 py-3 font-medium">Kalite</th>
              <th className="px-4 py-3 font-medium">Montan</th>
              <th className="px-4 py-3 font-medium">Referans</th>
            </tr>
          </thead>
          <tbody>
            {!transactions || transactions.length === 0 ? (
              <EmptyRow colSpan={5} label="Okenn rezilta." />
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 text-ink-secondary">
                    {new Date(tx.created_at).toLocaleString("fr-FR")}
                  </td>
                  <td className="px-4 py-3 font-bold text-ink">{tx.wallets?.users?.full_name ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-secondary">{tx.type}</td>
                  <td className="px-4 py-3 text-ink">{formatHtg(tx.amount)}</td>
                  <td className="px-4 py-3 text-ink-secondary">{tx.reference ?? "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Section>

      <Section title="Kotizasyon">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-ink-secondary">
              <th className="px-4 py-3 font-medium">Mwa</th>
              <th className="px-4 py-3 font-medium">Montan</th>
              <th className="px-4 py-3 font-medium">Eta</th>
            </tr>
          </thead>
          <tbody>
            {!contributions || contributions.length === 0 ? (
              <EmptyRow colSpan={3} label="Okenn rezilta." />
            ) : (
              contributions.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 text-ink-secondary">
                    {new Date(c.month).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3 text-ink">{formatHtg(c.amount)}</td>
                  <td className="px-4 py-3 text-ink-secondary">{c.state}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Section>

      <Section title="Vèsman">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-ink-secondary">
              <th className="px-4 py-3 font-medium">Mwa</th>
              <th className="px-4 py-3 font-medium">Montan</th>
              <th className="px-4 py-3 font-medium">Eta</th>
            </tr>
          </thead>
          <tbody>
            {!payouts || payouts.length === 0 ? (
              <EmptyRow colSpan={3} label="Okenn rezilta." />
            ) : (
              payouts.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 text-ink-secondary">
                    {new Date(p.month).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3 text-ink">{formatHtg(p.amount)}</td>
                  <td className="px-4 py-3 text-ink-secondary">{p.state}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Section>

      <Section title="Evènman webhook MonCash">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-ink-secondary">
              <th className="px-4 py-3 font-medium">Dat</th>
              <th className="px-4 py-3 font-medium">Kle idanpotans</th>
              <th className="px-4 py-3 font-medium">Trete</th>
            </tr>
          </thead>
          <tbody>
            {!webhooks || webhooks.length === 0 ? (
              <EmptyRow colSpan={3} label="Okenn rezilta." />
            ) : (
              webhooks.map((w) => (
                <tr key={w.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 text-ink-secondary">
                    {new Date(w.created_at).toLocaleString("fr-FR")}
                  </td>
                  <td className="px-4 py-3 text-ink-secondary">{w.idempotency_key}</td>
                  <td className="px-4 py-3 text-ink-secondary">{w.processed ? "Wi" : "Non"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Section>
    </div>
  );
}
