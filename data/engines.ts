import type { Engine } from "@/lib/types";

export const engines: Engine[] = [
  {
    id: "kewl-tune",
    name: "Kewl Tune",
    tagline: "Rank #1 on YGOPRODeck",
    status: "Live",
    tierRank: 1,
    tierLabel: "Competitive",
    description:
      "Tuner-only Synchro routes, hand-material sequencing, and opponent-turn Loudness War interaction lines.",
  },
  {
    id: "dracotail",
    name: "Dracotail",
    tagline: "Rank #2 on YGOPRODeck",
    status: "Live",
    tierRank: 2,
    tierLabel: "Competitive",
    description:
      "Fusion routes built around hand materials, Quick Effect fusion timing, and Dracotail backrow setup.",
  },
  {
    id: "branded",
    name: "Branded",
    tagline: "Rank #3 on YGOPRODeck",
    status: "Live",
    tierRank: 3,
    tierLabel: "Competitive",
    description:
      "Albaz Fusion sequencing, Mirrorjade setup, and Branded resource loops for flexible midrange play.",
  },
  {
    id: "doomz",
    name: "DoomZ",
    tagline: "Rank #4 on YGOPRODeck",
    status: "Live",
    tierRank: 4,
    tierLabel: "Competitive",
    description:
      "Xyz-focused lines using self-destruction, Equip Spell pressure, and DoomZ card recursion.",
  },
  {
    id: "sky-striker",
    name: "Sky Striker",
    tagline: "Rank #5 on YGOPRODeck",
    status: "Live",
    tierRank: 5,
    tierLabel: "Competitive",
    description:
      "Compact one-card lines, tempo loops, Linkage pushes, and tournament notes for the Sky Striker engine.",
  },
  {
    id: "mitsurugi",
    name: "Mitsurugi",
    tagline: "Rank #6 on YGOPRODeck",
    status: "Live",
    tierRank: 6,
    tierLabel: "Competitive",
    description:
      "Ritual sequencing, tribute-trigger chains, Prayers branches, and reactive Reptile boards.",
  },
];
