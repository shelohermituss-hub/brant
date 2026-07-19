"use client";

import { useRouter } from "next/navigation";

export function OnboardingSplashScreen() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push("/onboarding/signup")}
      className="flex flex-1 items-center justify-center bg-green-deep"
      aria-label="Continuer"
    >
      <span className="text-[2.5rem] font-bold text-white">Sòlid</span>
    </button>
  );
}
