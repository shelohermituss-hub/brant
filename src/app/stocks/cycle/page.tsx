import { CycleDetailScreen } from "@/components/sections/cycle-detail-screen";
import { BottomTabBar } from "@/components/layout/bottom-tab-bar";

interface PageProps {
  searchParams: Promise<{ groupId?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { groupId } = await searchParams;

  return (
    <>
      <CycleDetailScreen groupId={groupId} />
      <BottomTabBar />
    </>
  );
}
