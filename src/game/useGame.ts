import { useMemo, useState, useEffect, useCallback } from "react";
import type { Card, CardId } from "./types";
import { makeStarterDeck } from "./cards";
import type { TrojanHorseState } from "../ui/components/TrojanHorseIcon";

// シャッフル用ユーティリティ関数
function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function useGame() {
  // 山札・手札・捨て札をまとめて管理
  const [cards, setCards] = useState<{
    deck: Card[];
    hand: Card[];
    discard: Card[];
  }>({
    deck: [],
    hand: [],
    discard: [],
  });

  const [enemyHp, setEnemyHp] = useState(40);
  const [playerHp, setPlayerHp] = useState(50);

  const [turn, setTurn] = useState<"player" | "enemy">("player");
  const [energy, setEnergy] = useState(3);
  const [maxEnergy, setMaxEnergy] = useState(3);
  const [playerBlock, setPlayerBlock] = useState(0);

  const [lastLog, setLastLog] = useState("Battle Start! Your turn.");
  const [draggingId, setDraggingId] = useState<CardId | null>(null);

  const [selectedId, setSelectedId] = useState<CardId | null>(null);
  const selectedCard = useMemo(
    () => cards.hand.find((c) => c.id === selectedId) ?? null,
    [cards.hand, selectedId],
  );

  const [executingCard, setExecutingCard] = useState<Card | null>(null);
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(-1);
  const [enemyAnimState, setEnemyAnimState] =
    useState<TrojanHorseState>("idle");

  const isExecuting = executingCard !== null;

  // ドロー機能 (useEffect内でも呼べるようにuseCallbackでラップ)
  const drawCards = useCallback((amount: number) => {
    setCards((prev) => {
      let currentDeck = [...prev.deck];
      let currentDiscard = [...prev.discard];
      const currentHand = [...prev.hand];

      for (let i = 0; i < amount; i++) {
        if (currentDeck.length === 0) {
          if (currentDiscard.length === 0) break; // デッキも捨て札も空なら終了
          // 捨て札をシャッフルして山札に戻す
          currentDeck = shuffle(currentDiscard);
          currentDiscard = [];
          setLastLog((log) => `${log} (Deck reshuffled!)`);
        }
        const drawnCard = currentDeck.shift();
        if (drawnCard) currentHand.push(drawnCard);
      }

      return { deck: currentDeck, hand: currentHand, discard: currentDiscard };
    });
  }, []);

  // 初期化：デッキをシャッフルして4枚ドロー
  useEffect(() => {
    const initialDeck = shuffle(makeStarterDeck());
    const initialHand = initialDeck.splice(0, 4); // 先頭から4枚引く
    setCards({
      deck: initialDeck,
      hand: initialHand,
      discard: [],
    });
  }, []);

  function playCard(cardId: CardId) {
    if (isExecuting || turn !== "player") return;

    const card = cards.hand.find((c) => c.id === cardId);
    if (!card) return;

    if (energy < card.cost) {
      setLastLog(
        `エネルギーが足りません (Cost: ${card.cost}, Energy: ${energy})`,
      );
      return;
    }

    setEnergy((prev) => prev - card.cost);

    // 手札から取り除き、捨て札（Discard）に追加する
    setCards((prev) => ({
      ...prev,
      hand: prev.hand.filter((c) => c.id !== cardId),
      discard: [...prev.discard, card],
    }));

    if (selectedId === cardId) setSelectedId(null);

    setExecutingCard(card);
    setCurrentLineIndex(0);
  }

  // ステップ実行ロジック
  useEffect(() => {
    if (!executingCard) return;

    if (currentLineIndex >= executingCard.codeLines.length) {
      const timer = setTimeout(() => {
        setExecutingCard(null);
        setCurrentLineIndex(-1);
        setEnemyAnimState("idle");
      }, 1000);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      const line = executingCard.codeLines[currentLineIndex];

      if (line.log) setLastLog(line.log);
      if (line.enemyHpDelta)
        setEnemyHp((hp) => Math.max(0, hp + line.enemyHpDelta!));
      if (line.playerHpDelta)
        setPlayerHp((hp) => Math.max(0, hp + line.playerHpDelta!));
      if (line.playerBlockDelta)
        setPlayerBlock((block) => block + line.playerBlockDelta!);

      // 【新規追加】ドロー効果の処理
      if (line.playerDrawDelta) {
        drawCards(line.playerDrawDelta);
      }

      if (line.animTrigger) {
        setEnemyAnimState(line.animTrigger as TrojanHorseState);
      }

      setCurrentLineIndex((prev) => prev + 1);
    }, 800);

    return () => clearTimeout(timer);
  }, [executingCard, currentLineIndex, drawCards]);

  // プレイヤーのターン終了
  function endTurn() {
    if (isExecuting || turn !== "player") return;
    setTurn("enemy");
    setLastLog("ターン終了。残った手札を捨て札へ送ります...");
    setSelectedId(null);

    // 手札に残ったカードをすべて捨て札に送る
    setCards((prev) => ({
      deck: prev.deck,
      hand: [],
      discard: [...prev.discard, ...prev.hand],
    }));
  }

  // 敵のターン制御
  useEffect(() => {
    if (turn !== "enemy") return;

    const timer1 = setTimeout(() => {
      setEnemyAnimState("attack");
      setLastLog("TrojanHorse.execute('attack')");
    }, 1000);

    const timer2 = setTimeout(() => {
      const damage = 8;
      setPlayerBlock((currentBlock) => {
        let remainingDamage = damage;
        let newBlock = currentBlock;

        if (currentBlock > 0) {
          if (currentBlock >= damage) {
            newBlock -= damage;
            remainingDamage = 0;
            setLastLog(`Block absorbed ${damage} damage!`);
          } else {
            remainingDamage -= currentBlock;
            setLastLog(`Block absorbed ${currentBlock} damage!`);
            newBlock = 0;
          }
        }

        if (remainingDamage > 0) {
          setPlayerHp((hp) => Math.max(0, hp - remainingDamage));
          if (currentBlock === 0) setLastLog(`Enemy dealt ${damage} damage!`);
        }
        return newBlock;
      });
    }, 1700);

    const timer3 = setTimeout(() => {
      setEnemyAnimState("idle");
      setTurn("player");
      setEnergy(maxEnergy);
      setPlayerBlock(0);
      setLastLog("Your turn. Draw 4 cards.");
      drawCards(4); // ターン開始時に4枚ドロー
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [turn, maxEnergy, drawCards]);

  return {
    cards, // まとめたStateを返す
    enemyHp,
    playerHp,
    turn,
    energy,
    maxEnergy,
    playerBlock,
    lastLog,
    playCard,
    endTurn,
    draggingId,
    setDraggingId,
    selectedId,
    setSelectedId,
    selectedCard,
    isExecuting,
    executingCard,
    currentLineIndex,
    enemyAnimState,
    setEnemyAnimState,
  };
}
