import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Tables } from "@/lib/supabase/database.types";

export class RequireAdminError extends Error {
  status: 401 | 403;

  constructor(status: 401 | 403, message: string) {
    super(message);
    this.status = status;
  }
}

/**
 * Vérifie que l'utilisateur connecté est admin — utilisé aussi bien par
 * src/app/admin/layout.tsx que par chaque route /api/admin/*. Le rôle est
 * relu via le client service_role (pas le client anon) : la décision
 * d'accès ne doit jamais dépendre de la fraîcheur de la session RLS.
 */
export async function requireAdmin(): Promise<{
  userId: string;
  profile: Tables<"users">;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new RequireAdminError(401, "Ou dwe konekte.");
  }

  const admin = createAdminClient();
  const { data: profile } = await admin.from("users").select("*").eq("id", user.id).maybeSingle();

  if (!profile || profile.role !== "admin") {
    throw new RequireAdminError(403, "Aksè refize.");
  }

  return { userId: user.id, profile };
}
