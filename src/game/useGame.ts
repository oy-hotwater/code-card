import { useMemo, useState } from "react";
import type { Card, CardId } from "./types";
import { makeStarterDeck } from "./cards";

type PlayResult = {
  enemyHpDelta: number;
  playerHpDelta: number;
  log: string;
};

function resolve(card: Card): PlayResult {
  // テンプレ：最低限の例。ここを拡張して「状態異常」「ターン制」などを載せていく。
  if (card.kind === "attack") {
    const dmg = card.damage ?? 0;
    return {
      enemyHpDelta: -dmg,
      playerHpDelta: 0,
      log: `${card.name} → Enemy -${dmg}`,
    };
  }
  if (card.kind === "skill") {
    const block = card.block ?? 0;
    return {
      enemyHpDelta: 0,
      playerHpDelta: 0,
      log: `${card.name} → +${block} Block (not implemented)`,
    };
  }
  return {
    enemyHpDelta: 0,
    playerHpDelta: 0,
    log: `${card.name} (power) played`,
  };
}

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

  function playCard(cardId: CardId) {
    setHand((prev) => {
      const card = prev.find((c) => c.id === cardId);
      if (!card) return prev;

      const r = resolve(card);
      setEnemyHp((hp) => Math.max(0, hp + r.enemyHpDelta));
      setPlayerHp((hp) => Math.max(0, hp + r.playerHpDelta));
      setLastLog(r.log);

      const next = prev.filter((c) => c.id !== cardId);

      if (selectedId === cardId) {
        setSelectedId(null);
      }

      return next;
    });
  }

  function endTurn() {
    setLastLog("End turn. (enemy acts not implemented)");
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
  };
}
