import type { Card } from "./types";

const uid = () => `c_${Date.now()}_${Math.random().toString(16).slice(2)}`;

// 1. 基本攻撃カード
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

// 2. 基本防御カード
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

// 3. 【新規】変数操作（回復）カード
function createHealCard(): Card {
  return {
    id: uid(),
    name: "heal(amount=8)",
    cost: 1,
    text: "Restore 8 HP.",
    rarity: "uncommon",
    kind: "skill",
    codeLines: [
      { text: "def heal(amount=8):", log: "回復モジュールを起動..." },
      { text: "  global player_hp" },
      {
        text: "  player_hp += amount",
        playerHpDelta: 8,
        log: "プレイヤーのHPが 8 回復した！",
      },
      { text: "  return" },
    ],
  };
}

// 4. 【新規】リスト操作（ドロー）カード
function createDrawCard(): Card {
  return {
    id: uid(),
    name: "deck.pop()",
    cost: 1,
    text: "Draw 2 cards.",
    rarity: "uncommon",
    kind: "skill",
    codeLines: [
      {
        text: "for _ in range(2):",
        log: "2回ループして配列(デッキ)を操作します",
      },
      { text: "  card = deck.pop()", log: "山札の末尾から要素を pop() で取得" },
      {
        text: "  hand.append(card)",
        playerDrawDelta: 1,
        log: "手札(配列)に要素を append() して追加！",
      },
      { text: "  card = deck.pop()", log: "山札の末尾から要素を pop() で取得" },
      {
        text: "  hand.append(card)",
        playerDrawDelta: 1,
        log: "手札(配列)に要素を append() して追加！",
      },
    ],
  };
}

// 5. 【新規】for文（連続攻撃）カード
function createForLoopCard(): Card {
  return {
    id: uid(),
    name: "for i in range(3)",
    cost: 2,
    text: "Deal 2 damage 3 times.",
    rarity: "uncommon",
    kind: "attack",
    codeLines: [
      {
        text: "for i in range(3):",
        log: "ループ処理開始: 3回攻撃を繰り返します",
      },
      {
        text: "  enemy_hp -= 2 # i=0",
        enemyHpDelta: -2,
        animTrigger: "damage",
        log: "1回目のループ: 2ダメージ！",
      },
      {
        text: "  enemy_hp -= 2 # i=1",
        enemyHpDelta: -2,
        animTrigger: "damage",
        log: "2回目のループ: 2ダメージ！",
      },
      {
        text: "  enemy_hp -= 2 # i=2",
        enemyHpDelta: -2,
        animTrigger: "damage",
        log: "3回目のループ: 2ダメージ！",
      },
    ],
  };
}

// 6. 【新規】OSモジュール/大技（ウイルス除去）カード
function createVirusRemovalCard(): Card {
  return {
    id: uid(),
    name: "os.remove('/virus')",
    cost: 3,
    text: "Deal 18 damage.",
    rarity: "rare",
    kind: "attack",
    damage: 18,
    codeLines: [
      {
        text: "import os",
        log: "システム権限を取得するため os モジュールをインポート...",
      },
      { text: "import shutil", log: "shutil モジュールをインポート..." },
      {
        text: "target = '/system/virus_core'",
        log: "ウイルスのコアディレクトリパスを変数 target に代入",
      },
      {
        text: "shutil.rmtree(target)",
        enemyHpDelta: -18,
        animTrigger: "damage",
        log: "ディレクトリツリーを強制削除！ 18 の大ダメージ！",
      },
      {
        text: "print('Removal complete.')",
        log: "ウイルス除去処理が完了しました",
      },
    ],
  };
}

// スターターデッキを生成（新しいカードを盛り込む）
export function makeStarterDeck(): Card[] {
  return [
    createAttackCard(),
    createAttackCard(),
    createProtectCard(),
    createProtectCard(),
    createHealCard(), // 回復
    createDrawCard(), // 2枚ドロー
    createForLoopCard(), // 連続攻撃
    createVirusRemovalCard(), // ウイルス一掃大技（コスト3）
  ];
}
