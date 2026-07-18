"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckboxRow } from "@/components/ui/checkbox-row";
import { AssetIcon } from "@/components/ui/asset-icon";

export function NotificationsScreen() {
  const router = useRouter();
  const [push, setPush] = useState(false);
  const [sms, setSms] = useState(true);
  const [email, setEmail] = useState(false);
  const [paymentReminders, setPaymentReminders] = useState(true);
  const [groupActivity, setGroupActivity] = useState(false);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-surface-muted">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-5 pt-4">
        <button type="button" onClick={() => router.push("/account")} aria-label="Retour">
          <AssetIcon name="chevron-left" className="text-ink" size={22} />
        </button>
        <span className="text-lg font-bold text-ink">Notifications</span>
        <span />
      </div>

      <div className="bg-surface-muted py-4" />

      <div className="bg-surface">
        <CheckboxRow label="Push Notifications" checked={push} onToggle={() => setPush((v) => !v)} />
        <CheckboxRow label="SMS Notifications" checked={sms} onToggle={() => setSms((v) => !v)} />
        <CheckboxRow label="Email Notifications" checked={email} onToggle={() => setEmail((v) => !v)} />
      </div>

      <div className="bg-surface-muted py-3" />

      <div className="bg-surface">
        <CheckboxRow
          label="Rapèl kotizasyon"
          checked={paymentReminders}
          onToggle={() => setPaymentReminders((v) => !v)}
        />
        <CheckboxRow
          label="Aktivite gwoup"
          checked={groupActivity}
          onToggle={() => setGroupActivity((v) => !v)}
        />
      </div>
    </div>
  );
}
