import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Le projet Supabase envoie le template email par défaut (lien de
 * confirmation cliquable), pas un code OTP à taper — personnaliser le
 * template pour inclure {{ .Token }} demanderait un accès au Dashboard
 * que nos outils n'ont pas. On suit donc le lien : Supabase redirige ici
 * avec ?code=..., qu'on échange contre une session (flow PKCE standard
 * de @supabase/ssr).
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const { data: existingProfile } = await supabase
        .from("users")
        .select("id")
        .eq("id", data.user.id)
        .maybeSingle();

      return NextResponse.redirect(
        `${origin}${existingProfile ? "/home" : "/onboarding/name"}`
      );
    }
  }

  return NextResponse.redirect(`${origin}/onboarding/email?error=link`);
}
