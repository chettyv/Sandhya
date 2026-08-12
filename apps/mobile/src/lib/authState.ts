import { useEffect, useState } from "react";

import { supabase } from "./supabase";

export type AuthState = "loading" | "signed_out" | "signed_in";

export function useAuthState(): AuthState {
  const [state, setState] = useState<AuthState>(supabase ? "loading" : "signed_out");

  useEffect(() => {
    if (!supabase) return;
    let mounted = true;
    void supabase.auth
      .getSession()
      .then(({ data }) => {
        if (mounted) setState(data.session ? "signed_in" : "signed_out");
      })
      .catch(() => {
        if (mounted) setState("signed_out");
      });
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setState(session ? "signed_in" : "signed_out");
    });
    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  return state;
}
