import { renderHook, act } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useGame } from "@/features/battle/hooks/useGame";

describe("useGame Hook", () => {
  it("初期化時に正しいステータスがセットされること", () => {
    // renderHookを使ってカスタムフックを仮想的に実行します
    const { result } = renderHook(() => useGame());

    // 初期状態の検証
    expect(result.current.playerHp).toBe(50);
    expect(result.current.enemyHp).toBe(40);
    expect(result.current.energy).toBe(3);
    expect(result.current.turn).toBe("player");

    // 手札は4枚引かれているはず
    expect(result.current.cards.hand).toHaveLength(4);
  });

  it("プレイヤーがターンを終了すると、敵のターンになること", () => {
    const { result } = renderHook(() => useGame());

    // 状態を更新するアクションは act() で囲む必要があります
    act(() => {
      result.current.endTurn();
    });

    expect(result.current.turn).toBe("enemy");
    // ターン終了時、手札は捨て札に送られるため 0枚 になる
    expect(result.current.cards.hand).toHaveLength(0);
  });
});
