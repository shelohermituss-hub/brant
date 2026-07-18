import Link from "next/link";
import { Wallet, Smartphone } from "lucide-react";
import { AssetIcon } from "@/components/ui/asset-icon";
import { formatHtg } from "@/lib/utils";

interface ConnectedAccountsCardProps {
  walletBalance: number | null;
  moncashNumber: string | null;
  walletHref?: string;
  moncashHref?: string;
}

export function ConnectedAccountsCard({
  walletBalance,
  moncashNumber,
  walletHref,
  moncashHref,
}: ConnectedAccountsCardProps) {
  const walletRow = (
    <div className="flex items-center gap-4 border-b border-border px-5 py-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green">
        <Wallet className="text-white" size={20} />
      </span>
      <div className="flex flex-1 flex-col">
        <span className="text-[0.95rem] font-bold text-ink">Wallet Sòlid</span>
        <span className="text-sm text-ink-secondary">Balans entèn</span>
      </div>
      <span className="text-[0.95rem] font-bold text-ink">
        {walletBalance === null ? "—" : formatHtg(walletBalance)}
      </span>
      {walletHref && <AssetIcon name="chevron-right" className="text-ink-secondary" size={16} />}
    </div>
  );

  const moncashRow = (
    <div className="flex items-center gap-4 px-5 py-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue">
        <Smartphone className="text-white" size={20} />
      </span>
      <div className="flex flex-1 flex-col">
        <span className="text-[0.95rem] font-bold text-ink">MonCash</span>
        <span className="text-sm text-ink-secondary">
          {moncashNumber ? `${moncashNumber} — konekte` : "Pa konekte"}
        </span>
      </div>
      <AssetIcon name="chevron-right" className="text-ink-secondary" size={16} />
    </div>
  );

  return (
    <div className="mx-4 mb-6 flex flex-col rounded-lg bg-surface">
      {walletHref ? <Link href={walletHref}>{walletRow}</Link> : walletRow}
      {moncashHref ? <Link href={moncashHref}>{moncashRow}</Link> : moncashRow}
    </div>
  );
}
