"use client";

import { create } from "zustand";

type UiState = {
  categoryMenuOpen: boolean;
  toggleCategoryMenu: () => void;
  setCategoryMenuOpen: (open: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  categoryMenuOpen: true,
  toggleCategoryMenu: () => set((state) => ({ categoryMenuOpen: !state.categoryMenuOpen })),
  setCategoryMenuOpen: (open) => set({ categoryMenuOpen: open })
}));
