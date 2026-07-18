"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, User } from "lucide-react";
import { Chip } from "@/components/ui/chip";
import { cn } from "@/lib/utils";

interface Contact {
  id: string;
  name: string;
  cashtag: string;
  initial: string;
  color: string;
}

const CONTACTS: Contact[] = [
  { id: "jayz", name: "Jay Z", cashtag: "$sc", initial: "J", color: "var(--color-gray-500)" },
  { id: "diego", name: "Diego", cashtag: "$dm", initial: "D", color: "var(--color-purple)" },
  { id: "sandy", name: "Sandy G.", cashtag: "$sandy", initial: "S", color: "var(--color-orange)" },
];

export function PaymentDetailsScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string>("jayz");
  const [sendAs, setSendAs] = useState<"cash" | "gift-card" | "stock">("cash");

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <button
          type="button"
          onClick={() => router.push("/pay")}
          aria-label="Fermer"
          className="text-2xl text-ink"
        >
          ×
        </button>
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-ink">$10</span>
          <span className="flex items-center gap-0.5 text-xs text-ink-secondary">
            Bank of America
            <ChevronDown size={12} />
          </span>
        </div>
        <button
          type="button"
          className="rounded-full bg-green px-5 py-2 text-sm font-bold text-white"
        >
          Pay
        </button>
      </div>

      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <span className="text-[0.95rem] text-ink-secondary">To</span>
        <span className="h-4 w-px bg-green" />
        <span className="text-[0.95rem] text-placeholder">
          Name, $Cashtag, Phone, Email
        </span>
      </div>

      <div className="border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="text-[0.95rem] text-ink-secondary">For</span>
          <span className="text-[0.95rem] text-placeholder">Add a note</span>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <span className="text-[0.95rem] text-ink-secondary">Send as</span>
        <div className="flex flex-1 justify-end gap-2 overflow-x-auto">
          <Chip
            variant={sendAs === "cash" ? "primary" : "secondary"}
            onClick={() => setSendAs("cash")}
          >
            Cash
          </Chip>
          <Chip
            variant={sendAs === "gift-card" ? "primary" : "secondary"}
            withChevron
            onClick={() => setSendAs("gift-card")}
          >
            Gift Card
          </Chip>
          <Chip
            variant="outline"
            withChevron
            onClick={() => setSendAs("stock")}
          >
            Stock
          </Chip>
        </div>
      </div>

      <div className="bg-surface-muted px-5 py-2">
        <span className="text-xs font-semibold tracking-wide text-ink-secondary">
          SUGGESTED
        </span>
      </div>

      <div className="flex flex-col">
        {CONTACTS.map((contact) => {
          const isSelected = selected === contact.id;
          return (
            <button
              key={contact.id}
              type="button"
              onClick={() => setSelected(contact.id)}
              className="flex items-center gap-3 px-5 py-3 text-left"
            >
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                  isSelected ? "border-green bg-green" : "border-border-strong bg-transparent"
                )}
              >
                {isSelected && (
                  <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                    <path
                      d="M1 4.5L4.2 7.5L11 1"
                      stroke="white"
                      strokeWidth={1.6}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>

              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-bold text-white"
                style={{ backgroundColor: contact.color }}
              >
                {contact.initial}
              </span>

              <span className="flex flex-1 flex-col">
                <span className="text-[0.95rem] font-bold text-ink">
                  {contact.name}
                </span>
                <span className="text-sm text-ink-secondary">
                  {contact.cashtag}
                </span>
              </span>

              <User className="text-ink-secondary" size={18} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
