"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Wallet } from "lucide-react";
import { AssetIcon } from "@/components/ui/asset-icon";
import { SurfaceCard } from "@/components/ui/surface-card";
import { PillButton } from "@/components/ui/pill-button";
import { useCurrentAppUser } from "@/lib/use-current-app-user";
import { createClient } from "@/lib/supabase/client";
import { cn, formatHtg } from "@/lib/utils";

const TYPE_LABELS: Record<string, string> = {
  deposit: "Depo",
  withdrawal: "Retrè",
  transfer_to_moncash: "Voye nan MonCash",
  contribution_payment: "Kotizasyon",
  payout_received: "Vèsman resevwa",
};

interface WalletTxnRow {
  id: string;
  type: string;
  amount: number;
  created_at: string;
}

export function WalletDetailScreen() {
  const router = useRouter();
  const { loading, authUserId, profile } = useCurrentAppUser();
  const [transactions, setTransactions] = useState<WalletTxnRow[] | null>(null);

  const walletId = profile?.wallets?.id ?? null;
  const balance = profile?.wallets?.balance ?? null;

  useEffect(() => {
    if (!walletId) return;
    let cancelled = false;
    const supabase = createClient();

    supabase
      .from("wallet_transactions")
      .select("id, type, amount, created_at")
      .eq("wallet_id", walletId)
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (!cancelled) setTransactions(data ?? []);
      });

    return () => {
      cancelled = true;
    };
  }, [walletId]);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-surface-muted">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button type="button" onClick={() => router.push("/payment-hub")} aria-label="Retou">
          <AssetIcon name="chevron-left" className="text-ink" size={22} />
        </button>
        <span className="text-lg font-bold text-ink">Wallet Sòlid</span>
        <span className="w-[22px]" />
      </div>

      <div className="px-4 pt-4 pb-2">
        <SurfaceCard className="flex flex-col items-center gap-1 py-6 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-green">
            <Wallet className="text-white" size={20} />
          </span>
          <span className="pt-2 text-[0.95rem] text-ink-secondary">Balans entèn</span>
          <span className="text-[2.1rem] font-bold text-ink">
            {loading ? "…" : formatHtg(balance ?? 0)}
          </span>
        </SurfaceCard>
      </div>

      <div className="px-4 pt-2 pb-4">
        <PillButton
          variant="primary"
          className="w-full"
          disabled={!authUserId || !balance}
          onClick={() => router.push("/payment-hub/wallet/transfer")}
        >
          Voye nan MonCash
        </PillButton>
      </div>

      <div className="px-5 pb-2">
        <span className="text-xs font-semibold tracking-wide text-ink-secondary">
          TRANZAKSYON
        </span>
      </div>

      <div className="mx-4 mb-6 flex flex-col rounded-lg bg-surface">
        {!authUserId ? (
          <p className="px-5 py-6 text-center text-[0.9rem] text-ink-secondary">
            Konekte pou wè tranzaksyon wallet ou.
          </p>
        ) : transactions === null ? (
          <p className="px-5 py-6 text-center text-[0.9rem] text-ink-secondary">Chajman...</p>
        ) : transactions.length === 0 ? (
          <p className="px-5 py-6 text-center text-[0.9rem] text-ink-secondary">
            Ou poko gen okenn tranzaksyon.
          </p>
        ) : (
          transactions.map((txn) => (
            <div
              key={txn.id}
              className="flex items-center justify-between border-b border-border px-5 py-4 last:border-b-0"
            >
              <div className="flex flex-col">
                <span className="text-[0.95rem] font-bold text-ink">
                  {TYPE_LABELS[txn.type] ?? txn.type}
                </span>
                <span className="text-sm text-ink-secondary">
                  {new Date(txn.created_at).toLocaleDateString("fr-FR")}
                </span>
              </div>
              <span className={cn("text-[0.95rem] font-bold", txn.amount < 0 ? "text-late" : "text-paid")}>
                {txn.amount > 0 ? "+" : ""}
                {formatHtg(txn.amount)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
