import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { normalizeComboInput } from "@/lib/schemas/combo";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.json({ error: "Sign in to submit combos." }, { status: 401 });
  }

  const { data: profile } = await supabase.from("profiles").select("username").eq("id", userData.user.id).maybeSingle();

  const contributor =
    profile?.username ??
    userData.user.user_metadata?.user_name ??
    userData.user.user_metadata?.preferred_username ??
    userData.user.email?.split("@")[0] ??
    "contributor";

  const body = await request.json();
  const parsed = normalizeComboInput({ ...body, contributor });
  const { data, error } = await supabase
    .from("combo_submissions")
    .insert({
      author_id: userData.user.id,
      status: "pending",
      combo: parsed,
      submitted_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ id: data.id });
}
