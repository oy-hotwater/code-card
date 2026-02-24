import type { Card } from "./types";

let seq = 1;
const uid = () => `c_${seq++}`;

export function makeStarterDeck(): Card[] {
  return [
    {
      id: uid(),
      name: "Strike",
      cost: 1,
      text: "Deal 6 damage.",
      rarity: "common",
      kind: "attack",
      damage: 6,
    },
    {
      id: uid(),
      name: "Strike",
      cost: 1,
      text: "Deal 6 damage.",
      rarity: "common",
      kind: "attack",
      damage: 6,
    },
    {
      id: uid(),
      name: "Defend",
      cost: 1,
      text: "Gain 5 Block.",
      rarity: "common",
      kind: "skill",
      block: 5,
    },
    {
      id: uid(),
      name: "Defend",
      cost: 1,
      text: "Gain 5 Block.",
      rarity: "common",
      kind: "skill",
      block: 5,
    },
    {
      id: uid(),
      name: "Bash",
      cost: 2,
      text: "Deal 8 damage.",
      rarity: "uncommon",
      kind: "attack",
      damage: 8,
    },
  ];
}
