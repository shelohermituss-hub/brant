import { CyclePaymentAmountScreen } from "@/components/sections/cycle-payment-amount-screen";

interface PageProps {
  searchParams: Promise<{ groupId?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { groupId } = await searchParams;
  return <CyclePaymentAmountScreen groupId={groupId} />;
}
