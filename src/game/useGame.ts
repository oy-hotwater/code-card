import { useMemo, useState, useEffect } from "react";
import type { Card, CardId } from "./types";
import { makeStarterDeck } from "./cards";
import type { TrojanHorseState } from "../ui/components/TrojanHorseIcon";

export function useGame() {
  const [hand, setHand] = useState<Card[]>([]);
  const [enemyHp, setEnemyHp] = useState(40);
  const [playerHp, setPlayerHp] = useState(50);

  // ターンとリソースの管理
  const [turn, setTurn] = useState<"player" | "enemy">("player");
  const [energy, setEnergy] = useState(3);
  const [maxEnergy, setMaxEnergy] = useState(3);
  const [playerBlock, setPlayerBlock] = useState(0);

  const [lastLog, setLastLog] = useState("Battle Start! Your turn.");
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

  // 初期化（手札を配る）
  useEffect(() => {
    setHand(makeStarterDeck());
  }, []);

  function playCard(cardId: CardId) {
    if (isExecuting || turn !== "player") return;

    const card = hand.find((c) => c.id === cardId);
    if (!card) return;

    // コストチェック
    if (energy < card.cost) {
      setLastLog(
        `エネルギーが足りません (Cost: ${card.cost}, Energy: ${energy})`,
      );
      return;
    }

    // コスト消費と手札からの削除
    setEnergy((prev) => prev - card.cost);
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

    if (currentLineIndex >= executingCard.codeLines.length) {
      const timer = setTimeout(() => {
        setExecutingCard(null);
        setCurrentLineIndex(-1);
        setLastLog("コードの実行が完了しました。");
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
      if (line.animTrigger) {
        setEnemyAnimState(line.animTrigger as TrojanHorseState);
      }

      setCurrentLineIndex((prev) => prev + 1);
    }, 800);

    return () => clearTimeout(timer);
  }, [executingCard, currentLineIndex]);

  // --- 敵のターン制御 ---
  function endTurn() {
    if (isExecuting || turn !== "player") return;
    setTurn("enemy");
    setLastLog("ターン終了。敵の行動中...");
    setSelectedId(null);
  }

  useEffect(() => {
    if (turn !== "enemy") return;

    // 敵のアクションシーケンス（簡略版）
    const timer1 = setTimeout(() => {
      setEnemyAnimState("attack");
      setLastLog("TrojanHorse.execute('attack')");
    }, 1000);

    const timer2 = setTimeout(() => {
      const damage = 8; // 敵の固定攻撃力
      setLastLog(`Enemy dealt ${damage} damage!`);

      // ブロックでダメージを軽減する処理
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
        }
        return newBlock;
      });
    }, 1700);

    const timer3 = setTimeout(() => {
      setEnemyAnimState("idle");
      setTurn("player");
      setEnergy(maxEnergy);
      setPlayerBlock(0); // ターン開始時にブロックは消滅
      setLastLog("Your turn. (Energy Restored)");

      // デッキがないので簡易的に手札が0なら補充
      setHand((prev) => (prev.length === 0 ? makeStarterDeck() : prev));
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [turn, maxEnergy]);

  return {
    hand,
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

    // UI制御用
    isExecuting,
    executingCard,
    currentLineIndex,
    enemyAnimState,
    setEnemyAnimState,
  };
}
