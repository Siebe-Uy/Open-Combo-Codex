import { ExternalLink } from "lucide-react";
import type { DeckList, ResourceLink } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

type DeckResourcesProps = {
  deckLists: DeckList[];
  resources: ResourceLink[];
};

export function DeckResources({ deckLists, resources }: DeckResourcesProps) {
  return (
    <section id="resources" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-striker-magenta">Deck Lists / Resources</p>
          <h2 className="mt-2 text-3xl font-bold text-white">Practice from a real shell</h2>
        </div>
        <Badge tone="cyan">Banlist-sensitive</Badge>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_.8fr]">
        <div className="grid gap-5">
          {deckLists.map((deck) => (
            <article key={deck.name} className="glass-panel rounded-[2rem] p-5">
              <h3 className="text-2xl font-bold text-white">{deck.name}</h3>
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
          ))}
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
