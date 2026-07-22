import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { KycQueue, type KycUser } from "@/components/admin/kyc-queue";

export const dynamic = "force-dynamic";
import { cn } from "@/lib/utils";

const FILTERS = [
  { value: "pending", label: "An atant" },
  { value: "verified", label: "Verifye" },
  { value: "rejected", label: "Rejte" },
] as const;

type KycFilter = (typeof FILTERS)[number]["value"];

export default async function AdminKycPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filter: KycFilter = FILTERS.some((f) => f.value === status) ? (status as KycFilter) : "pending";

  const admin = createAdminClient();
  let users: KycUser[] = [];

  if (filter === "pending") {
    // kyc_status='pending' est la valeur par défaut de TOUS les comptes à
    // l'inscription — on ne veut afficher ici que ceux qui ont réellement
    // soumis un document, pas tous les comptes jamais vérifiés.
    const { data: folders } = await admin.storage.from("documents").list();
    const userIds = (folders ?? []).map((f) => f.name).filter(Boolean);

    if (userIds.length > 0) {
      const { data } = await admin
        .from("users")
        .select("id, full_name, phone, kyc_status, created_at")
        .eq("kyc_status", "pending")
        .in("id", userIds)
        .order("created_at", { ascending: false });
      users = data ?? [];
    }
  } else {
    const { data } = await admin
      .from("users")
      .select("id, full_name, phone, kyc_status, created_at")
      .eq("kyc_status", filter)
      .order("created_at", { ascending: false });
    users = data ?? [];
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <h1 className="text-2xl font-bold text-ink">Verifikasyon KYC</h1>

      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={`/admin/kyc?status=${f.value}`}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-bold transition-colors duration-[var(--duration-tap)]",
              filter === f.value
                ? "bg-ink text-surface"
                : "border border-border bg-surface text-ink-secondary hover:text-ink"
            )}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <KycQueue users={users} showActions={filter === "pending"} />
    </div>
  );
}
