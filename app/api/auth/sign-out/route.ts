import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ?? "https://opencombocodex.com";

  return NextResponse.redirect(new URL("/", base.startsWith("http") ? base : `https://${base}`));
}
