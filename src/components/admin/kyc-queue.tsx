"use client";

import { useState } from "react";
import { FileText, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export interface KycUser {
  id: string;
  full_name: string;
  phone: string;
  kyc_status: string;
  created_at: string;
}

const STATUS_TONE: Record<string, "paid" | "wait" | "late"> = {
  verified: "paid",
  pending: "wait",
  rejected: "late",
};

const STATUS_LABEL: Record<string, string> = {
  verified: "Verifye",
  pending: "An atant",
  rejected: "Rejte",
};

interface KycQueueProps {
  users: KycUser[];
  showActions: boolean;
}

export function KycQueue({ users, showActions }: KycQueueProps) {
  const [selected, setSelected] = useState<KycUser | null>(null);
  const [docUrl, setDocUrl] = useState<string | null>(null);
  const [docFilename, setDocFilename] = useState<string | null>(null);
  const [docLoading, setDocLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<"approve" | "reject" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resolved, setResolved] = useState<Record<string, string>>({});

  async function selectUser(user: KycUser) {
    setSelected(user);
    setDocUrl(null);
    setDocFilename(null);
    setDocLoading(true);
    try {
      const res = await fetch(`/api/admin/kyc/${user.id}`);
      const data = await res.json().catch(() => null);
      setDocUrl(data?.url ?? null);
      setDocFilename(data?.filename ?? null);
    } finally {
      setDocLoading(false);
    }
  }

  async function confirmAction() {
    if (!selected || !pendingAction) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/kyc/${selected.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: pendingAction }),
      });
      if (res.ok) {
        setResolved((prev) => ({
          ...prev,
          [selected.id]: pendingAction === "approve" ? "verified" : "rejected",
        }));
        setPendingAction(null);
      }
    } finally {
      setSubmitting(false);
    }
  }

  const visibleUsers = users.filter((u) => !resolved[u.id]);
  const isPdf = docFilename?.toLowerCase().endsWith(".pdf");

  return (
    <div className="grid grid-cols-[320px_1fr] gap-4">
      <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-surface">
        {visibleUsers.length === 0 ? (
          <p className="px-4 py-6 text-sm text-ink-secondary">Okenn itilizatè.</p>
        ) : (
          visibleUsers.map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => selectUser(user)}
              className={cn(
                "flex flex-col gap-0.5 border-b border-border px-4 py-3 text-left transition-colors duration-[var(--duration-tap)] last:border-b-0 hover:bg-surface-muted",
                selected?.id === user.id && "bg-surface-muted"
              )}
            >
              <span className="text-sm font-bold text-ink">{user.full_name}</span>
              <span className="text-xs text-ink-secondary">{user.phone}</span>
            </button>
          ))
        )}
      </div>

      <div className="rounded-lg border border-border bg-surface p-6">
        {!selected ? (
          <p className="text-sm text-ink-secondary">Chwazi yon itilizatè pou wè dokiman li.</p>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-ink">{selected.full_name}</p>
                <p className="text-sm text-ink-secondary">{selected.phone}</p>
              </div>
              <StatusBadge
                label={STATUS_LABEL[resolved[selected.id] ?? selected.kyc_status]}
                tone={STATUS_TONE[resolved[selected.id] ?? selected.kyc_status]}
              />
            </div>

            <div className="flex min-h-[320px] items-center justify-center rounded-lg border border-dashed border-border-strong bg-surface-muted">
              {docLoading ? (
                <span className="text-sm text-ink-secondary">Chajman...</span>
              ) : !docUrl ? (
                <span className="text-sm text-ink-secondary">Pa gen dokiman.</span>
              ) : isPdf ? (
                <a
                  href={docUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center gap-2 text-sm font-bold text-ink"
                >
                  <FileText size={32} />
                  Louvri dokiman PDF la
                  <ExternalLink size={14} />
                </a>
              ) : (
                <a href={docUrl} target="_blank" rel="noreferrer" className="relative block h-[320px] w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element -- URL signée privée, hors des domaines autorisés par next/image */}
                  <img src={docUrl} alt="" className="h-full w-full object-contain" />
                </a>
              )}
            </div>

            {showActions && !resolved[selected.id] && (
              <div className="flex justify-end gap-3">
                <Button variant="destructive" onClick={() => setPendingAction("reject")}>
                  Rejte
                </Button>
                <Button onClick={() => setPendingAction("approve")}>Apwouve</Button>
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog open={!!pendingAction} onOpenChange={(open) => !open && setPendingAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pendingAction === "approve" ? "Apwouve dokiman an ?" : "Rejte dokiman an ?"}
            </DialogTitle>
            <DialogDescription>
              {selected?.full_name} — aksyon sa a ap mete ajou estati KYC li imedyatman.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Anile</DialogClose>
            <Button onClick={confirmAction} disabled={submitting}>
              {submitting ? "..." : "Konfime"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
