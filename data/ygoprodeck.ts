import type { CardPreview } from "@/lib/types";
import { brandedCardNames, brandedCards } from "@/data/branded-cards";
import { doomzCardNames, doomzCards } from "@/data/doomz-cards";
import { dracotailCardNames, dracotailCards } from "@/data/dracotail-cards";
import { kewlTuneCardNames, kewlTuneCards } from "@/data/kewl-tune-cards";
import { mitsurugiCardNames, mitsurugiCards } from "@/data/mitsurugi-cards";
import { skyStrikerCardNames, skyStrikerCards } from "@/data/sky-striker-cards";

const YGOPRODECK_API = "https://db.ygoprodeck.com/api/v7/cardinfo.php";

type YgoProDeckCard = {
  name: string;
  type: string;
  humanReadableCardType?: string;
  desc: string;
  card_images?: Array<{
    image_url?: string;
    image_url_small?: string;
    image_url_cropped?: string;
  }>;
};

type YgoProDeckResponse = {
  data?: YgoProDeckCard[];
};

function toCardPreview(card: YgoProDeckCard): CardPreview {
  return {
    name: card.name,
    type: card.humanReadableCardType ?? card.type,
    imageUrl: card.card_images?.[0]?.image_url,
    description: card.desc,
  };
}

async function fetchCardPreview(name: string): Promise<CardPreview | undefined> {
  const url = `${YGOPRODECK_API}?name=${encodeURIComponent(name)}`;

  try {
    const response = await fetch(url, {
      next: {
        revalidate: 60 * 60 * 24,
      },
    });

    if (!response.ok) {
      return undefined;
    }

    const payload = (await response.json()) as YgoProDeckResponse;
    const card = payload.data?.[0];

    return card ? toCardPreview(card) : undefined;
  } catch {
    return undefined;
  }
}

const fallbackCards: Record<string, CardPreview> = {
  ...skyStrikerCards,
  ...mitsurugiCards,
  ...kewlTuneCards,
  ...dracotailCards,
  ...brandedCards,
  ...doomzCards,
};

const defaultCardNames = [
  ...skyStrikerCardNames,
  ...mitsurugiCardNames,
  ...kewlTuneCardNames,
  ...dracotailCardNames,
  ...brandedCardNames,
  ...doomzCardNames,
];

export async function getYgoProDeckCardPreviews(cardNames = defaultCardNames) {
  const uniqueNames = Array.from(new Set(cardNames));
  const fetchedCards = await Promise.all(
    uniqueNames.map(async (name) => [name, await fetchCardPreview(name)] as const),
  );

  return fetchedCards.reduce<Record<string, CardPreview>>((cards, [requestedName, preview]) => {
    const fallback = fallbackCards[requestedName];
    const card = preview ?? fallback;

    if (!card) {
      return cards;
    }

    cards[requestedName] = card;
    return cards;
  }, {});
}
