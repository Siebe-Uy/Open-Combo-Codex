import type { DeckList, ResourceLink } from "@/lib/types";

export const deckLists: DeckList[] = [
  {
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
