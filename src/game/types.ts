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
};
