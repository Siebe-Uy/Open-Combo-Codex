import type { Engine } from "@/lib/types";

export const engines: Engine[] = [
  {
    id: "mitsurugi",
    name: "Mitsurugi",
    tagline: "Rank #6 on YGOPRODeck",
    status: "Live",
    tierRank: 6,
    tierLabel: "Tier 2",
    description:
      "Ritual sequencing, tribute-trigger chains, Prayers branches, and reactive Reptile boards.",
  },
  {
    id: "branded",
    name: "Branded",
    tagline: "Rank #7 on YGOPRODeck",
    status: "Coming Soon",
    tierRank: 7,
    tierLabel: "Tier 3",
    description: "Future home for fusion sequencing, end-board branches, and grind-game recursions.",
  },
  {
    id: "sky-striker",
    name: "Sky Striker",
    tagline: "Rank #8 on YGOPRODeck",
    status: "Live",
    tierRank: 8,
    tierLabel: "Tier 3",
    description:
      "Compact one-card lines, tempo loops, Linkage pushes, and tournament notes for the Sky Striker engine.",
  },
  {
    id: "snake-eye",
    name: "Snake-Eye",
    tagline: "Unranked in current excerpt",
    status: "Coming Soon",
    description: "A placeholder for contributors to add starter maps, Ash lines, and format-specific branches.",
  },
  {
    id: "tenpai",
    name: "Tenpai",
    tagline: "Unranked in current excerpt",
    status: "Coming Soon",
    description: "Built to accept battle-phase route maps and side-deck tech notes from the community.",
  },
];
