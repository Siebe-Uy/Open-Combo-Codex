import { ComboApp } from "@/components/combo-app";
import { resourceLinks } from "@/data/decklists";
import { engines } from "@/data/engines";
import { getCombosFromMarkdown } from "@/data/combos";
import { getApprovedCombosFromDatabase } from "@/data/db-combos";
import { getVoteAggregates } from "@/data/votes";
import { getYgoProDeckCardPreviews } from "@/data/ygoprodeck";

export default async function Home() {
  const markdownCombos = getCombosFromMarkdown();
  const databaseCombos = await getApprovedCombosFromDatabase();
  const combos = [...markdownCombos, ...databaseCombos];
  const comboCardNames = combos.flatMap((combo) => combo.cardNames);
  const [cardPreviews, initialVotes] = await Promise.all([
    getYgoProDeckCardPreviews(comboCardNames),
    getVoteAggregates(combos),
  ]);

  return (
    <ComboApp
      combos={combos}
      engines={engines}
      resources={resourceLinks}
      cardPreviews={cardPreviews}
      initialVotes={initialVotes}
    />
  );
}
