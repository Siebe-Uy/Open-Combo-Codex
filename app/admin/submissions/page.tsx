import Link from "next/link";
import { createClient, getCurrentProfile } from "@/lib/supabase/server";
import { ModerationActions } from "@/components/editor/moderation-actions";
import type { ComboInput } from "@/lib/schemas/combo";

type PendingSubmission = {
  id: string;
  status: string;
  combo: unknown;
  review_notes: string | null;
  created_at: string;
  profiles: { username: string; display_name: string | null } | { username: string; display_name: string | null }[] | null;
};

export default async function AdminSubmissionsPage() {
  const profile = await getCurrentProfile();

  if (!profile || !["moderator", "admin"].includes(profile.role)) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-12 text-white">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
          <Link href="/" className="text-sm font-semibold text-striker-cyan">
            Back to codex
          </Link>
          <h1 className="mt-6 text-3xl font-black">Moderator access required</h1>
          <p className="mt-3 text-slate-400">Sign in with a moderator or admin profile to review combo submissions.</p>
        </div>
      </main>
    );
  }

  const supabase = await createClient();
  const { data } = supabase
    ? await supabase
        .from("combo_submissions")
        .select("id, status, combo, review_notes, created_at, profiles:author_id(username, display_name)")
        .eq("status", "pending")
        .order("created_at", { ascending: true })
    : { data: [] };
  const submissions = (data ?? []) as unknown as PendingSubmission[];

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Link href="/" className="text-sm font-semibold text-striker-cyan">
          Back to codex
        </Link>
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-striker-magenta">Moderation Queue</p>
          <h1 className="mt-3 text-4xl font-black">Pending combo submissions</h1>
        </div>

        {submissions?.length ? (
          <div className="space-y-4">
            {submissions.map((submission) => {
              const combo = submission.combo as unknown as ComboInput;
              const profileData = Array.isArray(submission.profiles) ? submission.profiles[0] : submission.profiles;

              return (
                <article key={submission.id} className="glass-panel grid gap-5 rounded-[2rem] p-5 lg:grid-cols-[1fr_20rem]">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-striker-cyan">{combo.engineId}</p>
                    <h2 className="mt-2 text-2xl font-bold">{combo.title}</h2>
                    <p className="mt-2 text-sm text-slate-400">
                      By @{profileData?.username ?? combo.contributor} • {combo.category} • {combo.difficulty}
                    </p>
                    <ol className="mt-4 space-y-2 text-sm text-slate-200">
                      {combo.steps.map((step: string, index: number) => (
                        <li key={`${step}-${index}`} className="rounded-2xl bg-white/[0.04] p-3">
                          {index + 1}. {step}
                        </li>
                      ))}
                    </ol>
                    <p className="mt-4 text-sm text-slate-300">
                      <span className="font-semibold text-white">End board:</span> {combo.endBoard}
                    </p>
                  </div>
                  <ModerationActions submissionId={submission.id} />
                </article>
              );
            })}
          </div>
        ) : (
          <div className="glass-panel rounded-[2rem] p-8 text-slate-300">No pending submissions.</div>
        )}
      </div>
    </main>
  );
}
