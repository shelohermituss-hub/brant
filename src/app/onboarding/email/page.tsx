import { OnboardingEmailScreen } from "@/components/sections/onboarding-email-screen";

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { error } = await searchParams;

  return <OnboardingEmailScreen linkError={error === "link"} />;
}
