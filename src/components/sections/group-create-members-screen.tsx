"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Plus } from "lucide-react";
import { AssetIcon } from "@/components/ui/asset-icon";
import { StepProgressBar } from "@/components/ui/step-progress-bar";
import { PillButton } from "@/components/ui/pill-button";
import { cn } from "@/lib/utils";

export const MIN_MEMBERS = 5;
export const MAX_MEMBERS = 25;

interface Contact {
  id: string;
  name: string;
  phone: string;
  initial: string;
  color: string;
}

const CONTACTS: Contact[] = [
  { id: "marie", name: "Marie L.", phone: "3711 2345", initial: "M", color: "var(--color-purple)" },
  { id: "peterson", name: "Peterson J.", phone: "3722 3456", initial: "P", color: "var(--color-blue)" },
  { id: "sandy", name: "Sandy G.", phone: "3733 4567", initial: "S", color: "var(--color-orange)" },
  { id: "diego", name: "Diego M.", phone: "3744 5678", initial: "D", color: "var(--color-cyan)" },
  { id: "fabiola", name: "Fabiola R.", phone: "3755 6789", initial: "F", color: "var(--color-green-deep)" },
  { id: "junior", name: "Junior P.", phone: "3766 7890", initial: "J", color: "var(--color-purple)" },
  { id: "nadege", name: "Nadège C.", phone: "3777 8901", initial: "N", color: "var(--color-blue)" },
];

export function GroupCreateMembersScreen() {
  const router = useRouter();
  const [invited, setInvited] = useState<string[]>(["marie", "peterson", "sandy"]);

  const toggle = (id: string) => {
    setInvited((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const count = invited.length;
  const withinBounds = count >= MIN_MEMBERS && count <= MAX_MEMBERS;

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-5 pt-4 pb-6">
      <button
        type="button"
        onClick={() => router.push("/group/create/position")}
        aria-label="Retour"
      >
        <AssetIcon name="chevron-left" className="text-ink" size={22} />
      </button>

      <div className="pt-6">
        <StepProgressBar step={4} total={5} label="Envite manm" />
      </div>

      <h1 className="pt-6 text-[1.6rem] leading-tight font-bold text-ink">
        Envite manm
      </h1>
      <p className="pt-2 text-[0.95rem] text-ink-secondary">
        Minimòm {MIN_MEMBERS}, maksimòm {MAX_MEMBERS} manm
      </p>

      <div className="flex flex-col pt-4">
        {CONTACTS.map((contact) => {
          const isInvited = invited.includes(contact.id);
          return (
            <div
              key={contact.id}
              className="flex items-center gap-3 border-b border-border py-3 last:border-b-0"
            >
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-bold text-white"
                style={{ backgroundColor: contact.color }}
              >
                {contact.initial}
              </span>
              <div className="flex flex-1 flex-col">
                <span className="text-[0.95rem] font-bold text-ink">{contact.name}</span>
                <span className="text-sm text-ink-secondary">{contact.phone}</span>
              </div>
              <button
                type="button"
                onClick={() => toggle(contact.id)}
                className={cn(
                  "flex h-9 items-center gap-1 rounded-full px-4 text-[0.85rem] font-bold",
                  isInvited ? "bg-green/10 text-green" : "bg-green text-white"
                )}
              >
                {isInvited ? (
                  <>
                    <Check size={14} strokeWidth={3} /> Envite
                  </>
                ) : (
                  <>
                    <Plus size={14} strokeWidth={3} /> Envite
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-lg bg-surface-muted px-4 py-3">
        <span className="text-[0.9rem] text-ink-secondary">Manm envite</span>
        <span
          className={cn(
            "text-[0.95rem] font-bold",
            withinBounds ? "text-ink" : "text-late"
          )}
        >
          {count} / {MIN_MEMBERS}-{MAX_MEMBERS}
        </span>
      </div>

      <div className="mt-auto pt-6">
        <PillButton
          className="w-full"
          disabled={!withinBounds}
          onClick={() => router.push("/group/create/review")}
        >
          Next
        </PillButton>
      </div>
    </div>
  );
}
