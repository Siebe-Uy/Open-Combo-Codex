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
