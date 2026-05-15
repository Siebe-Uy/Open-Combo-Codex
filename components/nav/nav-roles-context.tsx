"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type NavRolesState = {
  signedIn: boolean;
  showModeratorNav: boolean;
  username: string | null;
  signOut: () => Promise<void>;
};

const NavRolesContext = createContext<NavRolesState | null>(null);

async function refreshModeratorFlag(db: SupabaseClient<Database>, userId: string): Promise<boolean> {
  const { data } = await db.from("profiles").select("role").eq("id", userId).maybeSingle();
  const role = data?.role;
  return role === "moderator" || role === "admin";
}

function getUsername(user: User): string {
  return (
    user.user_metadata?.user_name ??
    user.user_metadata?.preferred_username ??
    user.user_metadata?.full_name ??
    user.email?.split("@")[0] ??
    "duelist"
  );
}

export function NavRolesProvider({ children }: { children: ReactNode }) {
  const [signedIn, setSignedIn] = useState(false);
  const [showModeratorNav, setShowModeratorNav] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  const signOut = useCallback(async () => {
    const client = createClient();
    await client?.auth.signOut();
    setSignedIn(false);
    setShowModeratorNav(false);
    setUsername(null);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      return;
    }

    const client = createClient();

    if (!client) {
      return;
    }

    const db = client;

    async function sync(user: User | undefined) {
      if (!user) {
        setSignedIn(false);
        setShowModeratorNav(false);
        setUsername(null);
        return;
      }

      setSignedIn(true);
      setUsername(getUsername(user));
      setShowModeratorNav(await refreshModeratorFlag(db, user.id));
    }

    db.auth.getUser().then(({ data }) => sync(data.user ?? undefined));

    const { data: listener } = db.auth.onAuthStateChange((_event, session) => {
      sync(session?.user ?? undefined);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const value = useMemo(
    () => ({ signedIn, showModeratorNav, username, signOut }),
    [signedIn, showModeratorNav, username, signOut],
  );

  return <NavRolesContext.Provider value={value}>{children}</NavRolesContext.Provider>;
}

export function useNavRoles(): NavRolesState {
  const ctx = useContext(NavRolesContext);

  if (!ctx) {
    throw new Error("useNavRoles must be used within NavRolesProvider");
  }

  return ctx;
}
