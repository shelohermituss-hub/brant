import { CardScreen } from "@/components/sections/card-screen";
import { BottomTabBar } from "@/components/layout/bottom-tab-bar";

interface CardPageProps {
  searchParams: Promise<{ state?: string }>;
}

export default async function Page({ searchParams }: CardPageProps) {
  const { state } = await searchParams;

  return (
    <>
      <CardScreen variant={state === "empty" ? "empty" : "populated"} />
      <BottomTabBar />
    </>
  );
}
