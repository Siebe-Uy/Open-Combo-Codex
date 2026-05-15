"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function ModeratorNavLink() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      return;
    }

    const supabase = createClient();

    if (!supabase) {
      return;
    }

    async function syncModeratorNav(userId: string | undefined) {
      if (!userId) {
        setShow(false);
        return;
      }

      const { data } = await supabase.from("profiles").select("role").eq("id", userId).maybeSingle();
      const role = data?.role;

      setShow(role === "moderator" || role === "admin");
    }

    supabase.auth.getUser().then(({ data }) => syncModeratorNav(data.user?.id));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      syncModeratorNav(session?.user?.id);
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
