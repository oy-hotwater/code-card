import type { Card } from "./types";

const uid = () => `c_${Date.now()}_${Math.random().toString(16).slice(2)}`;

export function makeStarterDeck(): Card[] {
  return [
    {
      id: uid(),
      name: "attack(damage=3)",
      cost: 1,
      text: "Placeholder.",
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
      name: "Attack A",
      cost: 1,
      text: "Placeholder.",
      rarity: "common",
      kind: "attack",
      damage: 6,
      codeLines: [
        { text: "def Attack_A():" },
        { text: "  attack = 6", log: "変数 attack に 6 を代入" },
        { text: "  return attack", log: "値 6 を返します" },
        { text: "" },
        {
          text: "Attack_A()",
          enemyHpDelta: -6,
          animTrigger: "damage",
          log: "Attack_A() を実行し、敵に 6 のダメージ！",
        },
      ],
    },
    {
      id: uid(),
      name: "Skill A",
      cost: 1,
      text: "Placeholder.",
      rarity: "common",
      kind: "skill",
      block: 5,
      codeLines: [
        { text: "def Skill_A():" },
        { text: "  block = 5", log: "変数 block に 5 を代入" },
        { text: "  return block", log: "値 5 を返します" },
        { text: "" },
        {
          text: "Skill_A()",
          log: "Skill_A() を実行！ 5 ブロックを得た！(未実装)",
        },
      ],
    },
  ];
}
