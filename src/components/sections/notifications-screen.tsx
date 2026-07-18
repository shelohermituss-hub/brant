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
  const [cashTeam, setCashTeam] = useState(false);
  const [squareOffers, setSquareOffers] = useState(false);
  const [stock, setStock] = useState(true);
  const [bitcoin, setBitcoin] = useState(false);

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
          label="Cash Team Notifications"
          checked={cashTeam}
          onToggle={() => setCashTeam((v) => !v)}
        />
        <CheckboxRow
          label="Square Offers and Rewards"
          checked={squareOffers}
          onToggle={() => setSquareOffers((v) => !v)}
        />
        <CheckboxRow
          label="Stock"
          checked={stock}
          onToggle={() => setStock((v) => !v)}
          trailing={
            <button type="button" className="text-[0.95rem] font-bold text-green">
              Manage
            </button>
          }
        />
        <CheckboxRow
          label="Bitcoin"
          checked={bitcoin}
          onToggle={() => setBitcoin((v) => !v)}
          trailing={
            <button
              type="button"
              className="text-[0.95rem] font-bold text-ink-secondary"
              disabled
            >
              Manage
            </button>
          }
        />
      </div>
    </div>
  );
}
