"use client";

import { useEffect, useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import type { DeckList, ResourceLink } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { PaginationControls } from "@/components/pagination-controls";

const DECK_LISTS_PER_PAGE = 2;

type DeckResourcesProps = {
  deckLists: DeckList[];
  resources: ResourceLink[];
  engineName?: string;
  showAllEngines?: boolean;
};

export function DeckResources({ deckLists, resources, engineName, showAllEngines }: DeckResourcesProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const paginate = Boolean(showAllEngines && deckLists.length > DECK_LISTS_PER_PAGE);
  const totalPages = paginate ? Math.max(1, Math.ceil(deckLists.length / DECK_LISTS_PER_PAGE)) : 1;

  const visibleDeckLists = useMemo(() => {
    if (!paginate) {
      return deckLists;
    }

    const start = (currentPage - 1) * DECK_LISTS_PER_PAGE;
    return deckLists.slice(start, start + DECK_LISTS_PER_PAGE);
  }, [currentPage, deckLists, paginate]);

  const pageStart = deckLists.length ? (currentPage - 1) * DECK_LISTS_PER_PAGE + 1 : 0;
  const pageEnd = paginate
    ? Math.min(currentPage * DECK_LISTS_PER_PAGE, deckLists.length)
    : deckLists.length;

  useEffect(() => {
    setCurrentPage(1);
  }, [showAllEngines, deckLists.length]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  function goToPage(page: number) {
    setCurrentPage(page);
    document.getElementById("resources")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const heading = engineName ? `Practice from a real ${engineName} shell` : "Practice from a real shell";
  const subtitle = showAllEngines
    ? "Sample shells for every live engine, plus a generic interaction package."
    : engineName
      ? `Core cards and flex slots for ${engineName} lines in this codex.`
      : "Select an engine above to see its practice shell.";

  return (
    <section id="resources" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-striker-magenta">Deck Lists / Resources</p>
          <h2 className="mt-2 text-3xl font-bold text-white">{heading}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{subtitle}</p>
        </div>
        <Badge tone="cyan">Banlist-sensitive</Badge>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_.8fr]">
        <div className="grid gap-5">
          {deckLists.length ? (
            <>
              {paginate ? (
                <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between">
                  <span>
                    Showing <span className="font-semibold text-white">{pageStart}-{pageEnd}</span> of{" "}
                    <span className="font-semibold text-white">{deckLists.length}</span> shells
                  </span>
                  <span className="text-slate-500">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
              ) : null}

              {visibleDeckLists.map((deck) => (
                <DeckListCard key={`${deck.engineId}-${deck.name}`} deck={deck} showAllEngines={showAllEngines} />
              ))}

              {paginate && totalPages > 1 ? (
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                  ariaLabel="Deck list pages"
                />
              ) : null}
            </>
          ) : (
            <div className="glass-panel rounded-[2rem] p-8 text-slate-300">
              {engineName
                ? `No sample shell is listed for ${engineName} yet.`
                : "Pick an engine in the library section to load its practice shell."}
            </div>
          )}
        </div>

        <aside className="glass-panel rounded-[2rem] p-5">
          <h3 className="text-2xl font-bold text-white">Helpful links</h3>
          <div className="mt-5 grid gap-3">
            {resources.map((resource) => (
              <a
                key={resource.title}
                href={resource.href}
                className="focus-ring group rounded-3xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.07]"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-white">{resource.title}</p>
                  <ExternalLink className="h-4 w-4 text-slate-500 transition group-hover:text-striker-cyan" />
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">{resource.description}</p>
              </a>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

function DeckListCard({ deck, showAllEngines }: { deck: DeckList; showAllEngines?: boolean }) {
  return (
    <article className="glass-panel rounded-[2rem] p-5">
      {showAllEngines ? (
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-striker-cyan">
          {formatEngineLabel(deck.engineId)}
        </p>
      ) : null}
      <h3 className={showAllEngines ? "mt-2 text-2xl font-bold text-white" : "text-2xl font-bold text-white"}>
        {deck.name}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{deck.description}</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {deck.groups.map((group) => (
          <div key={group.title} className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
            <h4 className="font-semibold text-white">{group.title}</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {group.cards.map((card) => (
                <li key={card}>- {card}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </article>
  );
}

function formatEngineLabel(engineId: string) {
  if (engineId === "shared") {
    return "All engines";
  }

  return engineId
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
