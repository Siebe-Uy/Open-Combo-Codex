import type { Combo, ComboFilters } from "@/lib/types";

export const defaultFilters: ComboFilters = {
  query: "",
  engineId: "sky-striker",
  category: "All",
  difficulty: "All",
  starter: "All",
  turnPreference: "All",
  cardCount: "All",
  otkOnly: false,
  favoritesOnly: false,
};

export function getComboSearchText(combo: Combo) {
  return [
    combo.title,
    combo.contributor,
    combo.category,
    combo.difficulty,
    combo.turnPreference,
    combo.engineId,
    combo.starterCards.join(" "),
    combo.cardNames.join(" "),
    combo.prerequisites.join(" "),
    combo.steps.join(" "),
    combo.notes.join(" "),
    combo.endBoard,
    combo.tags.join(" "),
    combo.sourcePath,
  ]
    .join(" ")
    .toLowerCase();
}

export function filterCombos(combos: Combo[], filters: ComboFilters) {
  const query = filters.query.trim().toLowerCase();
  const isGlobalSearch = Boolean(query);

  return combos.filter((combo) => {
    if (!isGlobalSearch && filters.engineId !== "All" && combo.engineId !== filters.engineId) {
      return false;
    }

    if (filters.category !== "All" && combo.category !== filters.category) {
      return false;
    }

    if (filters.difficulty !== "All" && combo.difficulty !== filters.difficulty) {
      return false;
    }

    if (
      filters.turnPreference !== "All" &&
      combo.turnPreference !== filters.turnPreference &&
      combo.turnPreference !== "Either"
    ) {
      return false;
    }

    if (filters.starter !== "All" && !combo.starterCards.includes(filters.starter)) {
      return false;
    }

    if (filters.cardCount === "1" && combo.cardCount !== 1) {
      return false;
    }

    if (filters.cardCount === "2" && combo.cardCount !== 2) {
      return false;
    }

    if (filters.cardCount === "3+" && combo.cardCount < 3) {
      return false;
    }

    if (filters.otkOnly && !combo.otkPotential) {
      return false;
    }

    return !query || getComboSearchText(combo).includes(query);
  });
}
