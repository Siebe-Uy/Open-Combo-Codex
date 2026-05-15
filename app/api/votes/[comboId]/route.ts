import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ComboSource, VoteValue } from "@/lib/supabase/types";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ comboId: string }> }) {
  const supabase = await createClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return NextResponse.json({ error: "Sign in to vote." }, { status: 401 });
  }

  const { comboId } = await params;
  const body = (await request.json()) as { vote?: VoteValue; comboSource?: ComboSource };
  const vote = body.vote;

  if (vote !== 1 && vote !== -1) {
    return NextResponse.json({ error: "Vote must be 1 or -1." }, { status: 400 });
  }

  const comboSource = body.comboSource ?? "markdown";
  const { error } = await supabase.from("combo_votes").upsert({
    user_id: data.user.id,
    combo_id: comboId,
    combo_source: comboSource,
    vote,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ comboId: string }> }) {
  const supabase = await createClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return NextResponse.json({ error: "Sign in to vote." }, { status: 401 });
  }

  const { comboId } = await params;
  const comboSource = (request.nextUrl.searchParams.get("source") ?? "markdown") as ComboSource;
  const { error } = await supabase
    .from("combo_votes")
    .delete()
    .eq("user_id", data.user.id)
    .eq("combo_id", comboId)
    .eq("combo_source", comboSource);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
