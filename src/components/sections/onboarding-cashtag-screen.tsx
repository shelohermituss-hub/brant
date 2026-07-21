"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2 } from "lucide-react";
import { AssetIcon } from "@/components/ui/asset-icon";
import { PillButton } from "@/components/ui/pill-button";
import { createClient } from "@/lib/supabase/client";
import { writeOnboardingDraft } from "@/lib/onboarding-store";
import { cn } from "@/lib/utils";

const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/;

type AvailabilityState = "idle" | "invalid" | "checking" | "available" | "taken" | "error";

const STATUS_TEXT: Record<AvailabilityState, string> = {
  idle: "",
  invalid: "3-20 karaktè: lèt, chif, oswa tiret ba (_)",
  checking: "Verifikasyon...",
  available: "Disponib",
  taken: "Deja pri, eseye yon lòt",
  error: "Nou pa kapab verifye kounye a",
};

const STATUS_COLOR: Record<AvailabilityState, string> = {
  idle: "text-ink-secondary",
  invalid: "text-late",
  checking: "text-ink-secondary",
  available: "text-paid",
  taken: "text-late",
  error: "text-late",
};

export function OnboardingCashtagScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [result, setResult] = useState<{
    username: string;
    status: "available" | "taken" | "error";
  } | null>(null);

  const isValidFormat = USERNAME_PATTERN.test(username);

  useEffect(() => {
    if (!username || !isValidFormat) return;

    let cancelled = false;
    const timeout = setTimeout(() => {
      createClient()
        .rpc("is_username_available", { p_username: username })
        .then(({ data, error }) => {
          if (cancelled) return;
          setResult({ username, status: error ? "error" : data ? "available" : "taken" });
        });
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [username, isValidFormat]);

  const status: AvailabilityState = !username
    ? "idle"
    : !isValidFormat
      ? "invalid"
      : result?.username === username
        ? result.status
        : "checking";

  function handleNext() {
    writeOnboardingDraft({ username });
    router.push("/onboarding/verify-identity");
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 pt-4 pb-6">
      <button
        type="button"
        onClick={() => router.push("/onboarding/zip")}
        aria-label="Retou"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-border"
      >
        <AssetIcon name="chevron-left" className="text-ink" size={18} />
      </button>

      <h1 className="pt-6 text-[1.6rem] font-bold text-ink">Chwazi yon non itilizatè</h1>
      <p className="pt-2 text-[0.95rem] text-ink-secondary">
        Non ki idantifye ou nan gwoup sòl ou yo
      </p>

      <div className="flex items-center gap-2 pt-8 text-2xl font-medium">
        <span className="text-ink">@</span>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value.trim())}
          placeholder="Non itilizatè"
          autoFocus
          className="w-full border-none bg-transparent text-ink placeholder:text-placeholder focus:outline-none"
        />
        {status === "checking" && (
          <Loader2 className="shrink-0 animate-spin text-ink-secondary" size={20} />
        )}
        {status === "available" && (
          <Check key={status} className="success-pop shrink-0 text-paid" size={20} strokeWidth={3} />
        )}
        {(status === "taken" || status === "invalid") && (
          <X key={status} className="success-pop shrink-0 text-late" size={20} strokeWidth={3} />
        )}
      </div>

      {status !== "idle" && (
        <p className={cn("pt-2 text-[0.85rem]", STATUS_COLOR[status])}>{STATUS_TEXT[status]}</p>
      )}

      <div className="mt-auto pt-6">
        <PillButton className="w-full" disabled={status !== "available"} onClick={handleNext}>
          Kontinye
        </PillButton>
      </div>
    </div>
  );
}
