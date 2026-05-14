"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ComboFilters } from "@/lib/types";
import { defaultFilters } from "@/lib/search";

type ComboStore = {
  filters: ComboFilters;
  favoriteIds: string[];
  expandedId?: string;
  setFilter: <Key extends keyof ComboFilters>(key: Key, value: ComboFilters[Key]) => void;
  resetFilters: () => void;
  toggleFavorite: (comboId: string) => void;
  setExpandedId: (comboId?: string) => void;
};

export const useComboStore = create<ComboStore>()(
  persist(
    (set) => ({
      filters: defaultFilters,
      favoriteIds: [],
      expandedId: undefined,
      setFilter: (key, value) =>
        set((state) => ({
          filters: {
            ...state.filters,
            [key]: value,
          },
        })),
      resetFilters: () => set({ filters: defaultFilters }),
      toggleFavorite: (comboId) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.includes(comboId)
            ? state.favoriteIds.filter((id) => id !== comboId)
            : [...state.favoriteIds, comboId],
        })),
      setExpandedId: (comboId) => set({ expandedId: comboId }),
    }),
    {
      name: "open-combo-codex",
      partialize: (state) => ({ favoriteIds: state.favoriteIds }),
    },
  ),
);
