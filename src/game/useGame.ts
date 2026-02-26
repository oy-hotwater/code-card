import { useMemo, useState, useEffect } from "react";
import type { Card, CardId } from "./types";
import { makeStarterDeck } from "./cards";
import type { TrojanHorseState } from "../ui/components/TrojanHorseIcon";

export function useGame() {
  const starter = useMemo(() => makeStarterDeck(), []);
  const [hand, setHand] = useState<Card[]>(starter);
  const [enemyHp, setEnemyHp] = useState(40);
  const [playerHp, setPlayerHp] = useState(50);
  const [lastLog, setLastLog] = useState("Draw your hand.");
  const [draggingId, setDraggingId] = useState<CardId | null>(null);

  const [selectedId, setSelectedId] = useState<CardId | null>(null);
  const selectedCard = useMemo(
    () => hand.find((c) => c.id === selectedId) ?? null,
    [hand, selectedId],
  );

  // --- 実行ステート ---
  const [executingCard, setExecutingCard] = useState<Card | null>(null);
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(-1);
  const [enemyAnimState, setEnemyAnimState] =
    useState<TrojanHorseState>("idle");

  const isExecuting = executingCard !== null;

  function playCard(cardId: CardId) {
    if (isExecuting) return; // 実行中は他のカードをプレイできない

    const card = hand.find((c) => c.id === cardId);
    if (!card) return;

    // 手札から削除
    setHand((prev) => prev.filter((c) => c.id !== cardId));
    if (selectedId === cardId) {
      setSelectedId(null);
    }

    // 実行フェーズの開始
    setExecutingCard(card);
    setCurrentLineIndex(0);
  }

  // --- ステップ実行ロジック ---
  useEffect(() => {
    if (!executingCard) return;

    // すべての行を実行し終えた場合
    if (currentLineIndex >= executingCard.codeLines.length) {
      const timer = setTimeout(() => {
        setExecutingCard(null);
        setCurrentLineIndex(-1);
        setLastLog("コードの実行が完了しました。");
        setEnemyAnimState("idle");
      }, 1000); // 完了後、少し待ってから実行状態を解除
      return () => clearTimeout(timer);
    }

    // 行ごとの処理を一定間隔で進める
    const timer = setTimeout(() => {
      const line = executingCard.codeLines[currentLineIndex];

      // アクションの適用
      if (line.log) setLastLog(line.log);
      if (line.enemyHpDelta)
        setEnemyHp((hp) => Math.max(0, hp + line.enemyHpDelta!));
      if (line.playerHpDelta)
        setPlayerHp((hp) => Math.max(0, hp + line.playerHpDelta!));
      if (line.animTrigger) {
        setEnemyAnimState(line.animTrigger as TrojanHorseState);
      }

      // 次の行へ
      setCurrentLineIndex((prev) => prev + 1);
    }, 800); // 1行あたり800msのウェイトで実行

    return () => clearTimeout(timer);
  }, [executingCard, currentLineIndex]);

  function endTurn() {
    if (isExecuting) return;
    setLastLog("ターン終了 (敵の行動は未実装です)");
  }

  return {
    hand,
    enemyHp,
    playerHp,
    lastLog,
    playCard,
    endTurn,
    draggingId,
    setDraggingId,
    selectedId,
    setSelectedId,
    selectedCard,

    // UI制御用
    isExecuting,
    executingCard,
    currentLineIndex,
    enemyAnimState,
    setEnemyAnimState,
  };
}
