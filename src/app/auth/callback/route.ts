import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Cible du lien de confirmation d'email envoyé après signUp() (auth par
 * mot de passe). Supabase redirige ici avec ?code=..., qu'on échange
 * contre une session (flow PKCE standard de @supabase/ssr).
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
