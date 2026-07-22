"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";
import { createClient } from "@/lib/supabase/client";
import { clearOnboardingDraft, readOnboardingDraft } from "@/lib/onboarding-store";
import type { TablesInsert } from "@/lib/supabase/database.types";

export function OnboardingVerifyIdentityScreen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleContinue() {
    setIsSubmitting(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setIsSubmitting(false);
      router.replace("/onboarding/signin");
      return;
    }

    const draft = readOnboardingDraft();
    const { error: insertError } = await supabase.from("users").upsert(
      {
        id: user.id,
        full_name: draft.fullName ?? "",
        phone: draft.phone ?? "",
        moncash_number: draft.phone ?? "",
        username: draft.username ?? null,
        consent_signed_at: new Date().toISOString(),
        // referral_code est généré par le trigger BEFORE INSERT
        // generate_referral_code_for_new_user tant qu'il est absent/null —
        // le type généré ne voit pas les triggers, d'où le cast.
      } as unknown as TablesInsert<"users">,
      { onConflict: "id" }
    );

    setIsSubmitting(false);

    if (insertError) {
      if (insertError.code === "23505" && insertError.message.includes("users_username")) {
        setError("Non itilizatè a fèk pran. Tounen chwazi yon lòt.");
      } else if (
        insertError.code === "23505" &&
        insertError.message.includes("users_moncash_number")
      ) {
        setError(
          "Nimewo MonCash sa a deja itilize pa yon lòt kont. Si se kont ou, konekte avè l pito."
        );
      } else {
        setError("Nou pa kapab kreye kont ou. Tanpri eseye ankò.");
      }
      return;
    }

    clearOnboardingDraft();
    router.push("/home");
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 pt-4 pb-6">
      <span className="mt-6 flex h-14 w-14 items-center justify-center rounded-md bg-green">
        <Shield className="text-ink" size={26} />
      </span>

      <h1 className="pt-6 text-[1.6rem] leading-tight font-bold text-ink">
        Verifye idantite ou ak yon foto ID ou pou kontinye
      </h1>

      <p className="pt-4 text-[0.95rem] text-ink-secondary">
        Tout foto kripte pou enfòmasyon ou rete prive.
      </p>

      {error && <p className="pt-3 text-[0.85rem] text-late">{error}</p>}

      <div className="mt-auto flex flex-col gap-6">
        <p className="text-center text-[0.85rem] text-ink-secondary">
          Lè ou peze &quot;Kontinye&quot;, ou dakò ak{" "}
          <span className="text-green-deep">règleman konfidansyalite yo</span>.
        </p>

        <PillButton
          className="w-full"
          disabled={isSubmitting}
          onClick={handleContinue}
        >
          {isSubmitting ? "Kreyasyon kont..." : "Kontinye"}
        </PillButton>
      </div>
    </div>
  );
}
