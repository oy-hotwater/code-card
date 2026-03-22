import { create } from "zustand";
import type { CardInstance } from "@/features/battle/utils/types";
import { makeStarterDeck } from "@/features/battle/utils/cards";

interface DeckState {
  collection: CardInstance[];
  deck: CardInstance[];
  addCardToDeck: (card: CardInstance) => void;
  removeCardFromDeck: (cardId: string) => void;
}

export const useDeckStore = create<DeckState>((set) => ({
  // 初期状態として、ひとまずスターターデッキのカード群を所持カードとする
  collection: makeStarterDeck(),
  deck: makeStarterDeck(),
  addCardToDeck: (card) => set((state) => ({ deck: [...state.deck, card] })),
  removeCardFromDeck: (cardId) =>
    set((state) => {
      const index = state.deck.findIndex((c) => c.id === cardId);
      if (index === -1) return state;
      const newDeck = [...state.deck];
      newDeck.splice(index, 1);
      return { deck: newDeck };
    }),
}));
