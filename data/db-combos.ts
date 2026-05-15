import { createClient } from "@/lib/supabase/server";
import { comboInputSchema } from "@/lib/schemas/combo";
import type { Combo } from "@/lib/types";

type ApprovedSubmission = {
  id: string;
  combo: unknown;
  profiles: { username: string } | { username: string }[] | null;
};

export async function getApprovedCombosFromDatabase(): Promise<Combo[]> {
  const supabase = await createClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("combo_submissions")
    .select("id, combo, profiles:author_id(username)")
    .eq("status", "approved")
    .order("reviewed_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  const submissions = data as unknown as ApprovedSubmission[];

  return submissions.flatMap((submission) => {
    const parsed = comboInputSchema.safeParse(submission.combo);

    if (!parsed.success) {
      return [];
    }

    const profile = Array.isArray(submission.profiles) ? submission.profiles[0] : submission.profiles;

    return {
      ...parsed.data,
      id: submission.id,
      source: "submission",
      contributor: profile?.username ?? parsed.data.contributor,
      sourcePath: `supabase:combo_submissions/${submission.id}`,
    } satisfies Combo;
  });
}
