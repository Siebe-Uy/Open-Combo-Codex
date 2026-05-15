import type { Combo } from "@/lib/types";
import type { ComboSource, VoteValue } from "@/lib/supabase/types";

export type VoteAggregate = {
  comboId: string;
  comboSource: ComboSource;
  upvotes: number;
  downvotes: number;
  score: number;
  userVote: VoteValue | null;
};

export type VoteAggregateMap = Record<string, VoteAggregate>;

export function getVoteKey(comboId: string, comboSource: ComboSource = "markdown") {
  return `${comboSource}:${comboId}`;
}

export function getComboVoteScore(combo: Combo, votes: VoteAggregateMap): number {
  const key = getVoteKey(combo.id, combo.source ?? "markdown");
  return votes[key]?.score ?? 0;
}

/** Highest score first; ties broken by upvotes, then title. */
export function sortCombosByVotes(combos: Combo[], votes: VoteAggregateMap): Combo[] {
  return [...combos].sort((a, b) => {
    const keyA = getVoteKey(a.id, a.source ?? "markdown");
    const keyB = getVoteKey(b.id, b.source ?? "markdown");
    const va = votes[keyA];
    const vb = votes[keyB];
    const scoreA = va?.score ?? 0;
    const scoreB = vb?.score ?? 0;

    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }

    const upA = va?.upvotes ?? 0;
    const upB = vb?.upvotes ?? 0;

    if (upB !== upA) {
      return upB - upA;
    }

    return a.title.localeCompare(b.title);
  });
}
