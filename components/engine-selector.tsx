"use client";

import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import type { Engine } from "@/lib/types";
import { useComboStore } from "@/store/use-combo-store";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type EngineSelectorProps = {
  engines: Engine[];
};

export function EngineSelector({ engines }: EngineSelectorProps) {
  const { filters, setFilter } = useComboStore();

  return (
    <section id="engines" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-striker-cyan">Engines</p>
          <h2 className="mt-2 text-3xl font-bold text-white">Pick a library</h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-slate-400">
          Ordered by the current YGOPRODeck tournament archetype ranking when available, with unranked roadmap engines last.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {engines.map((engine, index) => {
          const active = filters.engineId === engine.id;
          const accentStyle = getEngineAccentStyle(engine.id);

          return (
            <motion.button
              type="button"
              key={engine.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              viewport={{ once: true }}
              disabled={engine.status !== "Live"}
              onClick={() => setFilter("engineId", engine.id)}
              className={cn(
                "focus-ring group min-h-48 rounded-[2rem] border p-5 text-left transition",
                active ? "border-cyan-300/50 bg-cyan-300/10 shadow-glow" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]",
                engine.status !== "Live" && "opacity-70",
              )}
            >
              <div
                className="mb-5 h-1.5 w-24 rounded-full"
                style={accentStyle}
              />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-bold text-white">{engine.name}</h3>
                  <p className="mt-1 text-sm text-slate-400">{engine.tagline}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {engine.tierRank ? (
                    <Badge tone="magenta">#{engine.tierRank}</Badge>
                  ) : null}
                  <Badge tone={engine.status === "Live" ? "cyan" : "slate"}>{engine.status}</Badge>
                </div>
              </div>
              {engine.tierLabel ? (
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.22em] text-striker-cyan">
                  {engine.tierLabel} tournament archetype
                </p>
              ) : null}
              <p className="mt-5 text-sm leading-6 text-slate-300">{engine.description}</p>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

function getEngineAccentStyle(engineId: string): CSSProperties {
  const hue = hashEngineHue(engineId);

  return {
    background: `linear-gradient(90deg, hsl(${hue} 95% 78%), hsl(${(hue + 38) % 360} 92% 62%), hsl(${(hue + 78) % 360} 88% 58%))`,
  };
}

function hashEngineHue(value: string) {
  const hash = [...value].reduce((total, character) => total + character.charCodeAt(0) * 17, 0);

  return hash % 360;
}
