"use client";

import { type CSSProperties, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import type { CardPreview, Combo, Engine } from "@/lib/types";
import { filterCombos } from "@/lib/search";
import { useComboStore } from "@/store/use-combo-store";
import { ComboCard } from "@/components/combo-card";
import { ContributionPanel } from "@/components/contribution-panel";
import { DeckResources } from "@/components/deck-resources";
import { EngineSelector } from "@/components/engine-selector";
import { FilterPanel } from "@/components/filter-panel";
import { Hero } from "@/components/hero";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import type { DeckList, ResourceLink } from "@/lib/types";
import { getVoteKey, sortCombosByVotes, type VoteAggregateMap } from "@/lib/votes";

const COMBOS_PER_PAGE = 6;

type ComboAppProps = {
  combos: Combo[];
  engines: Engine[];
  deckLists: DeckList[];
  resources: ResourceLink[];
  cardPreviews: Record<string, CardPreview>;
  initialVotes?: VoteAggregateMap;
};

export function ComboApp({ combos, engines, deckLists, resources, cardPreviews, initialVotes = {} }: ComboAppProps) {
  const { filters, favoriteIds, setExpandedId, setFilter } = useComboStore();
  const [currentPage, setCurrentPage] = useState(1);
  const selectedEngine = engines.find((engine) => engine.id === filters.engineId);
  const activeEngineId = selectedEngine?.id ?? "all-engines";
  const activeEngineName = selectedEngine?.name ?? "all engines";
  const activeEngineCombos = useMemo(
    () =>
      selectedEngine
        ? combos.filter((combo) => combo.engineId === selectedEngine.id)
        : combos,
    [combos, selectedEngine],
  );
  const activeBackgroundImage = useMemo(
    () => findEngineCardImage(activeEngineCombos, cardPreviews),
    [activeEngineCombos, cardPreviews],
  );
  const visibleCombos = useMemo(() => {
    const filteredCombos = filterCombos(combos, filters);

    const list = filters.favoritesOnly
      ? filteredCombos.filter((combo) => favoriteIds.includes(combo.id))
      : filteredCombos;

    return sortCombosByVotes(list, initialVotes);
  }, [combos, favoriteIds, filters, initialVotes]);
  const featuredCombos = useMemo(
    () => getFeaturedCombos(activeEngineCombos),
    [activeEngineCombos],
  );
  const totalPages = Math.max(1, Math.ceil(visibleCombos.length / COMBOS_PER_PAGE));
  const paginatedCombos = useMemo(
    () =>
      visibleCombos.slice(
        (currentPage - 1) * COMBOS_PER_PAGE,
        currentPage * COMBOS_PER_PAGE,
      ),
    [currentPage, visibleCombos],
  );
  const pageStart = visibleCombos.length ? (currentPage - 1) * COMBOS_PER_PAGE + 1 : 0;
  const pageEnd = Math.min(currentPage * COMBOS_PER_PAGE, visibleCombos.length);

  useEffect(() => {
    const id = window.location.hash.replace("#", "");

    if (id && combos.some((combo) => combo.id === id)) {
      setExpandedId(id);
      window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
    }
  }, [combos, setExpandedId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, favoriteIds]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  function goToPage(page: number) {
    setCurrentPage(page);
    document.getElementById("combos")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-slate-950 text-white">
      <EngineBackdrop
        engineId={activeEngineId}
        engineName={activeEngineName}
        imageUrl={activeBackgroundImage}
      />
      <SiteHeader />
      <Hero combos={combos} resultCount={visibleCombos.length} engineCount={engines.length} />
      <EngineSelector engines={engines} />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-striker-magenta">Featured</p>
            <h2 className="mt-2 text-3xl font-bold text-white">Start here tonight</h2>
          </div>
          <p className="text-sm text-slate-400">
            The highest-value routes for learning {activeEngineName} quickly.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {featuredCombos.map((combo) => (
            <a
              key={combo.id}
              href={`#${combo.id}`}
              className="focus-ring rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 transition hover:border-cyan-300/40 hover:bg-cyan-300/[0.06]"
            >
              <p className="text-xs uppercase tracking-[0.25em] text-striker-cyan">{combo.category}</p>
              <h3 className="mt-3 text-xl font-bold text-white">{combo.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{combo.endBoard}</p>
            </a>
          ))}
        </div>
      </section>

      <section id="combos" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-striker-cyan">Combos</p>
            <h2 className="mt-2 text-3xl font-bold text-white">
              {filters.query.trim() ? "Search results" : "Browse the codex"}
            </h2>
            {filters.query.trim() ? (
              <p className="mt-2 text-sm text-slate-400">
                Searching all engines for “{filters.query.trim()}”.
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => setFilter("favoritesOnly", !filters.favoritesOnly)}
            className="focus-ring flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300 transition hover:border-pink-300/40 hover:bg-pink-300/[0.08]"
            aria-pressed={filters.favoritesOnly}
          >
            <Star className="h-4 w-4 text-striker-magenta" />
            {filters.favoritesOnly ? "Showing favorites" : `${favoriteIds.length} favorites saved locally`}
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
          <FilterPanel combos={combos} resultCount={visibleCombos.length} />
          <div className="space-y-4">
            {visibleCombos.length ? (
              <>
                <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between">
                  <span>
                    Showing <span className="font-semibold text-white">{pageStart}-{pageEnd}</span> of{" "}
                    <span className="font-semibold text-white">{visibleCombos.length}</span> combos
                  </span>
                  <span className="text-slate-500">
                    By vote score · Page {currentPage} of {totalPages}
                  </span>
                </div>

                {paginatedCombos.map((combo) => (
                  <ComboCard
                    key={combo.id}
                    combo={combo}
                    cardPreviews={cardPreviews}
                    vote={initialVotes[getVoteKey(combo.id, combo.source ?? "markdown")]}
                  />
                ))}

                {totalPages > 1 ? (
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                  />
                ) : null}
              </>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel rounded-[2rem] p-8 text-center">
                <h3 className="text-2xl font-bold text-white">No matching combos</h3>
                <p className="mt-2 text-slate-400">Adjust your filters or add the missing route as a Markdown contribution.</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <DeckResources deckLists={deckLists} resources={resources} />
      <ContributionPanel />
      <SiteFooter />
    </main>
  );
}

function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pages = getPaginationPages(currentPage, totalPages);

  return (
    <nav
      className="glass-panel flex flex-col gap-3 rounded-[2rem] p-3 sm:flex-row sm:items-center sm:justify-between"
      aria-label="Combo pages"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08] disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </button>

      <div className="flex flex-wrap justify-center gap-2">
        {pages.map((page, index) =>
          page === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className="flex h-10 w-10 items-center justify-center text-slate-500">
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={`focus-ring h-10 min-w-10 rounded-full px-3 text-sm font-bold transition ${
                page === currentPage
                  ? "bg-striker-cyan text-slate-950"
                  : "border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]"
              }`}
            >
              {page}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.08] disabled:pointer-events-none disabled:opacity-40"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}

function EngineBackdrop({
  engineId,
  engineName,
  imageUrl,
}: {
  engineId: string;
  engineName: string;
  imageUrl?: string;
}) {
  const hue = hashEngineHue(engineId);
  const style = {
    "--engine-bg": `linear-gradient(120deg, hsl(${hue} 58% 5%) 0%, hsl(${(hue + 34) % 360} 56% 8%) 52%, hsl(${(hue + 72) % 360} 52% 6%) 100%)`,
    "--engine-card-image": imageUrl ? `url("${imageUrl}")` : "none",
    "--engine-primary-glow": `hsl(${hue} 92% 62% / 0.24)`,
    "--engine-secondary-glow": `hsl(${(hue + 46) % 360} 92% 62% / 0.18)`,
    "--engine-accent-glow": `hsl(${(hue + 92) % 360} 88% 58% / 0.16)`,
    "--engine-grid": `hsl(${hue} 90% 70% / 0.1)`,
    "--engine-orbit": `hsl(${(hue + 46) % 360} 90% 70% / 0.16)`,
  } as CSSProperties;

  return (
    <motion.div
      key={engineId}
      aria-hidden="true"
      className="engine-backdrop fixed inset-0 -z-10"
      style={style}
      initial={{ opacity: 0.7 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
    >
      <div className="engine-backdrop__card-art" />
      <div className="engine-backdrop__grid" />
      <div className="engine-backdrop__orb engine-backdrop__orb--primary" />
      <div className="engine-backdrop__orb engine-backdrop__orb--secondary" />
      <div className="engine-backdrop__orb engine-backdrop__orb--accent" />
      <div className="engine-backdrop__sigil">
        <span>{engineName}</span>
      </div>
    </motion.div>
  );
}

function findEngineCardImage(combos: Combo[], cardPreviews: Record<string, CardPreview>) {
  for (const combo of combos) {
    for (const cardName of combo.cardNames) {
      const imageUrl = cardPreviews[cardName]?.imageUrl;

      if (imageUrl) {
        return imageUrl;
      }
    }
  }

  return undefined;
}

function getFeaturedCombos(combos: Combo[]) {
  const categoryPriority = new Map([
    ["Beginner Combos", 0],
    ["Main Deck Starters", 1],
    ["Going First", 2],
    ["Going Second", 3],
    ["OTK Lines", 4],
    ["Grind Game", 5],
    ["Tricks & Tech", 6],
  ]);
  const difficultyPriority = new Map([
    ["Beginner", 0],
    ["Intermediate", 1],
    ["Advanced", 2],
  ]);

  return [...combos]
    .sort((a, b) => {
      const categoryScore =
        (categoryPriority.get(a.category) ?? 99) - (categoryPriority.get(b.category) ?? 99);

      if (categoryScore !== 0) {
        return categoryScore;
      }

      const difficultyScore =
        (difficultyPriority.get(a.difficulty) ?? 99) - (difficultyPriority.get(b.difficulty) ?? 99);

      if (difficultyScore !== 0) {
        return difficultyScore;
      }

      return a.cardCount - b.cardCount || a.title.localeCompare(b.title);
    })
    .slice(0, 3);
}

function getPaginationPages(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: Array<number | "ellipsis"> = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) {
    pages.push("ellipsis");
  }

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (end < totalPages - 1) {
    pages.push("ellipsis");
  }

  pages.push(totalPages);
  return pages;
}

function hashEngineHue(value: string) {
  const hash = [...value].reduce((total, character) => total + character.charCodeAt(0) * 17, 0);

  return hash % 360;
}
