import { GroupDetailScreen } from "@/components/sections/group-detail-screen";
import { BottomTabBar } from "@/components/layout/bottom-tab-bar";

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { id } = await searchParams;

  return (
    <>
      <GroupDetailScreen groupId={id} />
      <BottomTabBar />
    </>
  );
}
