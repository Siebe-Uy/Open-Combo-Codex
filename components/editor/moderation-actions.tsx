"use client";

import { useState } from "react";
import { Check, MessageSquareWarning, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ComboSubmissionStatus } from "@/lib/supabase/types";

export function ModerationActions({ submissionId }: { submissionId: string }) {
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function review(nextStatus: ComboSubmissionStatus) {
    const response = await fetch(`/api/submissions/${submissionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus, reviewNotes: notes }),
    });

    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    setStatus(response.ok ? `Marked ${nextStatus}. Refresh to update the queue.` : data?.error ?? "Review failed.");
  }

  return (
    <div className="space-y-3">
      <textarea
        className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/60"
        rows={3}
        placeholder="Review notes for the contributor"
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
      />
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" onClick={() => review("approved")}>
          <Check className="h-4 w-4" />
          Approve
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={() => review("changes_requested")}>
          <MessageSquareWarning className="h-4 w-4" />
          Request changes
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => review("rejected")}>
          <X className="h-4 w-4" />
          Reject
        </Button>
      </div>
      {status ? <p className="text-sm text-slate-300">{status}</p> : null}
    </div>
  );
}
