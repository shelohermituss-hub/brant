import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { MONCASH_TRANSFER_MAX } from "@/lib/moncash-limits";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Ou dwe konekte." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const amount = Number(body?.amount);

  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "Montan pa valid." }, { status: 400 });
  }

  if (amount > MONCASH_TRANSFER_MAX) {
    return NextResponse.json(
      { error: `Ou pa kapab voye plis pase ${MONCASH_TRANSFER_MAX.toLocaleString("fr-FR")} HTG nan yon sèl vèsman.` },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  const { data: profile } = await admin
    .from("users")
    .select("moncash_number")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.moncash_number) {
    return NextResponse.json({ error: "Ou pa gen nimewo MonCash konekte." }, { status: 400 });
  }

  const { data: transaction, error } = await admin.rpc("apply_wallet_transaction", {
    p_user_id: user.id,
    p_type: "transfer_to_moncash",
    p_amount: -Math.round(amount),
    p_reference: profile.moncash_number,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ transaction });
}
