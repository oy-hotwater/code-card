import type { Card } from "./types";

const uid = () => `c_${Date.now()}_${Math.random().toString(16).slice(2)}`;

// カードを量産できるように生成関数を定義
function createAttackCard(): Card {
  return {
    id: uid(),
    name: "attack(damage=3)",
    cost: 1,
    text: "Deal 3 damage.",
    rarity: "common",
    kind: "attack",
    damage: 3,
    codeLines: [
      { text: "def attack(damage=3):", log: "関数 attack() の実行開始..." },
      { text: "  global enemy_hp, cost" },
      { text: "  cost -= 1" },
      {
        text: "  enemy_hp -= damage",
        enemyHpDelta: -3,
        animTrigger: "damage",
        log: "敵に 3 のダメージ！",
      },
      { text: "  return" },
    ],
  };
}

function createProtectCard(): Card {
  return {
    id: uid(),
    name: "protect(block=5)",
    cost: 1,
    text: "Gain 5 Block.",
    rarity: "common",
    kind: "skill",
    block: 5,
    codeLines: [
      { text: "def protect(block=5):" },
      {
        text: "  player_block += block",
        log: "5 のブロック（シールド）を得た！",
        playerBlockDelta: 5,
      },
      { text: "  return" },
    ],
  };
}

// スターターデッキを生成
export function makeStarterDeck(): Card[] {
  return [
    createAttackCard(),
    createAttackCard(),
    createAttackCard(),
    createAttackCard(),
    createProtectCard(),
    createProtectCard(),
    createProtectCard(),
    createProtectCard(),
  ];
}
