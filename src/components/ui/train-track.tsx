"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type TrainStationStatus = "done" | "now" | "todo";

export interface TrainStation {
  position: number;
  status: TrainStationStatus;
  label?: string;
  avatarUrl?: string | null;
  initial?: string;
  color?: string;
}

interface TrainTrackProps {
  stations: TrainStation[];
  /** compact = piste fine pour GroupCard (pas d'avatar) ; detailed = route d'avatars scrollable (group-detail). */
  variant?: "compact" | "detailed";
  className?: string;
}

/**
 * Piste de train (modèle 07 du moodboard cycle_concepts_10.html) :
 * chaque station = un mois/membre, un wagon 🚂 marque la station
 * "en cours". Remplace les petits traits de GroupCard (variant
 * compact) et WonnAvatarRoute (variant detailed, avatars réels).
 */
export function TrainTrack({ stations, variant = "detailed", className }: TrainTrackProps) {
  const isCompact = variant === "compact";
  const nowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isCompact) {
      nowRef.current?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [isCompact, stations]);

  if (isCompact) {
    return (
      <div className={cn("flex w-full gap-1", className)}>
        {stations.map((station) => (
          <div key={station.position} className="relative h-3 flex-1">
            <span
              className={cn(
                "absolute inset-x-0 top-1/2 h-0 -translate-y-1/2 border-t-2 border-dashed",
                station.status === "done" ? "border-green" : "border-border-strong"
              )}
            />
            {station.status === "now" && (
              <span className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-green-bright/60 motion-reduce:hidden" />
            )}
            <span
              className={cn(
                "absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface",
                station.status === "done" && "bg-green",
                station.status === "now" && "bg-green-bright",
                station.status === "todo" && "bg-border-strong"
              )}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center overflow-x-auto px-4 pt-3 pb-1", className)}>
      {stations.map((station, i) => {
        const isNow = station.status === "now";

        return (
          <div
            key={station.position}
            ref={isNow ? nowRef : undefined}
            className="stagger-item flex shrink-0 items-center"
            style={{ "--stagger-index": i } as CSSProperties}
          >
            <div className="flex w-14 shrink-0 flex-col items-center gap-1">
              <div className="relative">
                {isNow && (
                  <>
                    <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-green-bright/50 motion-reduce:hidden" />
                    <span
                      aria-hidden="true"
                      className="train-bob motion-reduce:animate-none absolute -top-3 left-1/2 -translate-x-1/2 text-base leading-none select-none"
                    >
                      🚂
                    </span>
                  </>
                )}
                <span
                  className={cn(
                    "relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full text-base font-bold text-white transition-[opacity,filter] duration-[var(--duration-ui)] ease-[var(--ease-out)]",
                    isNow ? "ring-2 ring-green-bright ring-offset-2 ring-offset-surface" : "grayscale opacity-40"
                  )}
                  style={!station.avatarUrl ? { backgroundColor: station.color ?? "var(--color-ink-secondary)" } : undefined}
                >
                  {station.avatarUrl ? (
                    <Image src={station.avatarUrl} alt="" fill className="object-cover" />
                  ) : (
                    station.initial
                  )}
                </span>
              </div>
              <span
                className={cn(
                  "max-w-[56px] truncate text-center text-[0.65rem]",
                  isNow ? "font-bold text-ink" : "text-ink-secondary"
                )}
              >
                {station.label}
              </span>
            </div>

            {i < stations.length - 1 && (
              <div
                className={cn(
                  "mx-1 h-0 w-6 shrink-0 border-t-2 border-dashed",
                  station.status === "done" ? "border-green" : "border-border-strong"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
