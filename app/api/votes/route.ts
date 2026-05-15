import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getVoteKey, type VoteAggregateMap } from "@/lib/votes";
import type { ComboSource } from "@/lib/supabase/types";

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  if (!supabase) {
    return NextResponse.json({ votes: {} satisfies VoteAggregateMap });
  }

  const ids = request.nextUrl.searchParams.get("ids")?.split(",").filter(Boolean) ?? [];
  const source = (request.nextUrl.searchParams.get("source") ?? "markdown") as ComboSource;

  if (!ids.length) {
    return NextResponse.json({ votes: {} satisfies VoteAggregateMap });
  }

  const { data: userData } = await supabase.auth.getUser();
  const [{ data: totals }, { data: userVotes }] = await Promise.all([
    supabase.from("combo_vote_totals").select("*").eq("combo_source", source).in("combo_id", ids),
    userData.user
      ? supabase
          .from("combo_votes")
          .select("combo_id, combo_source, vote")
          .eq("user_id", userData.user.id)
          .eq("combo_source", source)
          .in("combo_id", ids)
      : Promise.resolve({ data: [] }),
  ]);

  const votes: VoteAggregateMap = {};

  ids.forEach((comboId) => {
    const total = totals?.find((item) => item.combo_id === comboId);
    const userVote = userVotes?.find((item) => item.combo_id === comboId);

    votes[getVoteKey(comboId, source)] = {
      comboId,
      comboSource: source,
      upvotes: total?.upvotes ?? 0,
      downvotes: total?.downvotes ?? 0,
      score: total?.score ?? 0,
      userVote: userVote?.vote ?? null,
    };
  });

  return NextResponse.json({ votes });
}
