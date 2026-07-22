import { createAdminClient } from "@/lib/supabase/admin";
import { UsersTable } from "@/components/admin/users-table";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const admin = createAdminClient();

  let query = admin
    .from("users")
    .select("id, full_name, phone, username, role, merchant_tier, trust_score, kyc_status")
    .order("created_at", { ascending: false })
    .limit(100);

  const cleanQuery = q?.replace(/[,()]/g, "").trim();
  if (cleanQuery) {
    query = query.or(
      `full_name.ilike.%${cleanQuery}%,phone.ilike.%${cleanQuery}%,username.ilike.%${cleanQuery}%`
    );
  }

  const { data: users } = await query;

  return (
    <div className="flex flex-col gap-6 p-8">
      <h1 className="text-2xl font-bold text-ink">Itilizatè</h1>
      <UsersTable users={users ?? []} initialSearch={q ?? ""} />
    </div>
  );
}
