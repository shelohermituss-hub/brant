"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

export interface AvatarMember {
  position: number;
  name: string;
  initial: string;
  color: string;
}

interface WonnAvatarRouteProps {
  members: AvatarMember[];
  currentPosition: number;
}

/**
 * Route horizontale des membres du wonn : avatars reliés par des
 * pointillés, défilement horizontal. Seul le membre qui reçoit le pot
 * ce cycle-ci apparaît en couleur — les autres en niveaux de gris,
 * jusqu'à ce que leur tour arrive.
 */
export function WonnAvatarRoute({ members, currentPosition }: WonnAvatarRouteProps) {
  const current = members.find((m) => m.position === currentPosition);
  const currentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    currentRef.current?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [currentPosition]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center overflow-x-auto px-4 pb-1">
        {members.map((member, i) => {
          const isCurrent = member.position === currentPosition;

          return (
            <div
              key={member.position}
              ref={isCurrent ? currentRef : undefined}
              className="stagger-item flex shrink-0 items-center"
              style={{ "--stagger-index": i } as CSSProperties}
            >
              <div className="flex w-14 shrink-0 flex-col items-center gap-1">
                <span
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-bold text-white transition-[opacity,filter] duration-[var(--duration-ui)] ease-[var(--ease-out)]",
                    !isCurrent && "grayscale opacity-40"
                  )}
                  style={{ backgroundColor: member.color }}
                >
                  {member.initial}
                </span>
                <span
                  className={cn(
                    "max-w-[56px] truncate text-center text-[0.65rem]",
                    isCurrent ? "font-bold text-ink" : "text-ink-secondary"
                  )}
                >
                  {isCurrent ? member.name.split(" ")[0] : member.position}
                </span>
              </div>

              {i < members.length - 1 && (
                <div className="mx-1 h-0 w-6 shrink-0 border-t-2 border-dashed border-border-strong" />
              )}
            </div>
          );
        })}
      </div>

      {current && (
        <p className="text-center text-[0.9rem] text-ink-secondary">
          <span className="font-bold text-ink">{current.name}</span> ap resevwa pot la mwa sa a
        </p>
      )}
    </div>
  );
}
