import { CyclePaymentReviewScreen } from "@/components/sections/cycle-payment-review-screen";

interface PageProps {
  searchParams: Promise<{ groupId?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { groupId } = await searchParams;
  return <CyclePaymentReviewScreen groupId={groupId} />;
}
