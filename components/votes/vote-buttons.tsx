"use client";

import { useState } from "react";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ComboSource, VoteValue } from "@/lib/supabase/types";
import type { VoteAggregate } from "@/lib/votes";

type VoteButtonsProps = {
  comboId: string;
  comboSource?: ComboSource;
  initialVote?: VoteAggregate;
};

const emptyVote: VoteAggregate = {
  comboId: "",
  comboSource: "markdown",
  upvotes: 0,
  downvotes: 0,
  score: 0,
  userVote: null,
};

export function VoteButtons({ comboId, comboSource = "markdown", initialVote }: VoteButtonsProps) {
  const [vote, setVote] = useState<VoteAggregate>({
    ...emptyVote,
    ...initialVote,
    comboId,
    comboSource,
  });
  const [message, setMessage] = useState<string | null>(null);

  async function submitVote(nextVote: VoteValue) {
    setMessage(null);
    const previous = vote;
    const userVote = vote.userVote === nextVote ? null : nextVote;
    const optimistic = applyVoteChange(vote, userVote);
    setVote(optimistic);

    const response = await fetch(`/api/votes/${encodeURIComponent(comboId)}${userVote ? "" : `?source=${comboSource}`}`, {
      method: userVote ? "PUT" : "DELETE",
      headers: userVote ? { "Content-Type": "application/json" } : undefined,
      body: userVote ? JSON.stringify({ vote: userVote, comboSource }) : undefined,
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setVote(previous);
      setMessage(data?.error ?? "Could not save vote.");
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant={vote.userVote === 1 ? "magenta" : "secondary"}
          size="sm"
          onClick={() => submitVote(1)}
          aria-label="Upvote combo"
        >
          <ArrowBigUp className={cn("h-4 w-4", vote.userVote === 1 && "fill-current")} />
          {vote.upvotes}
        </Button>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-slate-200">
          {vote.score > 0 ? `+${vote.score}` : vote.score}
        </span>
        <Button
          type="button"
          variant={vote.userVote === -1 ? "magenta" : "secondary"}
          size="sm"
          onClick={() => submitVote(-1)}
          aria-label="Downvote combo"
        >
          <ArrowBigDown className={cn("h-4 w-4", vote.userVote === -1 && "fill-current")} />
          {vote.downvotes}
        </Button>
      </div>
      {message ? <p className="text-xs text-amber-200">{message}</p> : null}
    </div>
  );
}

function applyVoteChange(vote: VoteAggregate, nextUserVote: VoteValue | null): VoteAggregate {
  const withoutPrevious = {
    ...vote,
    upvotes: vote.upvotes - (vote.userVote === 1 ? 1 : 0),
    downvotes: vote.downvotes - (vote.userVote === -1 ? 1 : 0),
  };

  const next = {
    ...withoutPrevious,
    upvotes: withoutPrevious.upvotes + (nextUserVote === 1 ? 1 : 0),
    downvotes: withoutPrevious.downvotes + (nextUserVote === -1 ? 1 : 0),
    userVote: nextUserVote,
  };

  return {
    ...next,
    score: next.upvotes - next.downvotes,
  };
}
