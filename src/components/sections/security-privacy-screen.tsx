"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Smartphone } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { CheckboxRow } from "@/components/ui/checkbox-row";
import { AssetIcon } from "@/components/ui/asset-icon";
import { cn } from "@/lib/utils";

export function SecurityPrivacyScreen() {
  const router = useRouter();
  const [securityLock, setSecurityLock] = useState(true);
  const [moveMoney, setMoveMoney] = useState(true);
  const [unlockApp, setUnlockApp] = useState(false);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-surface-muted">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-5 pt-4">
        <button type="button" onClick={() => router.push("/account")} aria-label="Retour">
          <AssetIcon name="chevron-left" className="text-ink" size={22} />
        </button>
        <span className="text-lg font-bold text-ink">Security &amp; Privacy</span>
        <span />
      </div>

      <div className="bg-surface-muted px-5 py-3 pt-6">
        <span className="text-xs font-semibold tracking-wide text-ink-secondary">
          SECURITY
        </span>
      </div>

      <div className="bg-surface">
        <div className="flex items-start justify-between gap-4 px-5 py-4">
          <span className="text-[1.05rem] font-bold text-ink">Security Lock</span>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-sm font-bold",
                securityLock ? "text-green" : "text-ink-secondary"
              )}
            >
              {securityLock ? "On" : "Off"}
            </span>
            <Switch checked={securityLock} onCheckedChange={setSecurityLock} />
          </div>
        </div>
        <p className="px-5 pb-4 text-[0.95rem] text-ink-secondary">
          Require a PIN to move money or unlock the app after 5 min of
          inactivity
        </p>

        <CheckboxRow
          label="Move money"
          checked={moveMoney}
          onToggle={() => setMoveMoney((v) => !v)}
        />
        <CheckboxRow
          label="Unlock the app"
          checked={unlockApp}
          onToggle={() => setUnlockApp((v) => !v)}
        />

        <div className="py-5 text-center">
          <button type="button" className="text-[1.05rem] font-bold text-green">
            Change Cash PIN
          </button>
        </div>
      </div>

      <div className="bg-surface-muted py-3" />

      <div className="flex flex-col gap-4 bg-surface px-5 py-5">
        <div className="flex flex-col gap-1">
          <span className="text-[1.05rem] font-bold text-ink">
            Your Devices (1)
          </span>
          <span className="text-[0.95rem] text-ink-secondary">
            These are devices that are signed in to your Cash App account
          </span>
        </div>

        <div className="flex items-center gap-3 border-b border-border pb-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green">
            <Smartphone className="text-white" size={20} />
          </span>
          <div className="flex flex-col">
            <span className="text-[0.95rem] font-bold text-ink">
              iPhone (this device)
            </span>
            <span className="text-sm text-ink-secondary">
              CA, United States • Active now
            </span>
          </div>
        </div>

        <button
          type="button"
          className="pt-1 text-center text-[0.95rem] font-bold text-green"
        >
          View all
        </button>
      </div>
    </div>
  );
}
