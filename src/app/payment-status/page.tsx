import { PaymentStatusScreen, type PaymentStatus } from "@/components/sections/payment-status-screen";

interface PageProps {
  searchParams: Promise<{ state?: string; contributionId?: string }>;
}

const VALID_STATUSES: PaymentStatus[] = ["paid", "wait", "late"];

export default async function Page({ searchParams }: PageProps) {
  const { state, contributionId } = await searchParams;
  const status = VALID_STATUSES.includes(state as PaymentStatus)
    ? (state as PaymentStatus)
    : "wait";

  return <PaymentStatusScreen status={status} contributionId={contributionId} />;
}
