import { GroupFormingScreen } from "@/components/sections/group-forming-screen";

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { id } = await searchParams;

  return <GroupFormingScreen groupId={id} />;
}
