"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export function OnboardingSplashScreen() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push("/onboarding/email")}
      className="flex flex-1 items-center justify-center bg-green-deep"
      aria-label="Continuer"
    >
      <Image
        src="/logos/cash-app-logo@2x.png"
        alt="Cash App"
        width={96}
        height={96}
        priority
      />
    </button>
  );
}
