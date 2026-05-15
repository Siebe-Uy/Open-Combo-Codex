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

  const parsed = normalizeComboInput(await request.json());
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
