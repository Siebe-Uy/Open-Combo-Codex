import type { CardPreview } from "@/lib/types";

export const doomzCards: Record<string, CardPreview> = {
  "DoomZ V Five - Amalthe": {
    name: "DoomZ V Five - Amalthe",
    type: "Effect Monster",
    description: "Searches DoomZ monsters on summon or destruction and converts equipped bodies into WIND Machine Xyz Monsters.",
  },
  "DoomZ VII Seven - Elara": {
    name: "DoomZ VII Seven - Elara",
    type: "Effect Monster",
    description: "Sets DoomZ Spell/Traps on summon or destruction and can become WIND Machine Xyz material when equipped.",
  },
  "DoomZ Break - Diactorus": {
    name: "DoomZ Break - Diactorus",
    type: "Xyz Monster",
    description: "Rank 4 DoomZ payoff that destroys DoomZ cards to destroy monsters and searches Equip Spells when destroyed.",
  },
  "Power Patron DoomZ": {
    name: "Power Patron DoomZ",
    type: "Effect Monster",
    description: "Xyz Summons DoomZ monsters using another Effect Monster, then equips itself to that Xyz Monster.",
  },
  "DoomZ Command \"D.O.O.M.D.U.R.G.\"": {
    name: "DoomZ Command \"D.O.O.M.D.U.R.G.\"",
    type: "Equip Spell",
    description: "Gives DoomZ pressure, targeting protection, ATK gain, direct attack access, and self-destruction timing.",
  },
  "DoomZ Destruction": {
    name: "DoomZ Destruction",
    type: "Trap",
    description: "Equips to a DoomZ Xyz to stop non-draw deck-to-hand adding and floats into DoomZ equips when destroyed.",
  },
  "DoomZ Raiders": {
    name: "DoomZ Raiders",
    type: "Continuous Spell",
    description: "Destroys another DoomZ card to add or Special Summon a DoomZ monster, and destroys a monster if destroyed.",
  },
  "DoomZ Change": {
    name: "DoomZ Change",
    type: "Normal Spell",
    description: "Destroys a DoomZ card from hand, Deck, or field and can recover/summon DoomZ cards when destroyed.",
  },
};

export const doomzCardNames = Object.keys(doomzCards);
