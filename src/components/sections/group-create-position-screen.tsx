"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { PillButton } from "@/components/ui/pill-button";
import { AssetIcon } from "@/components/ui/asset-icon";
import { StepProgressBar } from "@/components/ui/step-progress-bar";
import { useCurrentAppUser } from "@/lib/use-current-app-user";
import { createClient } from "@/lib/supabase/client";
import { readGroupCreateDraft } from "@/lib/group-create-store";
import { MIN_MEMBERS, MAX_MEMBERS } from "@/components/sections/group-create-members-screen";

interface PositionPolicy {
  min_score_for_any_position: number;
  min_score_for_20th_percentile: number;
  min_score_for_50th_percentile: number;
}

function minPositionFor(score: number, totalMembers: number, policy: PositionPolicy) {
  if (score >= policy.min_score_for_any_position) return 1;
  if (score >= policy.min_score_for_20th_percentile) return Math.max(1, Math.ceil(totalMembers * 0.2));
  if (score >= policy.min_score_for_50th_percentile) return Math.max(1, Math.ceil(totalMembers * 0.5));
  return Math.max(1, Math.floor(totalMembers * 0.8) + 1);
}

export function GroupCreatePositionScreen() {
  const router = useRouter();
  const { profile } = useCurrentAppUser();
  const [policy, setPolicy] = useState<PositionPolicy | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("position_assignment_policy")
      .select("min_score_for_any_position, min_score_for_20th_percentile, min_score_for_50th_percentile")
      .maybeSingle()
      .then(({ data }) => setPolicy(data));
  }, []);

  useEffect(() => {
    if (!readGroupCreateDraft().durationMonths) router.replace("/group/create/amount");
  }, [router]);

  const score = profile?.trust_score ?? 0;
  const minAtSmallest = policy ? minPositionFor(score, MIN_MEMBERS, policy) : null;
  const minAtLargest = policy ? minPositionFor(score, MAX_MEMBERS, policy) : null;

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 pt-4 pb-6">
      <button
        type="button"
        onClick={() => router.push("/group/create/duration")}
        aria-label="Retour"
      >
        <AssetIcon name="chevron-left" className="text-ink" size={22} />
      </button>

      <div className="pt-6">
        <StepProgressBar step={3} total={5} label="Pozisyon ou" />
      </div>

      <h1 className="pt-6 text-[1.6rem] leading-tight font-bold text-ink">
        Zòn pozisyon ou
      </h1>
      <p className="pt-2 text-[0.95rem] text-ink-secondary">
        Kredi/Skò ou detèmine ki kreno ki disponib — pa yon chwa lib. Pozisyon final
        la konfime lè ou fin envite manm yo, paske li depann de kantite manm final.
      </p>

      <div className="flex flex-col gap-3 pt-6 rounded-lg border border-green bg-green/5 p-4">
        <span className="text-[0.95rem] font-bold text-ink">
          {minAtSmallest === null
            ? "Kalkil..."
            : minAtSmallest === minAtLargest
              ? `Ou aksesib apati pozisyon ${minAtSmallest}`
              : `Ou aksesib apati pozisyon ${minAtSmallest} a ${minAtLargest}`}
        </span>
        <span className="text-sm text-ink-secondary">
          Selon kantite manm final gwoup la (5 a 25 manm)
        </span>
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-lg bg-surface-muted px-4 py-3">
        <ShieldCheck className="text-ink" size={20} />
        <span className="text-[0.85rem] text-ink-secondary">
          Skò fyabilite aktyèl ou : <span className="font-bold text-ink">{score}/100</span>
        </span>
      </div>

      <div className="mt-auto pt-6">
        <PillButton className="w-full" onClick={() => router.push("/group/create/members")}>
          Next
        </PillButton>
      </div>
    </div>
  );
}
