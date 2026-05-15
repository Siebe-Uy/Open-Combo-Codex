import Link from "next/link";
import { redirect } from "next/navigation";
import { engines } from "@/data/engines";
import { getCurrentProfile, getCurrentUser, isSupabaseConfigured } from "@/lib/supabase/server";
import { ComboEditor } from "@/components/editor/combo-editor";

export default async function EditorPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  const profile = await getCurrentProfile();
  const contributor =
    profile?.username ??
    user.user_metadata?.user_name ??
    user.user_metadata?.preferred_username ??
    user.email?.split("@")[0] ??
    "contributor";

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link href="/" className="text-sm font-semibold text-striker-cyan">
              Back to codex
            </Link>
            <p className="mt-6 text-sm uppercase tracking-[0.3em] text-striker-magenta">Visual Editor</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight">Create a combo submission</h1>
            <p className="mt-3 max-w-2xl text-slate-400">
              Build a combo with structured fields, preview it live, export Markdown, or submit it to the moderation queue.
            </p>
            <p className="mt-2 text-sm text-striker-cyan">
              Contributing as <span className="font-semibold text-white">@{contributor}</span>
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-relaxed text-slate-300">
          <p className="font-semibold text-white">Where submissions go</p>
          <p className="mt-2">
            When someone submits from this editor, it is stored with status <strong className="text-slate-100">pending</strong> in Supabase
            (<code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-striker-cyan">combo_submissions</code>).{" "}
            <strong className="text-slate-100">Maintainers</strong> review them in the moderation UI at{" "}
            <Link href="/admin/submissions" className="font-semibold text-striker-cyan underline-offset-2 hover:underline">
              /admin/submissions
            </Link>{" "}
            (accounts with <code className="rounded bg-white/10 px-1 py-0.5 text-xs">profiles.role</code> set to{" "}
            <code className="rounded bg-white/10 px-1 py-0.5 text-xs">moderator</code> or{" "}
            <code className="rounded bg-white/10 px-1 py-0.5 text-xs">admin</code>). After approval, the combo appears on the public homepage with other combos.
          </p>
        </div>

        <ComboEditor engines={engines} contributor={contributor} canSubmit={isSupabaseConfigured()} />
      </div>
    </main>
  );
}
