import { describe, expect, it } from "vitest";
import { shuffle } from "@/features/battle/utils/utils";

describe("utils/shuffle", () => {
  it("元の配列と同じ長さの配列を返すこと", () => {
    const original = [1, 2, 3, 4, 5];
    const result = shuffle(original);
    expect(result.length).toBe(original.length);
  });

  it("元の配列の要素がすべて含まれていること", () => {
    const original = ["A", "B", "C"];
    const result = shuffle(original);
    // ソートして比較することで、中身が同一かチェックする
    expect([...result].sort()).toEqual([...original].sort());
  });

  it("元の配列を変更しないこと（非破壊的であること）", () => {
    const original = [1, 2, 3];
    const originalCopy = [...original];
    shuffle(original);
    // shuffle後も元の配列が維持されているか
    expect(original).toEqual(originalCopy);
  });
});
