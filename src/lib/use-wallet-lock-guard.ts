"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isWalletUnlocked } from "@/lib/wallet-lock";
import { useClientSnapshot } from "@/lib/use-client-snapshot";

export function useWalletLockGuard(authUserId: string | null): boolean {
  const router = useRouter();
  const pathname = usePathname();
  const unlocked = useClientSnapshot(() => isWalletUnlocked(), false);
  const [noPinConfirmed, setNoPinConfirmed] = useState(false);

  useEffect(() => {
    if (!authUserId || unlocked) return;
    let cancelled = false;

    createClient()
      .rpc("has_wallet_pin")
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || data) {
          router.replace(`/pin?redirect=${encodeURIComponent(pathname)}`);
        } else {
          setNoPinConfirmed(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [authUserId, unlocked, pathname, router]);

  return !authUserId || unlocked || noPinConfirmed;
}
