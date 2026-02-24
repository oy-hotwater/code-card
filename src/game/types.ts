export type CardId = string;

export type CardRarity = "common" | "uncommon" | "rare";

export type Card = {
  id: CardId;
  name: string;
  cost: number;
  text: string;
  rarity: CardRarity;
  kind: "attack" | "skill" | "power";
  damage?: number;
  block?: number;

  // 追加（後回し前提）
  code?: string; // Python表示用（複数行OK）
  notes?: string; // 補足説明（任意）
};
