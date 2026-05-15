import type { DeckList, ResourceLink } from "@/lib/types";

export const deckLists: DeckList[] = [
  {
    engineId: "sky-striker",
    name: "Sky Striker Core",
    description: "A compact engine package to start testing lines before tuning flex slots for a format.",
    groups: [
      {
        title: "Main Deck Core",
        cards: [
          "3 Sky Striker Ace - Raye",
          "1-2 Sky Striker Ace - Roze",
          "1 Sky Striker Mobilize - Engage!",
          "1 Sky Striker Mecha - Hornet Drones",
          "2-3 Sky Striker Maneuver - Linkage!",
          "1 Sky Striker Airspace - Area Zero",
          "1 Sky Striker Mecha Modules - Multirole",
          "2 Sky Striker Mecha - Widow Anchor",
          "1 Sky Striker Mecha - Shark Cannon",
        ],
      },
      {
        title: "Extra Deck Core",
        cards: [
          "1 Sky Striker Ace - Kagari",
          "3 Sky Striker Ace - Shizuku",
          "2 Sky Striker Ace - Hayate",
          "1 Sky Striker Ace - Kaina",
          "1 Sky Striker Ace - Zeke",
          "New support slots: Zero / Amatsu as format testing allows",
        ],
      },
    ],
  },
  {
    engineId: "kewl-tune",
    name: "Kewl Tune Core",
    description: "Tuner-focused package for Cue starters, Mix lines, and Loudness War interaction routes.",
    groups: [
      {
        title: "Engine Package",
        cards: [
          "3 Kewl Tune Cue",
          "2-3 Kewl Tune Mix",
          "1-2 Kewl Tune Loudness War",
          "1 Kewl Tune Synchro",
          "1 Kewl Tune JJ",
          "Playlist / field spell flex as format allows",
        ],
      },
      {
        title: "Support Slots",
        cards: [
          "Hand traps and board breakers",
          "Extra Synchro levels for B2B / disruption lines",
          "Called by the Grave where legal",
        ],
      },
    ],
  },
  {
    engineId: "dracotail",
    name: "Dracotail Core",
    description: "Fusion starters built around Lukias searches and Faimena setup lines.",
    groups: [
      {
        title: "Main Deck Core",
        cards: [
          "3 Dracotail Lukias",
          "2-3 Dracotail Faimena",
          "1-2 Dracotail Arthalion",
          "1 Dracotail Flame",
          "1 Dracotail Horn",
          "1 Dracotail Ketu",
        ],
      },
      {
        title: "Extra & Backrow",
        cards: [
          "Dracotail fusion targets for going first / second",
          "Dracotail backrow suite for setup protection",
          "Generic interaction and hand trap suite",
        ],
      },
    ],
  },
  {
    engineId: "branded",
    name: "Branded Core",
    description: "Albaz fusion access, Mirrorjade setup, and Branded in Red recovery lines.",
    groups: [
      {
        title: "Main Deck Core",
        cards: [
          "3 Aluber the Jester of Despia",
          "2-3 Branded Opening",
          "2 Branded Fusion",
          "1 Branded in Red",
          "Fallen of Albaz and Despia support as needed",
        ],
      },
      {
        title: "Extra Deck Core",
        cards: [
          "1 Mirrorjade the Iceblade Dragon",
          "Albion / Lubellion fusion line slots",
          "Generic fusion targets for going second",
        ],
      },
    ],
  },
  {
    engineId: "doomz",
    name: "DoomZ Core",
    description: "Xyz-focused shell for Amalthe starters, Diactorus setup, and Raiders pressure.",
    groups: [
      {
        title: "Main Deck Core",
        cards: [
          "3 DoomZ V Five - Amalthe",
          "2 DoomZ VII Seven - Elara",
          "1 DoomZ Break - Diactorus",
          "1 Power Patron DoomZ",
          "2 DoomZ Raiders",
        ],
      },
      {
        title: "Extra & Utility",
        cards: [
          "DoomZ Xyz climb targets",
          "Equip Spell / self-destruction support",
          "Hand traps and going-second breakers",
        ],
      },
    ],
  },
  {
    engineId: "mitsurugi",
    name: "Mitsurugi Core",
    description: "Ritual package for Aramasa starters, Prayers branches, and reactive control boards.",
    groups: [
      {
        title: "Main Deck Core",
        cards: [
          "3 Mitsurugi no Mikoto, Aramasa",
          "2 Mitsurugi no Mikoto, Saji",
          "2 Mitsurugi Ritual",
          "1 Mitsurugi Mirror",
          "1 Mitsurugi Great Purification",
          "1 Mitsurugi no Mikoto, Kusanagi",
        ],
      },
      {
        title: "Ritual Targets",
        cards: [
          "1 Futsu no Mitama no Mitsurugi",
          "1 Ame no Murakumo no Mitsurugi",
          "Habakiri / tribute-line flex as format allows",
        ],
      },
    ],
  },
  {
    engineId: "shared",
    name: "Sample Control Shell",
    description: "A baseline list shape for practicing tournament pacing, not a locked recommendation.",
    groups: [
      {
        title: "Interaction Suite",
        cards: [
          "Effect Veiler / Infinite Impermanence",
          "Ash Blossom & Joyous Spring",
          "Triple Tactics Talent / Thrust",
          "Book of Eclipse or board breaker slots",
        ],
      },
      {
        title: "Consistency And Utility",
        cards: [
          "Reinforcement of the Army",
          "Terraforming if legal",
          "Upstart Goblin where legal",
          "Called by the Grave where legal",
        ],
      },
    ],
  },
];

export const resourceLinks: ResourceLink[] = [
  {
    title: "Official Forbidden & Limited List",
    description: "Check legality before practicing a tournament line.",
    href: "https://www.yugioh-card.com/en/limited/",
  },
  {
    title: "YGOPRODeck Card Database",
    description: "Fast lookups for card text, printings, and public image URLs.",
    href: "https://ygoprodeck.com/card-database/",
  },
  {
    title: "Contribution Guide",
    description: "Add or correct combos by editing Markdown files in the repo.",
    href: "#contribute",
  },
];

export function getDeckListsForEngine(engineId: string) {
  if (engineId === "All") {
    return deckLists;
  }

  return deckLists.filter((deck) => deck.engineId === engineId || deck.engineId === "shared");
}
