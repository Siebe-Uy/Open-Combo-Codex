import type { CardPreview } from "@/lib/types";

export const brandedCards: Record<string, CardPreview> = {
  "Branded Fusion": {
    name: "Branded Fusion",
    type: "Normal Spell",
    description: "Fusion Summons a monster that mentions Fallen of Albaz using materials from hand, Deck, or field.",
  },
  "Fallen of Albaz": {
    name: "Fallen of Albaz",
    type: "Effect Monster",
    description: "On summon, can discard a card to Fusion Summon using itself and monsters on either field.",
  },
  "Aluber the Jester of Despia": {
    name: "Aluber the Jester of Despia",
    type: "Effect Monster",
    description: "Searches Branded Spell/Traps on summon and can revive to negate an opponent monster.",
  },
  "Albion the Branded Dragon": {
    name: "Albion the Branded Dragon",
    type: "Fusion Monster",
    description: "Fusion Summons again by banishing materials and can set or add Branded backrow in the End Phase.",
  },
  "Lubellion the Searing Dragon": {
    name: "Lubellion the Searing Dragon",
    type: "Fusion Monster",
    description: "Discards to Fusion Summon by shuffling materials from field, GY, or banishment into the Deck.",
  },
  "Mirrorjade the Iceblade Dragon": {
    name: "Mirrorjade the Iceblade Dragon",
    type: "Fusion Monster",
    description: "Quick Effect sends an Albaz Fusion from Extra Deck to banish a monster.",
  },
  "Branded Opening": {
    name: "Branded Opening",
    type: "Quick-Play Spell",
    description: "Discards to add or Special Summon a Despia monster and protects Fusion Monsters from destruction.",
  },
  "Branded in Red": {
    name: "Branded in Red",
    type: "Quick-Play Spell",
    description: "Recovers a Despia or Fallen of Albaz from GY, then can Fusion Summon a Level 8 or higher Fusion Monster.",
  },
};

export const brandedCardNames = Object.keys(brandedCards);
