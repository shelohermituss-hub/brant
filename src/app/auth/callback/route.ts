import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Cible du lien envoyé par email après signUp() (confirmation) ou
 * resetPasswordForEmail() (récupération de modpas) — auth par mot de
 * passe. Supabase redirige ici avec ?code=..., qu'on échange contre une
 * session (flow PKCE standard de @supabase/ssr). `?next=` (passé dans
 * `redirectTo` par le flow mot de passe oublié) prend le dessus sur la
 * redirection par défaut basée sur l'existence du profil.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      if (next) {
        return NextResponse.redirect(`${origin}${next}`);
      }

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

  return NextResponse.redirect(`${origin}/onboarding/signin?error=link`);
}
