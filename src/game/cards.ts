import type { Card } from "./types";

const uid = () => `c_${Date.now()}_${Math.random().toString(16).slice(2)}`;

export function makeStarterDeck(): Card[] {
  return [
    {
      id: uid(),
      name: "Attack A",
      cost: 1,
      text: "Placeholder.",
      rarity: "common",
      kind: "attack",
      damage: 6,
      code: "ans = 1\nprint(ans)",
    },
    {
      id: uid(),
      name: "Skill A",
      cost: 1,
      text: "Placeholder.",
      rarity: "common",
      kind: "skill",
      block: 5,
      code: "for i in range(3):\n  pass",
    },
  ];
}
