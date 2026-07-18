import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Client service_role — écritures financières uniquement, jamais importé
 * depuis un composant client. RLS bypass volontaire : contributions,
 * payouts, webhook_events et wallet_transactions sont admin-only côté DB,
 * donc tout insert applicatif doit passer par ici (Route Handlers).
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
