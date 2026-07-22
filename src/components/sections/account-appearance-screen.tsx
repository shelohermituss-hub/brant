"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { AssetIcon } from "@/components/ui/asset-icon";
import { useClientSnapshot } from "@/lib/use-client-snapshot";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light", label: "Klè", icon: Sun },
  { value: "dark", label: "Sonm", icon: Moon },
  { value: "system", label: "Sistèm", icon: Monitor },
] as const;

export function AccountAppearanceScreen() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const mounted = useClientSnapshot(() => true, false);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-surface-muted">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-5 pt-4">
        <button type="button" onClick={() => router.push("/account")} aria-label="Retou">
          <AssetIcon name="chevron-left" className="text-ink" size={22} />
        </button>
        <span className="text-lg font-bold text-ink">Aparans</span>
        <span />
      </div>

      <p className="px-5 pt-4 pb-2 text-[0.95rem] text-ink-secondary">
        Chwazi ki jan Sòlid parèt sou aparèy ou.
      </p>

      <div className="flex flex-col gap-3 px-4 pt-2 pb-8">
        {OPTIONS.map(({ value, label, icon: Icon }) => {
          const isActive = mounted && theme === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setTheme(value)}
              className={cn(
                "flex items-center gap-4 rounded-lg border bg-surface px-5 py-4 text-left transition-colors duration-[var(--duration-tap)] ease-[var(--ease-out)]",
                isActive ? "border-green-deep" : "border-border"
              )}
            >
              <Icon className="text-ink" size={20} />
              <span className="flex-1 text-[0.95rem] font-bold text-ink">{label}</span>
              {isActive && <Check className="text-green-deep" size={18} strokeWidth={3} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
