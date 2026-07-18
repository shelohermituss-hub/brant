"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { GroupCard } from "@/components/ui/group-card";
import { CircleEmptyIcon } from "@/components/ui/circle-empty-icon";
import { cn } from "@/lib/utils";

interface CardScreenProps {
  variant?: "empty" | "populated";
}

const ACTIVE_CIRCLES = [
  {
    id: "fanmi",
    href: "/group",
    potAmount: "50 000 HTG",
    contribution: "5 000 HTG",
    memberCount: 10,
    yourPosition: 6,
    startDate: "Nov 2024",
    endDate: "Out 2025",
    adminFees: "2 400 HTG",
  },
  {
    id: "kominote",
    href: "/group",
    potAmount: "20 000 HTG",
    contribution: "2 000 HTG",
    memberCount: 10,
    yourPosition: 3,
    startDate: "Jen 2025",
    endDate: "Me 2026",
    adminFees: "960 HTG",
  },
];

const FINISHED_CIRCLES = [
  {
    id: "premye-sol",
    href: "/group",
    potAmount: "15 000 HTG",
    contribution: "1 500 HTG",
    memberCount: 10,
    yourPosition: 8,
    startDate: "Jan 2024",
    endDate: "Des 2024",
    adminFees: "720 HTG",
  },
];

const RECOMMENDED_CIRCLES = [
  {
    id: "rekomande-1",
    potAmount: "24 000 HTG",
    contribution: "2 000 HTG",
    memberCount: 18,
    yourPosition: 12,
    startDate: "Nov 2024",
    endDate: "Avr 2026",
    adminFees: "2 880 HTG",
  },
  {
    id: "rekomande-2",
    potAmount: "36 000 HTG",
    contribution: "1 500 HTG",
    memberCount: 24,
    yourPosition: 20,
    startDate: "Des 2024",
    endDate: "Nov 2026",
    adminFees: "1 800 HTG",
  },
];

export function CardScreen({ variant = "populated" }: CardScreenProps) {
  const [tab, setTab] = useState<"active" | "finished">("active");
  const [requested, setRequested] = useState<string[]>([]);

  const list = tab === "active" ? (variant === "populated" ? ACTIVE_CIRCLES : []) : FINISHED_CIRCLES;

  return (
    <div className="flex flex-1 flex-col gap-5 overflow-y-auto bg-surface-muted px-4 pt-4 pb-6">
      <header className="flex items-center justify-between px-1 pb-1">
        <h1 className="text-[2.1rem] font-bold text-ink">Sik mwen yo</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/group/create/amount"
            aria-label="Kreye yon sòl"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green"
          >
            <Plus className="text-white" size={22} strokeWidth={2.5} />
          </Link>
          <Link
            href="/account"
            className="h-11 w-11 shrink-0 rounded-full bg-ink-secondary/30"
          />
        </div>
      </header>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab("active")}
          className={cn(
            "h-11 flex-1 rounded-full text-[0.95rem] font-bold",
            tab === "active" ? "bg-green text-white" : "bg-surface text-ink"
          )}
        >
          Aktif
        </button>
        <button
          type="button"
          onClick={() => setTab("finished")}
          className={cn(
            "h-11 flex-1 rounded-full text-[0.95rem] font-bold",
            tab === "finished" ? "bg-green text-white" : "bg-surface text-ink"
          )}
        >
          Fini
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-[1.05rem] font-bold text-ink">Sik ou yo</h2>

        {list.length > 0 ? (
          <div className="flex flex-col gap-3">
            {list.map(({ id, href, ...circle }) => (
              <Link key={id} href={href}>
                <GroupCard {...circle} joined />
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <CircleEmptyIcon />
            <p className="text-[0.95rem] text-ink-secondary">
              {tab === "active"
                ? "Sik aktif ou yo ap parèt isit la!"
                : "Ou poko gen sik fini."}
            </p>
          </div>
        )}
      </div>

      {tab === "active" && (
        <div className="flex flex-col gap-3">
          <h2 className="text-[1.05rem] font-bold text-ink">Rekòmande pou ou</h2>
          <div className="flex flex-col gap-3">
            {RECOMMENDED_CIRCLES.map(({ id, ...circle }) => (
              <GroupCard
                key={id}
                {...circle}
                joined={false}
                requested={requested.includes(id)}
                onJoin={() => setRequested((prev) => [...prev, id])}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
