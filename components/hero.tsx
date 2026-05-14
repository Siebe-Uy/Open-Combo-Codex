"use client";

import { motion } from "framer-motion";
import { BookOpen, GitPullRequestArrow, Shuffle } from "lucide-react";
import type { Combo } from "@/lib/types";
import { useComboStore } from "@/store/use-combo-store";
import { Button } from "@/components/ui/button";

type HeroProps = {
  combos: Combo[];
  resultCount: number;
};

export function Hero({ combos, resultCount }: HeroProps) {
  const { filters, setFilter, setExpandedId } = useComboStore();
  const isSearching = filters.query.trim().length > 0;

  function openRandomCombo() {
    const combo = combos[Math.floor(Math.random() * combos.length)];
    setExpandedId(combo.id);
    document.getElementById(combo.id)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <section className="relative overflow-hidden px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="absolute inset-0 -z-10 bg-radial-grid" />
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
            <GitPullRequestArrow className="h-4 w-4" />
            Open-source combo docs, starting with Sky Striker
          </div>
          <div className="space-y-4">
            <h1 className="max-w-4xl text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
              Open Combo <span className="bg-gradient-to-r from-striker-cyan to-striker-magenta bg-clip-text text-transparent">Codex</span>
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300">
              A sleek, fast, tournament-ready Yu-Gi-Oh! combo browser where every route is easy to inspect,
              copy, favorite, and improve through Markdown pull requests.
            </p>
          </div>
          <div className="glass-panel flex flex-col gap-3 rounded-[2rem] p-3 sm:flex-row">
            <label className="sr-only" htmlFor="hero-search">
              Search combo library
            </label>
            <input
              id="hero-search"
              value={filters.query}
              onChange={(event) => setFilter("query", event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  document.getElementById("combos")?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              placeholder="Search Raye, Linkage, Widow Anchor..."
              className="focus-ring min-h-12 flex-1 rounded-full bg-slate-950/70 px-5 text-sm text-white placeholder:text-slate-500"
            />
            <Button type="button" onClick={() => document.getElementById("combos")?.scrollIntoView({ behavior: "smooth" })}>
              <BookOpen className="h-4 w-4" />
              Browse combos
            </Button>
            <Button type="button" variant="secondary" onClick={openRandomCombo}>
              <Shuffle className="h-4 w-4" />
              Random
            </Button>
          </div>
          {isSearching ? (
            <p className="px-2 text-sm text-slate-300">
              Found <span className="font-bold text-striker-cyan">{resultCount}</span> matching combos across all engines.
            </p>
          ) : null}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="glass-panel relative rounded-[2.5rem] p-6 shadow-glow"
        >
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-striker-magenta/20 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-striker-cyan/20 blur-3xl" />
          <p className="text-sm uppercase tracking-[0.3em] text-striker-magenta">YGO Combo Bible</p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {[
              ["Live combos", combos.length],
              ["Markdown files", combos.length],
              ["Starter cards", new Set(combos.flatMap((combo) => combo.starterCards)).size],
              ["Future engines", 3],
            ].map(([label, value]) => (
              <div key={label} className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-3xl font-black text-white">{value}</p>
                <p className="mt-1 text-sm text-slate-400">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-3xl border border-cyan-300/15 bg-cyan-300/[0.06] p-4 text-sm leading-6 text-cyan-50">
            Built for quick event checks: filter by starter, copy a line, favorite it, then submit clean
            Markdown improvements later.
          </div>
        </motion.div>
      </div>
    </section>
  );
}
