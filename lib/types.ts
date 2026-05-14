export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type TurnPreference = "Going First" | "Going Second" | "Either";
export type ComboCategory =
  | "Beginner Combos"
  | "Main Deck Starters"
  | "OTK Lines"
  | "Going First"
  | "Going Second"
  | "Tricks & Tech"
  | "Grind Game";

export type CardPreview = {
  name: string;
  type: string;
  imageUrl?: string;
  description: string;
};

export type Combo = {
  id: string;
  engineId: string;
  contributor: string;
  title: string;
  category: ComboCategory;
  difficulty: Difficulty;
  starterCards: string[];
  cardNames: string[];
  cardCount: number;
  turnPreference: TurnPreference;
  tags: string[];
  otkPotential: boolean;
  prerequisites: string[];
  steps: string[];
  notes: string[];
  endBoard: string;
  variants: string[];
  videoPlaceholder?: string;
  masterDuelNote?: string;
  sourcePath: string;
};

export type Engine = {
  id: string;
  name: string;
  tagline: string;
  status: "Live" | "Coming Soon";
  tierRank?: number;
  tierLabel?: string;
  description: string;
};

export type DeckCardGroup = {
  title: string;
  cards: string[];
};

export type DeckList = {
  name: string;
  description: string;
  groups: DeckCardGroup[];
};

export type ResourceLink = {
  title: string;
  description: string;
  href: string;
};

export type ComboFilters = {
  query: string;
  engineId: string;
  category: "All" | ComboCategory;
  difficulty: "All" | Difficulty;
  starter: string;
  turnPreference: "All" | TurnPreference;
  cardCount: "All" | "1" | "2" | "3+";
  otkOnly: boolean;
  favoritesOnly: boolean;
};
