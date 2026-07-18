import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Simule le round-trip webhook MonCash (Règle 0 du skill moncash-flow) :
 * aucune vraie clé marchand disponible ici, donc pas d'appel API MonCash
 * réel — mais le séquencement est fidèle (événement brut d'abord,
 * idempotency_key garantit qu'un double-clic n'écrit qu'une fois, état
 * due -> pending -> paid comme l'exigerait un vrai callback).
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Ou dwe konekte." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const groupId = body?.groupId;
  if (typeof groupId !== "string") {
    return NextResponse.json({ error: "Gwoup pa valid." }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: group } = await admin
    .from("groups")
    .select("id, monthly_amount, current_cycle")
    .eq("id", groupId)
    .maybeSingle();
  if (!group) {
    return NextResponse.json({ error: "Gwoup pa jwenn." }, { status: 404 });
  }

  const { data: membership } = await admin
    .from("memberships")
    .select("id")
    .eq("group_id", groupId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!membership) {
    return NextResponse.json({ error: "Ou pa manm gwoup sa a." }, { status: 403 });
  }

  const idempotencyKey = `${membership.id}:${group.current_cycle}`;

  const { error: webhookError } = await admin.from("webhook_events").insert({
    idempotency_key: idempotencyKey,
    raw_payload: {
      simulated: true,
      groupId,
      membershipId: membership.id,
      cycleNumber: group.current_cycle,
      amount: group.monthly_amount,
    },
  });
  const alreadyProcessed = !!webhookError;

  let { data: contribution } = await admin
    .from("contributions")
    .select("id, state, amount")
    .eq("membership_id", membership.id)
    .eq("cycle_number", group.current_cycle)
    .maybeSingle();

  if (alreadyProcessed) {
    return NextResponse.json({ contribution, alreadyProcessed: true });
  }

  if (!contribution) {
    const { data: inserted, error: insertError } = await admin
      .from("contributions")
      .insert({
        group_id: groupId,
        membership_id: membership.id,
        cycle_number: group.current_cycle,
        month: new Date().toISOString().slice(0, 10),
        amount: group.monthly_amount,
      })
      .select("id, state, amount")
      .single();
    if (insertError || !inserted) {
      return NextResponse.json({ error: "Nou pa kapab kreye kotizasyon an." }, { status: 500 });
    }
    contribution = inserted;
  }

  if (contribution.state === "paid") {
    return NextResponse.json({ contribution, alreadyProcessed: true });
  }
  if (contribution.state === "defaulted") {
    return NextResponse.json({ error: "Kotizasyon sa a deja an default." }, { status: 409 });
  }

  if (contribution.state === "due") {
    const { data: pending } = await admin
      .from("contributions")
      .update({ state: "pending" })
      .eq("id", contribution.id)
      .select("id, state, amount")
      .single();
    if (pending) contribution = pending;
  }

  const { data: paid, error: paidError } = await admin
    .from("contributions")
    .update({ state: "paid", moncash_ref: idempotencyKey })
    .eq("id", contribution.id)
    .select("id, state, amount, paid_at")
    .single();

  if (paidError || !paid) {
    return NextResponse.json({ error: "Nou pa kapab konfime peman an." }, { status: 500 });
  }

  await admin
    .from("webhook_events")
    .update({ processed: true, processed_at: new Date().toISOString() })
    .eq("idempotency_key", idempotencyKey);

  return NextResponse.json({ contribution: paid });
}
