import type { CardPreview } from "@/lib/types";

export const dracotailCards: Record<string, CardPreview> = {
  "Dracotail Lukias": {
    name: "Dracotail Lukias",
    type: "Effect Monster",
    description: "Searches a Dracotail monster on summon and sets a Dracotail Spell/Trap when used as Fusion Material.",
  },
  "Dracotail Faimena": {
    name: "Dracotail Faimena",
    type: "Effect Monster",
    description: "Quick Effect discards itself to Fusion Summon a Dragon or Spellcaster Fusion Monster using hand or field.",
  },
  "Dracotail Mululu": {
    name: "Dracotail Mululu",
    type: "Effect Monster",
    description: "Quick Effect Fusion Summons a Dracotail Fusion and can negate an opponent monster when used as material.",
  },
  "Dracotail Pan": {
    name: "Dracotail Pan",
    type: "Effect Monster",
    description: "Sets Dracotail backrow and can destroy a monster when used as Fusion Material.",
  },
  "Dracotail Urgula": {
    name: "Dracotail Urgula",
    type: "Effect Monster",
    description: "Sets Dracotail backrow and can destroy a Spell/Trap when used as Fusion Material.",
  },
  "Dracotail Arthalion": {
    name: "Dracotail Arthalion",
    type: "Fusion Monster",
    description: "Fusion payoff that returns monsters from field or GY to hand based on hand materials used.",
  },
  "Dracotail Gulamel": {
    name: "Dracotail Gulamel",
    type: "Fusion Monster",
    description: "Fusion payoff that destroys an opponent card when you activate a Dracotail card or effect.",
  },
  "Ketu Dracotail": {
    name: "Ketu Dracotail",
    type: "Normal Spell",
    description: "Searches a Dracotail monster, then can Fusion Summon if the opponent controls a monster.",
  },
  "Dracotail Flame": {
    name: "Dracotail Flame",
    type: "Trap",
    description: "Negates a face-up Spell and can recycle a Dracotail card to draw.",
  },
  "Dracotail Horn": {
    name: "Dracotail Horn",
    type: "Trap",
    description: "Returns an Attack Position monster to hand or Extra Deck and can recycle a Dracotail card to draw.",
  },
};

export const dracotailCardNames = Object.keys(dracotailCards);
