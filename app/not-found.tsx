import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="glass-panel max-w-md rounded-3xl p-8 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-striker-cyan">404</p>
        <h1 className="mt-3 text-3xl font-semibold">Combo line not found</h1>
        <p className="mt-3 text-sm text-slate-300">
          This route has left the Extra Monster Zone.
        </p>
        <Link
          href="/"
          className="focus-ring mt-6 inline-flex rounded-full bg-striker-cyan px-5 py-3 text-sm font-bold text-slate-950"
        >
          Return to codex
        </Link>
      </div>
    </main>
  );
}
