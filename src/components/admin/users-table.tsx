"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/status-badge";
import { MERCHANT_TIERS } from "@/lib/merchant-tiers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export interface AdminUserRow {
  id: string;
  full_name: string;
  phone: string;
  username: string | null;
  role: string;
  merchant_tier: string;
  trust_score: number;
  kyc_status: string;
}

const KYC_TONE: Record<string, "paid" | "wait" | "late"> = {
  verified: "paid",
  pending: "wait",
  rejected: "late",
};

const KYC_LABEL: Record<string, string> = {
  verified: "Verifye",
  pending: "An atant",
  rejected: "Rejte",
};

interface PendingChange {
  user: AdminUserRow;
  field: "merchant_tier" | "role";
  value: string;
}

interface UsersTableProps {
  users: AdminUserRow[];
  initialSearch: string;
}

export function UsersTable({ users, initialSearch }: UsersTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [rows, setRows] = useState(users);
  const [pendingChange, setPendingChange] = useState<PendingChange | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/admin/users?q=${encodeURIComponent(search)}`);
  }

  async function confirmChange() {
    if (!pendingChange) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${pendingChange.user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [pendingChange.field]: pendingChange.value }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "Erè.");
        return;
      }
      setRows((prev) =>
        prev.map((u) =>
          u.id === pendingChange.user.id ? { ...u, [pendingChange.field]: pendingChange.value } : u
        )
      );
      setPendingChange(null);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Chèche non, telefòn, non itilizatè..."
          className="h-10 flex-1 rounded-lg border border-border bg-surface px-3 text-sm text-ink outline-none focus-visible:border-green-deep"
        />
        <Button type="submit" variant="outline">
          Chèche
        </Button>
      </form>

      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-ink-secondary">
              <th className="px-4 py-3 font-medium">Non</th>
              <th className="px-4 py-3 font-medium">Telefòn</th>
              <th className="px-4 py-3 font-medium">Palye</th>
              <th className="px-4 py-3 font-medium">Wòl</th>
              <th className="px-4 py-3 font-medium">Skò</th>
              <th className="px-4 py-3 font-medium">KYC</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-ink-secondary">
                  Okenn itilizatè.
                </td>
              </tr>
            ) : (
              rows.map((user) => (
                <tr key={user.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 font-bold text-ink">{user.full_name}</td>
                  <td className="px-4 py-3 text-ink-secondary">{user.phone}</td>
                  <td className="px-4 py-3">
                    <select
                      value={user.merchant_tier}
                      onChange={(e) =>
                        setPendingChange({ user, field: "merchant_tier", value: e.target.value })
                      }
                      className="rounded-md border border-border bg-surface px-2 py-1 text-xs text-ink"
                    >
                      {Object.entries(MERCHANT_TIERS).map(([value, info]) => (
                        <option key={value} value={value}>
                          {info.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      onChange={(e) => setPendingChange({ user, field: "role", value: e.target.value })}
                      className="rounded-md border border-border bg-surface px-2 py-1 text-xs text-ink"
                    >
                      <option value="member">Manm</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-ink">{user.trust_score}</td>
                  <td className="px-4 py-3">
                    <StatusBadge label={KYC_LABEL[user.kyc_status]} tone={KYC_TONE[user.kyc_status]} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={!!pendingChange} onOpenChange={(open) => !open && setPendingChange(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfime chanjman</DialogTitle>
            <DialogDescription>
              {pendingChange?.user.full_name} —{" "}
              {pendingChange?.field === "role" ? "chanje wòl" : "chanje palye"} pou &laquo;{" "}
              {pendingChange?.value} &raquo;.
            </DialogDescription>
          </DialogHeader>
          {error && <p className="text-sm text-late">{error}</p>}
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Anile</DialogClose>
            <Button onClick={confirmChange} disabled={submitting}>
              {submitting ? "..." : "Konfime"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
