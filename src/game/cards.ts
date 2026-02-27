import type { Card } from "./types";

const uid = () => `c_${Date.now()}_${Math.random().toString(16).slice(2)}`;

export function makeStarterDeck(): Card[] {
  return [
    {
      id: uid(),
      name: "attack(damage=3)",
      cost: 1,
      text: "Deal 3 damage.",
      rarity: "common",
      kind: "attack",
      damage: 3,
      codeLines: [
        { text: "def attack(damage=3):", log: "関数 attack() の実行開始..." },
        {
          text: "  global enemy_hp, cost                  # ステータスに干渉",
          log: "グローバル変数を参照します",
        },
        {
          text: "  cost -= 1                              # コストを消費",
          log: "コストを 1 消費",
        },
        {
          text: "  enemy_hp -= damage                     # 敵にダメージ(敵のHPを減らす)",
          enemyHpDelta: -3,
          animTrigger: "damage",
          log: "敵に 3 のダメージ！",
        },
        {
          text: "  print(f'Enemy takes {damage} damage!') # ログを表示",
          log: "Enemy takes 3 damage!",
        },
        { text: "  return", log: "処理を終了して戻ります" },
      ],
    },
    {
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
    },
  ];
}
