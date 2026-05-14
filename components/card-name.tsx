"use client";

import Image from "next/image";
import * as Tooltip from "@radix-ui/react-tooltip";
import type { CardPreview } from "@/lib/types";

type CardNameProps = {
  name: string;
  cardPreviews: Record<string, CardPreview>;
};

export function CardName({ name, cardPreviews }: CardNameProps) {
  const card = cardPreviews[name];

  if (!card) {
    return <strong className="font-semibold text-white">{name}</strong>;
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
              <p className="text-sm font-bold text-white">{card.name}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-striker-magenta">{card.type}</p>
              <p className="text-sm leading-6 text-slate-300">{card.description}</p>
            </div>
            <Tooltip.Arrow className="fill-slate-950" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
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
