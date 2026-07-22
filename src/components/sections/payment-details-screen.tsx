"use client";

import { useRouter } from "next/navigation";
import { useCurrentAppUser } from "@/lib/use-current-app-user";

export function PaymentDetailsScreen() {
  const router = useRouter();
  const { loading, authUserId, profile } = useCurrentAppUser();

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <button
          type="button"
          onClick={() => router.push("/payment-hub")}
          aria-label="Fermer"
          className="text-2xl text-ink"
        >
          ×
        </button>
        <span className="text-lg font-bold text-ink">Metòd peman</span>
        <span className="w-6" />
      </div>

      <p className="px-5 pb-4 text-[0.95rem] text-ink-secondary">
        MonCash se sèl metòd peman disponib pou kounye a.
      </p>

      {!loading && !authUserId ? (
        <p className="px-5 py-6 text-center text-[0.9rem] text-ink-secondary">
          Konekte pou wè metòd peman ou.
        </p>
      ) : !profile?.moncash_number ? (
        <p className="px-5 py-6 text-center text-[0.9rem] text-ink-secondary">
          Ou pa gen nimewo MonCash konekte.
        </p>
      ) : (
        <div className="flex items-center gap-3 border-t border-b border-border px-5 py-4">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-green bg-green text-ink">
            <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
              <path
                d="M1 4.5L4.2 7.5L11 1"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green text-base font-bold text-ink">
            M
          </span>

          <span className="flex flex-1 flex-col">
            <span className="text-[0.95rem] font-bold text-ink">MonCash</span>
            <span className="text-sm text-ink-secondary">{profile.moncash_number}</span>
          </span>
        </div>
      )}
    </div>
  );
}
