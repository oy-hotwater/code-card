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
