"use client";

import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import type { Combo, ComboCategory, Difficulty, TurnPreference } from "@/lib/types";
import { useComboStore } from "@/store/use-combo-store";
import { Button } from "@/components/ui/button";

const categories: Array<"All" | ComboCategory> = [
  "All",
  "Beginner Combos",
  "Main Deck Starters",
  "OTK Lines",
  "Going First",
  "Going Second",
  "Tricks & Tech",
  "Grind Game",
];
const difficulties: Array<"All" | Difficulty> = ["All", "Beginner", "Intermediate", "Advanced"];
const turns: Array<"All" | TurnPreference> = ["All", "Going First", "Going Second", "Either"];
const counts = ["All", "1", "2", "3+"] as const;

type FilterPanelProps = {
  combos: Combo[];
  resultCount: number;
};

export function FilterPanel({ combos, resultCount }: FilterPanelProps) {
  const { filters, setFilter, resetFilters } = useComboStore();
  const starters = ["All", ...Array.from(new Set(combos.flatMap((combo) => combo.starterCards))).sort()];

  return (
    <aside className="glass-panel sticky top-4 rounded-[2rem] p-4 lg:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-striker-cyan">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </p>
          <p className="mt-1 text-sm text-slate-400">{resultCount} visible combos</p>
        </div>
        <Button type="button" variant="ghost" size="icon" aria-label="Reset filters" onClick={resetFilters}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <label className="mt-5 block">
        <span className="sr-only">Search all combos</span>
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/70 px-4">
          <Search className="h-4 w-4 text-slate-500" />
          <input
            value={filters.query}
            onChange={(event) => setFilter("query", event.target.value)}
            placeholder="Search cards, notes, routes..."
            className="focus-ring h-12 w-full bg-transparent text-sm text-white placeholder:text-slate-500"
          />
        </div>
      </label>

      <div className="mt-5 grid gap-4">
        <Select label="Category" value={filters.category} values={categories} onChange={(value) => setFilter("category", value as typeof filters.category)} />
        <Select label="Starter card" value={filters.starter} values={starters} onChange={(value) => setFilter("starter", value)} />
        <Select label="Difficulty" value={filters.difficulty} values={difficulties} onChange={(value) => setFilter("difficulty", value as typeof filters.difficulty)} />
        <Select label="Turn" value={filters.turnPreference} values={turns} onChange={(value) => setFilter("turnPreference", value as typeof filters.turnPreference)} />
        <Select label="Cards used" value={filters.cardCount} values={[...counts]} onChange={(value) => setFilter("cardCount", value as typeof filters.cardCount)} />
        <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200">
          OTK potential only
          <input
            type="checkbox"
            checked={filters.otkOnly}
            onChange={(event) => setFilter("otkOnly", event.target.checked)}
            className="h-4 w-4 accent-cyan-300"
          />
        </label>
        <label className="flex items-center justify-between rounded-2xl border border-pink-300/20 bg-pink-300/[0.06] px-4 py-3 text-sm text-slate-200">
          Favorites only
          <input
            type="checkbox"
            checked={filters.favoritesOnly}
            onChange={(event) => setFilter("favoritesOnly", event.target.checked)}
            className="h-4 w-4 accent-pink-300"
          />
        </label>
      </div>
    </aside>
  );
}

function Select({
  label,
  value,
  values,
  onChange,
}: {
  label: string;
  value: string;
  values: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium text-slate-300">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring h-11 rounded-2xl border border-white/10 bg-slate-950/80 px-3 text-sm text-white"
      >
        {values.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </label>
  );
}
