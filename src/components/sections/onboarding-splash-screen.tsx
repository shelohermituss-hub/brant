"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PillButton } from "@/components/ui/pill-button";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    image: "/images/illustration-onboarding-group.png",
    title: "Rejwenn yon Sòl Fasilman",
    subtitle: "Kreye oswa antre nan yon gwoup sòl ansanm ak moun ou fè konfyans.",
  },
  {
    image: "/images/illustration-onboarding-wallet.png",
    title: "Swiv Peman ou yo",
    subtitle: "Kontwole kotizasyon ak vèsman ou yo an tan reyèl, konekte ak MonCash.",
  },
  {
    image: "/images/illustration-onboarding-shield.png",
    title: "Lajan ou an Sekirite",
    subtitle: "Wallet ou pwoteje ak yon kòd PIN, tout tranzaksyon swiv.",
  },
];

export function OnboardingSplashScreen() {
  const router = useRouter();
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isLast = activeIndex === SLIDES.length - 1;

  function goToSlide(index: number) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
  }

  function handleScroll() {
    const track = trackRef.current;
    if (!track) return;
    const index = Math.round(track.scrollLeft / track.clientWidth);
    setActiveIndex(index);
  }

  return (
    <div className="flex flex-1 flex-col bg-surface">
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex flex-1 snap-x snap-mandatory overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {SLIDES.map((slide) => (
          <div
            key={slide.title}
            className="flex w-full shrink-0 snap-center flex-col items-center justify-center gap-6 px-8"
          >
            <div className="relative h-56 w-56">
              <Image src={slide.image} alt="" fill className="object-contain" priority />
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-[1.75rem] leading-tight font-bold text-ink">{slide.title}</h1>
              <p className="text-[0.95rem] text-ink-secondary">{slide.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 pb-6">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.title}
            type="button"
            aria-label={`Ale nan slide ${i + 1}`}
            onClick={() => goToSlide(i)}
            className="relative h-2 w-6"
          >
            <span
              className={cn(
                "absolute inset-0 origin-left rounded-full transition-[transform,background-color] duration-[var(--duration-ui)] ease-[var(--ease-out)] motion-reduce:transition-colors",
                i === activeIndex ? "scale-x-100 bg-green" : "scale-x-[0.333] bg-border-strong"
              )}
            />
          </button>
        ))}
      </div>

      <div className="px-5 pb-8">
        {isLast ? (
          <div className="flex gap-3">
            <PillButton
              variant="outline"
              className="flex-1"
              onClick={() => router.push("/onboarding/signin")}
            >
              Konekte
            </PillButton>
            <PillButton className="flex-1" onClick={() => router.push("/onboarding/signup")}>
              Kreye yon kont
            </PillButton>
          </div>
        ) : (
          <PillButton className="w-full" onClick={() => goToSlide(activeIndex + 1)}>
            Kontinye
          </PillButton>
        )}
      </div>
    </div>
  );
}
