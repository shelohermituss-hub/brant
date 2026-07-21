"use client";

import { usePathname } from "next/navigation";

/**
 * Transition de page (ANIMATIONS-AUDIT.md F2/HIGH-1). Chaque changement
 * de route remonte ce wrapper (key={pathname}), ce qui rejoue l'animation
 * .page-transition (fade + léger translateY, voir globals.css) au lieu
 * du hard swap instantané par défaut de l'App Router.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="page-transition flex min-h-0 flex-1 flex-col">
      {children}
    </div>
  );
}
