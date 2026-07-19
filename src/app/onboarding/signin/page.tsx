import { OnboardingSigninScreen } from "@/components/sections/onboarding-signin-screen";

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { error } = await searchParams;

  return <OnboardingSigninScreen linkError={error === "link"} />;
}
