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
      code: [
        "def Attack_A():",
        "  attack = 1",
        "  return attack",
        "",
        "Attack_A()",
      ].join("\n"),
    },
    {
      id: uid(),
      name: "Skill A",
      cost: 1,
      text: "Placeholder.",
      rarity: "common",
      kind: "skill",
      block: 5,
      code: [
        "def Skill_A():",
        "  block = 5",
        "  return block",
        "",
        "Skill_A()",
      ].join("\n"),
    },
  ];
}
