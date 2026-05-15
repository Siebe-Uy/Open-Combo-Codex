"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type NavRolesState = {
  signedIn: boolean;
  showModeratorNav: boolean;
};

const NavRolesContext = createContext<NavRolesState | null>(null);

async function refreshModeratorFlag(db: SupabaseClient<Database>, userId: string): Promise<boolean> {
  const { data } = await db.from("profiles").select("role").eq("id", userId).maybeSingle();
  const role = data?.role;
  return role === "moderator" || role === "admin";
}

export function NavRolesProvider({ children }: { children: ReactNode }) {
  const [signedIn, setSignedIn] = useState(false);
  const [showModeratorNav, setShowModeratorNav] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      return;
    }

    const client = createClient();

    if (!client) {
      return;
    }

    const db = client;

    async function sync(userId: string | undefined) {
      if (!userId) {
        setSignedIn(false);
        setShowModeratorNav(false);
        return;
      }

      setSignedIn(true);
      setShowModeratorNav(await refreshModeratorFlag(db, userId));
    }

    db.auth.getUser().then(({ data }) => sync(data.user?.id));

    const { data: listener } = db.auth.onAuthStateChange((_event, session) => {
      sync(session?.user?.id);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const value = useMemo(() => ({ signedIn, showModeratorNav }), [signedIn, showModeratorNav]);

  return <NavRolesContext.Provider value={value}>{children}</NavRolesContext.Provider>;
}

export function useNavRoles(): NavRolesState {
  const ctx = useContext(NavRolesContext);

  if (!ctx) {
    throw new Error("useNavRoles must be used within NavRolesProvider");
  }

  return ctx;
}
