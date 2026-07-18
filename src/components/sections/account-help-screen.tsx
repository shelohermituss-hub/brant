"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, X, FileText } from "lucide-react";
import { SettingsListRow } from "@/components/ui/settings-list-row";

const ARTICLES = [
  "Can't Access Old Account",
  "Security & Privacy",
  "View Your Limits",
  "Provide Requested Documentation",
  "Sponsored Accounts",
  "$Cashtags",
  "Cash for Business",
  "Loyalty Points and Rewards",
  "FDIC Insurance",
];

export function AccountHelpScreen() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-surface-muted">
      <div className="flex items-center justify-between px-5 pt-4">
        <button type="button" onClick={() => router.push("/account")} aria-label="Retour">
          <ChevronLeft className="text-ink" size={26} />
        </button>
        <button type="button" onClick={() => router.push("/")} aria-label="Fermer">
          <X className="text-ink" size={24} />
        </button>
      </div>

      <div className="flex flex-col gap-3 px-5 pt-4 pb-6">
        <h1 className="text-[1.9rem] leading-tight font-bold text-ink">
          Account &amp; Settings
        </h1>
        <p className="text-[0.95rem] text-ink-secondary">
          Learn how to manage your info, profile, and security settings.
        </p>
      </div>

      <div className="mx-4 mb-8 flex flex-col rounded-lg bg-surface">
        {ARTICLES.map((label) => (
          <SettingsListRow
            key={label}
            icon={FileText}
            label={label}
            iconStyle="badge"
            showChevron={false}
          />
        ))}
      </div>
    </div>
  );
}
