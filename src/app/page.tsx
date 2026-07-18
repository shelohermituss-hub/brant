import { HomeScreen } from "@/components/sections/home-screen";
import { BottomTabBar } from "@/components/layout/bottom-tab-bar";

interface HomePageProps {
  searchParams: Promise<{ state?: string }>;
}

export default async function Page({ searchParams }: HomePageProps) {
  const { state } = await searchParams;

  return (
    <>
      <HomeScreen variant={state === "empty" ? "empty" : "populated"} />
      <BottomTabBar />
    </>
  );
}
