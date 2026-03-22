// カードの種類を一意に識別するID (例: "card_attack", "card_protect")
export type CardMasterId = string;
// ゲーム内で個別のカードを識別するID (UUID等)
export type CardInstanceId = string;

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

// 1. カードマスタ（図鑑に載る基本データ）
export type CardMaster = {
  id: CardMasterId; // 種類ごとの固定ID
  name: string;
  cost: number;
  text: string;
  rarity: CardRarity;
  kind: "attack" | "skill" | "power";
  damage?: number;
  block?: number;
  codeLines: CodeLine[];
  notes?: string;
};

// 2. カードインスタンス（手札やデッキに存在する実体）
// CardMasterのプロパティをすべて継承しつつ、実体としての一意のIDを持たせる
export type CardInstance = CardMaster & {
  uid: CardInstanceId; // ゲーム内で一意のID
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
