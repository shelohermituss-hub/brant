"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ShieldCheck, Users, PiggyBank, Receipt, LogOut, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/admin", label: "Tablo bò", icon: LayoutDashboard },
  { href: "/admin/kyc", label: "Verifikasyon KYC", icon: ShieldCheck },
  { href: "/admin/users", label: "Itilizatè", icon: Users },
  { href: "/admin/groups", label: "Gwoup", icon: PiggyBank },
  { href: "/admin/transactions", label: "Tranzaksyon", icon: Receipt },
];

interface AdminSidebarProps {
  adminName: string;
}

export function AdminSidebar({ adminName }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await createClient().auth.signOut();
    router.push("/onboarding/signin");
  }

  return (
    <aside className="flex h-svh w-64 shrink-0 flex-col border-r border-border bg-surface">
      <div className="px-5 py-6">
        <span className="text-lg font-bold text-ink">Sòlid Admin</span>
        <p className="mt-1 truncate text-xs text-ink-secondary">{adminName}</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === href : pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-[var(--duration-tap)]",
                active
                  ? "bg-surface-muted text-ink"
                  : "text-ink-secondary hover:bg-surface-muted hover:text-ink"
              )}
            >
              <Icon size={18} strokeWidth={2.25} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-1 border-t border-border px-3 py-3">
        <Link
          href="/home"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-secondary transition-colors duration-[var(--duration-tap)] hover:bg-surface-muted hover:text-ink"
        >
          <ArrowLeft size={18} strokeWidth={2.25} />
          Retounen nan app la
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red transition-colors duration-[var(--duration-tap)] hover:bg-surface-muted"
        >
          <LogOut size={18} strokeWidth={2.25} />
          Dekonekte
        </button>
      </div>
    </aside>
  );
}
