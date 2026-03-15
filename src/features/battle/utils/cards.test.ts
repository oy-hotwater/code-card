import { describe, expect, it } from "vitest";
import { makeStarterDeck } from "@/features/battle/utils/cards";

describe("cards/makeStarterDeck", () => {
  it("スターターデッキは8枚のカードで構成されること", () => {
    const deck = makeStarterDeck();
    expect(deck).toHaveLength(8);
  });

  it("各カードに一意のIDが割り振られていること", () => {
    const deck = makeStarterDeck();
    const ids = deck.map((card) => card.id);
    const uniqueIds = new Set(ids);
    // Setに変換してサイズを比較することで、重複がないか確認できる
    expect(uniqueIds.size).toBe(deck.length);
  });
});
