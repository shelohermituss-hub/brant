"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type TrainStationStatus = "done" | "now" | "todo";

export interface TrainStation {
  position: number;
  status: TrainStationStatus;
  avatarUrl?: string | null;
  initial?: string;
  color?: string;
}

interface TrainTrackProps {
  stations: TrainStation[];
  /** compact = piste fine pour GroupCard ; detailed = route scrollable pour group-detail-screen. */
  variant?: "compact" | "detailed";
  /** Bulle affichée au-dessus de la station "now", uniquement en variant compact (ex. "Tou pa w"). */
  nowTooltip?: string;
  className?: string;
}

interface Point {
  x: number;
  y: number;
}

/** Tracé courbe (modèle 07 "Tren" de cycle_concepts_10.html) — jamais une ligne droite. */
const TRACK_D = "M10 120 C 60 50, 110 150, 170 80 C 210 40, 250 130, 300 20";
const VIEW_W = 310;
const VIEW_H = 160;

/**
 * Piste de train (modèle 07 du moodboard cycle_concepts_10.html) :
 * courbe en pointillés, stations réparties le long du tracé via
 * SVGPathElement.getPointAtLength (comme le moodboard original), pas
 * alignées en ligne droite. La station "en cours" affiche une vraie
 * photo de profil — aucune icône de locomotive.
 */
export function TrainTrack({ stations, variant = "detailed", nowTooltip, className }: TrainTrackProps) {
  const isCompact = variant === "compact";
  const pathRef = useRef<SVGPathElement>(null);
  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {
    const path = pathRef.current;
    if (!path || stations.length === 0) return;
    const len = path.getTotalLength();
    const n = stations.length;
    setPoints(
      stations.map((_, i) => {
        const p = path.getPointAtLength(n === 1 ? len / 2 : (i / (n - 1)) * len);
        return { x: p.x, y: p.y };
      })
    );
  }, [stations]);

  return (
    <div className={cn("relative w-full", isCompact ? "h-[68px]" : "h-[150px]", className)}>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <path
          ref={pathRef}
          d={TRACK_D}
          fill="none"
          stroke="var(--color-border-strong)"
          strokeWidth={isCompact ? 3 : 4}
          strokeDasharray="2 9"
          strokeLinecap="round"
        />
      </svg>

      {points.map((point, i) => {
        const station = stations[i];
        const isNow = station.status === "now";
        const size = isCompact ? (isNow ? 28 : 10) : isNow ? 52 : 40;

        return (
          <div
            key={station.position}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${(point.x / VIEW_W) * 100}%`, top: `${(point.y / VIEW_H) * 100}%` }}
          >
            {isNow && (
              <span
                className="absolute inset-0 -z-10 animate-ping rounded-full bg-green-bright/50 motion-reduce:hidden"
                style={{ width: size, height: size }}
              />
            )}

            {isCompact && isNow && nowTooltip && (
              <span className="absolute bottom-full left-1/2 mb-2 flex -translate-x-1/2 flex-col items-center">
                <span className="rounded-md bg-green px-2 py-1 text-xs font-bold whitespace-nowrap text-white">
                  {nowTooltip}
                </span>
                <span className="h-0 w-0 border-x-4 border-t-4 border-x-transparent border-t-green" />
              </span>
            )}

            {station.avatarUrl ? (
              <span
                className={cn(
                  "relative block overflow-hidden rounded-full transition-[opacity,filter] duration-[var(--duration-ui)] ease-[var(--ease-out)]",
                  isNow ? "ring-2 ring-green-bright ring-offset-2 ring-offset-surface" : "opacity-40 grayscale"
                )}
                style={{ width: size, height: size }}
              >
                <Image src={station.avatarUrl} alt="" fill className="object-cover" />
              </span>
            ) : isCompact ? (
              <span
                className={cn(
                  "block rounded-full",
                  isNow ? "bg-green-bright" : station.status === "done" ? "bg-green" : "bg-border-strong"
                )}
                style={{ width: size, height: size }}
              />
            ) : (
              <span
                className={cn(
                  "flex items-center justify-center rounded-full text-xs font-bold text-white transition-[opacity,filter] duration-[var(--duration-ui)] ease-[var(--ease-out)]",
                  isNow ? "ring-2 ring-green-bright ring-offset-2 ring-offset-surface" : "opacity-40 grayscale"
                )}
                style={{ width: size, height: size, backgroundColor: station.color ?? "var(--color-ink-secondary)" }}
              >
                {station.initial}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
