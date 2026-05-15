"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useId, useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import type { CardPreview } from "@/lib/types";

type CardNameProps = {
  name: string;
  cardPreviews: Record<string, CardPreview>;
};

/** Touch / coarse-pointer devices: no reliable hover — use tap + overlay instead. */
function useTapModeForCardPreview() {
  const [tapMode, setTapMode] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    const apply = () => setTapMode(mq.matches);

    apply();
    mq.addEventListener("change", apply);

    return () => mq.removeEventListener("change", apply);
  }, []);

  return tapMode;
}

export function CardName({ name, cardPreviews }: CardNameProps) {
  const card = cardPreviews[name];
  const tapMode = useTapModeForCardPreview();

  if (!card) {
    return <strong className="font-semibold text-white">{name}</strong>;
  }

  if (tapMode) {
    return <CardNameTap card={card} />;
  }

  return (
    <Tooltip.Provider delayDuration={150}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <strong className="cursor-help rounded text-striker-cyan underline decoration-cyan-300/30 underline-offset-4">
            {name}
          </strong>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={8}
            className="z-50 w-72 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 text-left shadow-2xl shadow-cyan-950/40 backdrop-blur"
          >
            <CardTooltipBody card={card} />
            <Tooltip.Arrow className="fill-slate-950" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

function CardNameTap({ card }: { card: CardPreview }) {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="rounded font-semibold text-striker-cyan underline decoration-cyan-300/30 underline-offset-4"
        onClick={() => setOpen(true)}
      >
        {card.name}
      </button>

      {mounted && open
        ? createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <button
                type="button"
                className="absolute inset-0 bg-black/65 backdrop-blur-[2px]"
                aria-label="Close card details"
                onClick={() => setOpen(false)}
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="relative z-[101] max-h-[min(90vh,40rem)] w-full max-w-sm overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/98 shadow-2xl shadow-black/50"
                onClick={(event) => event.stopPropagation()}
              >
                <CardTooltipBody card={card} headingId={titleId} />
                <p className="border-t border-white/10 px-4 py-3 text-center text-xs text-slate-500">Tap outside to close</p>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

function CardTooltipBody({ card, headingId }: { card: CardPreview; headingId?: string }) {
  return (
    <>
      {card.imageUrl ? (
        <Image
          src={card.imageUrl}
          alt={card.name}
          width={220}
          height={320}
          className="mx-auto h-52 w-auto rounded-b-xl object-cover"
        />
      ) : null}
      <div className="space-y-2 p-4">
        <p id={headingId} className="text-sm font-bold text-white">
          {card.name}
        </p>
        <p className="text-xs uppercase tracking-[0.2em] text-striker-magenta">{card.type}</p>
        <p className="text-sm leading-6 text-slate-300">{card.description}</p>
      </div>
    </>
  );
}

export function renderCardNames(text: string, cardPreviews: Record<string, CardPreview>) {
  const cardNames = Object.keys(cardPreviews).sort((a, b) => b.length - a.length);
  const pattern = new RegExp(`(${cardNames.map(escapeRegex).join("|")})`, "g");
  const parts = text.split(pattern);

  return parts.map((part, index) =>
    cardPreviews[part] ? (
      <CardName key={`${part}-${index}`} name={part} cardPreviews={cardPreviews} />
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    ),
  );
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
