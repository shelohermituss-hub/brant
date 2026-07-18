import { WalletTransferSuccessScreen } from "@/components/sections/wallet-transfer-success-screen";

interface PageProps {
  searchParams: Promise<{ amount?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { amount } = await searchParams;
  const parsed = Number(amount);

  return <WalletTransferSuccessScreen amount={Number.isFinite(parsed) ? parsed : 0} />;
}
