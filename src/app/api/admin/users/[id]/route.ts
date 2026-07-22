import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, RequireAdminError } from "@/lib/supabase/require-admin";
import type { TablesUpdate } from "@/lib/supabase/database.types";

const VALID_TIERS = ["bronze", "silver", "gold"];
const VALID_ROLES = ["member", "admin"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  let adminUserId: string;
  try {
    ({ userId: adminUserId } = await requireAdmin());
  } catch (error) {
    if (error instanceof RequireAdminError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    throw error;
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const merchant_tier = body?.merchant_tier;
  const role = body?.role;

  if (merchant_tier && !VALID_TIERS.includes(merchant_tier)) {
    return NextResponse.json({ error: "Palye pa valid." }, { status: 400 });
  }
  if (role && !VALID_ROLES.includes(role)) {
    return NextResponse.json({ error: "Wòl pa valid." }, { status: 400 });
  }
  if (!merchant_tier && !role) {
    return NextResponse.json({ error: "Okenn chanjman voye." }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: before } = await admin
    .from("users")
    .select("merchant_tier, role")
    .eq("id", id)
    .maybeSingle();

  if (!before) {
    return NextResponse.json({ error: "Itilizatè pa jwenn." }, { status: 404 });
  }

  if (role === "member" && before.role === "admin") {
    const { count } = await admin
      .from("users")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    if ((count ?? 0) <= 1) {
      return NextResponse.json({ error: "Ou pa kapab retire dènye admin la." }, { status: 400 });
    }
  }

  const updates: TablesUpdate<"users"> = {};
  if (merchant_tier) updates.merchant_tier = merchant_tier;
  if (role) updates.role = role;

  const { error: updateError } = await admin.from("users").update(updates).eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: "Nou pa kapab mete ajou itilizatè a." }, { status: 400 });
  }

  await admin.from("audit_log").insert({
    entity_table: "users",
    entity_id: id,
    action: "update_user_privileges",
    actor_id: adminUserId,
    state_before: before,
    state_after: {
      merchant_tier: merchant_tier ?? before.merchant_tier,
      role: role ?? before.role,
    },
  });

  return NextResponse.json({ ok: true });
}
