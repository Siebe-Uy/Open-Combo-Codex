"use client";

import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { useNavRoles } from "@/components/nav/nav-roles-context";

export function EditorNavLink() {
  const { signedIn } = useNavRoles();

  if (!isSupabaseConfigured() || !signedIn) {
    return null;
  }

  return (
    <Link className="focus-ring rounded-full hover:text-white" href="/editor">
      Editor
    </Link>
  );
}
