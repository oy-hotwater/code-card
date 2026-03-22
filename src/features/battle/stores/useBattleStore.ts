import { create } from "zustand";
import type { Card, CardId, BattlePhase } from "@/features/battle/utils/types";
import { makeStarterDeck } from "@/features/battle/utils/cards";
import { shuffle } from "@/features/battle/utils/utils";
import type { TrojanHorseState } from "@/components/TrojanHorseIcon";

const MAX_PLAYER_HP = 50;
const MAX_ENEMY_HP = 40;
const MAX_ENERGY = 3;

interface BattleState {
  // --- 状態 (State) ---
  phase: BattlePhase; // turn を廃止し、フェーズで一元管理
  cards: { deck: Card[]; hand: Card[]; discard: Card[] };
  enemyHp: number;
  playerHp: number;
  energy: number;
  playerBlock: number;
  lastLog: string;
  draggingId: CardId | null;
  selectedId: CardId | null;
  executingCard: Card | null;
  currentLineIndex: number;
  enemyAnimState: TrojanHorseState;

  // 定数も公開しておくと便利
  maxPlayerHp: number;
  maxEnemyHp: number;
  maxEnergy: number;

  // --- アクション (Actions) ---
  initGame: () => void;
  drawCards: (amount: number) => void;
  playCard: (cardId: CardId) => void;
  endTurn: () => void;

  // --- セッター (Engine等から直接値を更新するため) ---
  setPhase: (phase: BattlePhase) => void; // エンジンからフェーズを更新するためのセッター
  setDraggingId: (id: CardId | null) => void;
  setSelectedId: (id: CardId | null) => void;
  setExecutingCard: (card: Card | null) => void;
  setCurrentLineIndex: (index: number | ((prev: number) => number)) => void;
  setEnemyAnimState: (state: TrojanHorseState) => void;
  setEnemyHp: (updater: number | ((prev: number) => number)) => void;
  setPlayerHp: (updater: number | ((prev: number) => number)) => void;
  setPlayerBlock: (updater: number | ((prev: number) => number)) => void;
  setEnergy: (updater: number | ((prev: number) => number)) => void;
  setLastLog: (updater: string | ((prev: string) => string)) => void;
  setCards: (
    updater: (prev: BattleState["cards"]) => BattleState["cards"],
  ) => void;
}

export const useBattleStore = create<BattleState>((set, get) => ({
  phase: "INIT", // 初期状態
  cards: { deck: [], hand: [], discard: [] },
  enemyHp: MAX_ENEMY_HP,
  playerHp: MAX_PLAYER_HP,
  energy: MAX_ENERGY,
  playerBlock: 0,
  lastLog: "Battle Start! Your turn.",
  draggingId: null,
  selectedId: null,
  executingCard: null,
  currentLineIndex: -1,
  enemyAnimState: "idle",

  maxPlayerHp: MAX_PLAYER_HP,
  maxEnemyHp: MAX_ENEMY_HP,
  maxEnergy: MAX_ENERGY,

  initGame: () => {
    const initialDeck = shuffle(makeStarterDeck());
    const initialHand = initialDeck.splice(0, 4);
    set({
      cards: { deck: initialDeck, hand: initialHand, discard: [] },
      enemyHp: MAX_ENEMY_HP,
      playerHp: MAX_PLAYER_HP,
      energy: MAX_ENERGY,
      playerBlock: 0,
      lastLog: "Battle Start! Your turn.",
      executingCard: null,
      currentLineIndex: -1,
    });
  },

  drawCards: (amount: number) => {
    set((state) => {
      let currentDeck = [...state.cards.deck];
      let currentDiscard = [...state.cards.discard];
      const currentHand = [...state.cards.hand];
      let log = state.lastLog;

      for (let i = 0; i < amount; i++) {
        if (currentDeck.length === 0) {
          if (currentDiscard.length === 0) break;
          currentDeck = shuffle(currentDiscard);
          currentDiscard = [];
          log = `${log} (Deck reshuffled!)`;
        }
        const drawnCard = currentDeck.shift();
        if (drawnCard) currentHand.push(drawnCard);
      }

      return {
        cards: {
          deck: currentDeck,
          hand: currentHand,
          discard: currentDiscard,
        },
        lastLog: log,
      };
    });
  },

  playCard: (cardId: CardId) => {
    const state = get();

    // 厳密なフェーズチェック。PLAYER_IDLE 以外では絶対にカードを使えないようにする
    if (state.phase !== "PLAYER_IDLE") return;

    const card = state.cards.hand.find((c) => c.id === cardId);
    if (!card) return;

    if (state.energy < card.cost) {
      set({
        lastLog: `エネルギーが足りません (Cost: ${card.cost}, Energy: ${state.energy})`,
      });
      return;
    }

    set((prev) => ({
      phase: "PLAYER_EXECUTING", // 実行中フェーズへ移行
      energy: prev.energy - card.cost,
      cards: {
        ...prev.cards,
        hand: prev.cards.hand.filter((c) => c.id !== cardId),
        discard: [...prev.cards.discard, card],
      },
      selectedId: prev.selectedId === cardId ? null : prev.selectedId,
      executingCard: card,
      currentLineIndex: 0,
    }));
  },

  endTurn: () => {
    const state = get();
    if (state.phase !== "PLAYER_IDLE") return;

    set((prev) => ({
      phase: "ENEMY_TURN_START",
      lastLog: "ターン終了。残った手札を捨て札へ送ります...",
      selectedId: null,
      cards: {
        deck: prev.cards.deck,
        hand: [],
        discard: [...prev.cards.discard, ...prev.cards.hand],
      },
    }));
  },

  // --- 汎用セッター群 ---
  setPhase: (phase) => set({ phase }),
  setDraggingId: (id) => set({ draggingId: id }),
  setSelectedId: (id) => set({ selectedId: id }),
  setExecutingCard: (card) => set({ executingCard: card }),
  setCurrentLineIndex: (updater) =>
    set((state) => ({
      currentLineIndex:
        typeof updater === "function"
          ? updater(state.currentLineIndex)
          : updater,
    })),
  setEnemyAnimState: (state) => set({ enemyAnimState: state }),
  setEnemyHp: (updater) =>
    set((state) => ({
      enemyHp: typeof updater === "function" ? updater(state.enemyHp) : updater,
    })),
  setPlayerHp: (updater) =>
    set((state) => ({
      playerHp:
        typeof updater === "function" ? updater(state.playerHp) : updater,
    })),
  setPlayerBlock: (updater) =>
    set((state) => ({
      playerBlock:
        typeof updater === "function" ? updater(state.playerBlock) : updater,
    })),
  setEnergy: (updater) =>
    set((state) => ({
      energy: typeof updater === "function" ? updater(state.energy) : updater,
    })),
  setLastLog: (updater) =>
    set((state) => ({
      lastLog: typeof updater === "function" ? updater(state.lastLog) : updater,
    })),
  setCards: (updater) => set((state) => ({ cards: updater(state.cards) })),
}));
