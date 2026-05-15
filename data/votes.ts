import { createClient } from "@/lib/supabase/server";
import { getVoteKey, type VoteAggregateMap } from "@/lib/votes";
import type { Combo } from "@/lib/types";

export async function getVoteAggregates(combos: Combo[]): Promise<VoteAggregateMap> {
  const supabase = await createClient();

  if (!supabase || !combos.length) {
    return {};
  }

  const { data: userData } = await supabase.auth.getUser();
  const comboIds = combos.map((combo) => combo.id);
  const [{ data: totals }, { data: userVotes }] = await Promise.all([
    supabase.from("combo_vote_totals").select("*").in("combo_id", comboIds),
    userData.user
      ? supabase.from("combo_votes").select("combo_id, combo_source, vote").eq("user_id", userData.user.id).in("combo_id", comboIds)
      : Promise.resolve({ data: [] }),
  ]);

  const aggregates: VoteAggregateMap = {};

  combos.forEach((combo) => {
    const source = combo.source ?? "markdown";
    const total = totals?.find((item) => item.combo_id === combo.id && item.combo_source === source);
    const userVote = userVotes?.find((item) => item.combo_id === combo.id && item.combo_source === source);

    aggregates[getVoteKey(combo.id, source)] = {
      comboId: combo.id,
      comboSource: source,
      upvotes: total?.upvotes ?? 0,
      downvotes: total?.downvotes ?? 0,
      score: total?.score ?? 0,
      userVote: userVote?.vote ?? null,
    };
  });

  return aggregates;
}
