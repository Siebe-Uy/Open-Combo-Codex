"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

async function syncModeratorNav(db: SupabaseClient<Database>, userId: string | undefined, setShow: (show: boolean) => void) {
  if (!userId) {
    setShow(false);
    return;
  }

  const { data } = await db.from("profiles").select("role").eq("id", userId).maybeSingle();
  const role = data?.role;

  setShow(role === "moderator" || role === "admin");
}

export function ModeratorNavLink() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      return;
    }

    const client = createClient();

    if (!client) {
      return;
    }

    client.auth.getUser().then(({ data }) => syncModeratorNav(client, data.user?.id, setShow));

    const { data: listener } = client.auth.onAuthStateChange((_event, session) => {
      syncModeratorNav(client, session?.user?.id, setShow);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (!show) {
    return null;
  }

  return (
    <Link className="focus-ring rounded-full hover:text-striker-magenta" href="/admin/submissions">
      Submissions
    </Link>
  );
}
