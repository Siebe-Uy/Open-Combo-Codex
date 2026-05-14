import { ComboApp } from "@/components/combo-app";
import { deckLists, resourceLinks } from "@/data/decklists";
import { engines } from "@/data/engines";
import { getCombosFromMarkdown } from "@/data/combos";
import { getYgoProDeckCardPreviews } from "@/data/ygoprodeck";

export default async function Home() {
  const combos = getCombosFromMarkdown();
  const comboCardNames = combos.flatMap((combo) => combo.cardNames);
  const cardPreviews = await getYgoProDeckCardPreviews(comboCardNames);

  return (
    <ComboApp
      combos={combos}
      engines={engines}
      deckLists={deckLists}
      resources={resourceLinks}
      cardPreviews={cardPreviews}
    />
  );
}
