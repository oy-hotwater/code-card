export type CardId = string;

export type CardRarity = "common" | "uncommon" | "rare";

// コード1行分のデータと、その行を実行したときのイベント定義
export type CodeLine = {
  text: string; // コードの文字列 (例: "attack = 6")
  log?: string; // この行を実行した時に出力するログ
  enemyHpDelta?: number; // 敵へのダメージ (マイナス値)
  playerHpDelta?: number; // プレイヤーの回復・ダメージ
  playerBlockDelta?: number; // プレイヤーの防御力（ブロック）の増減
  playerDrawDelta?: number; // 【新規】山札からカードを引く枚数
  animTrigger?: string; // 敵のアニメーション(TrojanHorseState)を発火させるトリガー
};

export type Card = {
  id: CardId;
  name: string;
  cost: number;
  text: string;
  rarity: CardRarity;
  kind: "attack" | "skill" | "power";
  damage?: number;
  block?: number;

  codeLines: CodeLine[]; // 行ごとのコードとイベントを定義した配列
  notes?: string; // 補足説明（任意）
};

// バトルの進行状態を定義
export type BattlePhase =
  | "INIT" // 初期化中
  | "PLAYER_IDLE" // プレイヤーの操作待ち
  | "PLAYER_EXECUTING" // プレイヤーのカード効果をステップ実行中
  | "ENEMY_TURN_START" // 敵のターン開始（演出など）
  | "ENEMY_ATTACKING" // 敵の攻撃処理中
  | "TURN_END" // ターン終了処理
  | "GAME_OVER" // 勝敗決着
  | "VICTORY";
