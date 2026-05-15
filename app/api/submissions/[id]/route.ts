import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ComboSubmissionStatus } from "@/lib/supabase/types";

const reviewStatuses = new Set<ComboSubmissionStatus>(["approved", "changes_requested", "rejected"]);

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.json({ error: "Sign in to review submissions." }, { status: 401 });
  }

  const { data: profileData } = await supabase.from("profiles").select("role").eq("id", userData.user.id).maybeSingle();
  const profile = profileData as { role: string } | null;

  if (!profile || !["moderator", "admin"].includes(profile.role)) {
    return NextResponse.json({ error: "Moderator access required." }, { status: 403 });
  }

  const body = (await request.json()) as { status?: ComboSubmissionStatus; reviewNotes?: string };

  if (!body.status || !reviewStatuses.has(body.status)) {
    return NextResponse.json({ error: "Invalid review status." }, { status: 400 });
  }

  const { id } = await params;
  const { error } = await supabase
    .from("combo_submissions")
    .update({
      status: body.status,
      review_notes: body.reviewNotes ?? null,
      reviewer_id: userData.user.id,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
