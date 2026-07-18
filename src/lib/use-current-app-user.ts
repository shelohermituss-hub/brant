"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/database.types";

type Profile = Tables<"users"> & {
  wallets: Pick<Tables<"wallets">, "id" | "balance"> | null;
};

interface CurrentAppUserState {
  loading: boolean;
  authUserId: string | null;
  profile: Profile | null;
}

/**
 * État "utilisateur connecté" côté client, source unique pour tous les
 * écrans qui affichent des données réelles (wallet, profil...).
 * Pas de session Supabase => écrans dans leur état vide, pas de crash
 * (voir CLAUDE.md : chaque composant couvre son état vide/non connecté).
 */
export function useCurrentAppUser() {
  const [state, setState] = useState<CurrentAppUserState>({
    loading: true,
    authUserId: null,
    profile: null,
  });

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (!cancelled) setState({ loading: false, authUserId: null, profile: null });
        return;
      }

      const { data: profile } = await supabase
        .from("users")
        .select("*, wallets(id, balance)")
        .eq("id", user.id)
        .maybeSingle();

      if (!cancelled) {
        setState({
          loading: false,
          authUserId: user.id,
          profile: (profile as Profile | null) ?? null,
        });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
