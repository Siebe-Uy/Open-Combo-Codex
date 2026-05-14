"use client";

import Image from "next/image";
import { Check, ChevronDown, Copy, ExternalLink, Heart, Share2, Sparkles, UserRound } from "lucide-react";
import { motion } from "framer-motion";
import type { CardPreview, Combo } from "@/lib/types";
import { copyText, formatComboForClipboard } from "@/lib/clipboard";
import { cn } from "@/lib/utils";
import { useComboStore } from "@/store/use-combo-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { renderCardNames } from "@/components/card-name";
import { useState } from "react";

type ComboCardProps = {
  combo: Combo;
  cardPreviews: Record<string, CardPreview>;
};

export function ComboCard({ combo, cardPreviews }: ComboCardProps) {
  const { favoriteIds, toggleFavorite, expandedId, setExpandedId } = useComboStore();
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const isFavorite = favoriteIds.includes(combo.id);
  const isExpanded = expandedId === combo.id;
  const starterPreview = getComboStarterPreview(combo, cardPreviews);

  async function handleCopy() {
    const ok = await copyText(formatComboForClipboard(combo));
    setCopied(ok);
    window.setTimeout(() => setCopied(false), 1600);
  }

  async function handleShare() {
    const url = `${window.location.origin}${window.location.pathname}#${combo.id}`;

    if (navigator.share) {
      await navigator.share({ title: combo.title, url });
    } else {
      await copyText(url);
      setShared(true);
      window.setTimeout(() => setShared(false), 1600);
    }
  }

  return (
    <motion.article
      id={combo.id}
      layout
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      className="glass-panel overflow-hidden rounded-[2rem]"
    >
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-controls={`${combo.id}-panel`}
        onClick={() => setExpandedId(isExpanded ? undefined : combo.id)}
        className="focus-ring flex w-full flex-col gap-5 p-5 text-left sm:p-6"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 gap-4">
            <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-lg shadow-black/30 sm:h-32 sm:w-24">
              {starterPreview.imageUrl ? (
                <Image
                  src={starterPreview.imageUrl}
                  alt={`${starterPreview.name} card art`}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-300/20 via-violet-400/20 to-pink-400/20 p-3 text-center text-xs font-black uppercase tracking-[0.2em] text-white/70">
                  {starterPreview.name}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
            </div>

            <div className="min-w-0 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={combo.difficulty === "Advanced" ? "magenta" : combo.difficulty === "Intermediate" ? "violet" : "cyan"}>
                  {combo.difficulty}
                </Badge>
                <Badge tone={combo.otkPotential ? "green" : "slate"}>{combo.otkPotential ? "OTK potential" : combo.turnPreference}</Badge>
                <Badge>{combo.cardCount === 1 ? "1-card" : `${combo.cardCount}-card`}</Badge>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white">{combo.title}</h3>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-striker-cyan">
                Starter: {starterPreview.name}
              </p>
              <p className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <UserRound className="h-3.5 w-3.5 text-striker-magenta" />
                Added by <span className="font-semibold text-slate-200">@{combo.contributor}</span>
              </p>
              <p className="max-w-3xl text-sm leading-6 text-slate-300">
                {combo.prerequisites.join(" • ")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
              {combo.category}
            </span>
            <ChevronDown className={cn("h-5 w-5 text-slate-400 transition", isExpanded && "rotate-180 text-striker-cyan")} />
          </div>
        </div>
      </button>

      {isExpanded ? (
        <motion.div
          id={`${combo.id}-panel`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-white/10 px-5 pb-6 sm:px-6"
        >
          <div className="grid gap-6 pt-6 lg:grid-cols-[1.25fr_.75fr]">
            <div className="space-y-6">
              <section aria-labelledby={`${combo.id}-steps`}>
                <h4 id={`${combo.id}-steps`} className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-striker-cyan">
                  <Sparkles className="h-4 w-4" />
                  Line
                </h4>
                <ol className="space-y-3">
                  {combo.steps.map((step, index) => (
                    <li key={step} className="grid grid-cols-[2rem_1fr] gap-3 rounded-2xl bg-white/[0.03] p-3 text-sm leading-6 text-slate-200">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-striker-cyan/10 text-xs font-bold text-striker-cyan">
                        {index + 1}
                      </span>
                      <span>{renderCardNames(step, cardPreviews)}</span>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="rounded-3xl border border-cyan-300/15 bg-cyan-300/[0.04] p-4">
                <h4 className="text-sm font-bold text-white">End Board</h4>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {renderCardNames(combo.endBoard, cardPreviews)}
                </p>
              </section>
            </div>

            <aside className="space-y-4">
              <InfoBlock title="Key Notes" items={combo.notes} cardPreviews={cardPreviews} />
              <InfoBlock title="Variants" items={combo.variants} cardPreviews={cardPreviews} />
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
                <p className="font-semibold text-white">Open-source source</p>
                <p className="mt-2 text-sm text-slate-300">
                  Added by <span className="font-semibold text-white">@{combo.contributor}</span>
                </p>
                <p className="mt-2 font-mono text-xs text-striker-cyan">{combo.sourcePath}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="secondary" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy steps"}
                </Button>
                <Button type="button" variant="secondary" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                  {shared ? "Link copied" : "Share"}
                </Button>
                <Button type="button" variant={isFavorite ? "magenta" : "secondary"} size="sm" onClick={() => toggleFavorite(combo.id)}>
                  <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
                  Favorite
                </Button>
              </div>
              <div className="rounded-3xl border border-dashed border-white/15 p-4 text-sm text-slate-400">
                <div className="flex items-center gap-2 text-slate-200">
                  <ExternalLink className="h-4 w-4" />
                  Replay placeholder
                </div>
                <p className="mt-2">{combo.videoPlaceholder ?? combo.masterDuelNote}</p>
              </div>
            </aside>
          </div>
        </motion.div>
      ) : null}
    </motion.article>
  );
}

function InfoBlock({
  title,
  items,
  cardPreviews,
}: {
  title: string;
  items: string[];
  cardPreviews: Record<string, CardPreview>;
}) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
      <h4 className="text-sm font-bold text-white">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
        {items.map((item) => (
          <li key={item}>- {renderCardNames(item, cardPreviews)}</li>
        ))}
      </ul>
    </div>
  );
}

function getComboStarterPreview(combo: Combo, cardPreviews: Record<string, CardPreview>) {
  const starterName = combo.starterCards[0] ?? combo.cardNames[0] ?? combo.title;
  const starterPreview = cardPreviews[starterName];

  if (starterPreview?.imageUrl) {
    return starterPreview;
  }

  const firstImagePreview = combo.cardNames
    .map((cardName) => cardPreviews[cardName])
    .find((preview) => preview?.imageUrl);

  return firstImagePreview ?? starterPreview ?? { name: starterName, type: "Card", description: combo.title };
}
