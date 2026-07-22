import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, RequireAdminError } from "@/lib/supabase/require-admin";

const SIGNED_URL_TTL_SECONDS = 300;

export async function GET(_request: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof RequireAdminError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    throw error;
  }

  const { userId } = await params;
  const admin = createAdminClient();

  const { data: files } = await admin.storage.from("documents").list(userId);
  const file = files?.[0];

  if (!file) {
    return NextResponse.json({ url: null });
  }

  const { data: signed, error: signError } = await admin.storage
    .from("documents")
    .createSignedUrl(`${userId}/${file.name}`, SIGNED_URL_TTL_SECONDS);

  if (signError || !signed) {
    return NextResponse.json({ error: "Nou pa kapab jwenn dokiman an." }, { status: 500 });
  }

  return NextResponse.json({ url: signed.signedUrl, filename: file.name });
}

export async function POST(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  let adminUserId: string;
  try {
    ({ userId: adminUserId } = await requireAdmin());
  } catch (error) {
    if (error instanceof RequireAdminError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    throw error;
  }

  const { userId } = await params;
  const body = await request.json().catch(() => null);
  const action = body?.action;

  if (action !== "approve" && action !== "reject") {
    return NextResponse.json({ error: "Aksyon pa valid." }, { status: 400 });
  }

  const admin = createAdminClient();
  const nextStatus = action === "approve" ? "verified" : "rejected";

  const { data: before } = await admin
    .from("users")
    .select("kyc_status")
    .eq("id", userId)
    .maybeSingle();

  const { error: updateError } = await admin
    .from("users")
    .update({ kyc_status: nextStatus })
    .eq("id", userId);

  if (updateError) {
    return NextResponse.json({ error: "Nou pa kapab mete ajou estati KYC la." }, { status: 400 });
  }

  await admin.from("audit_log").insert({
    entity_table: "users",
    entity_id: userId,
    action: `kyc_${action}`,
    actor_id: adminUserId,
    state_before: { kyc_status: before?.kyc_status ?? null },
    state_after: { kyc_status: nextStatus },
  });

  return NextResponse.json({ kyc_status: nextStatus });
}
