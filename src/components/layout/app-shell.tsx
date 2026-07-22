"use client";

import { usePathname } from "next/navigation";
import { PageTransition } from "@/components/layout/page-transition";
import { LaunchSplash } from "@/components/layout/launch-splash";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <div className="h-svh w-full overflow-hidden bg-surface-muted">{children}</div>;
  }

  return (
    <div className="w-full max-w-[430px] h-svh bg-surface flex flex-col relative overflow-hidden pt-[env(safe-area-inset-top)]">
      <PageTransition>{children}</PageTransition>
      <LaunchSplash />
    </div>
  );
}
