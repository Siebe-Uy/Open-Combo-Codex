import Link from "next/link";
import { engines } from "@/data/engines";
import { getCurrentUser, isSupabaseConfigured } from "@/lib/supabase/server";
import { ComboEditor } from "@/components/editor/combo-editor";

export default async function EditorPage() {
  const user = await getCurrentUser();
  const contributor =
    user?.user_metadata.user_name ?? user?.user_metadata.preferred_username ?? user?.email?.split("@")[0] ?? "anonymous";

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
          </div>
        </div>
        <ComboEditor engines={engines} contributor={contributor} canSubmit={Boolean(user && isSupabaseConfigured())} />
      </div>
    </main>
  );
}
