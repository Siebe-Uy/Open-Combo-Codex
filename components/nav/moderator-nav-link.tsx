"use client";

import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { useNavRoles } from "@/components/nav/nav-roles-context";

export function ModeratorNavLink() {
  const { showModeratorNav } = useNavRoles();

  if (!isSupabaseConfigured() || !showModeratorNav) {
    return null;
  }

  return (
    <Link className="focus-ring rounded-full hover:text-striker-magenta" href="/admin/submissions">
      Submissions
    </Link>
  );
}
