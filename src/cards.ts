export type Card = {
  id: string;
  name: string;
  cost: number;
  pythonLines: string[];
};

export const CARDS: Card[] = [
  {
    id: "add3",
    name: "Add 3",
    cost: 1,
    pythonLines: ["def add3(x):", 
                  "    x = x + 3", 
                  "    return x"],
  },
  {
    id: "double",
    name: "Double",
    cost: 1,
    pythonLines: ["def double(x):", 
                  "    x = x * 2", 
                  "    return x"],
  },
  {
    id: "clamp",
    name: "Clamp (0..10)",
    cost: 2,
    pythonLines: [
      "def clamp_0_10(x):",
      "    if x < 0:",
      "        x = 0",
      "    if x > 10:",
      "        x = 10",
      "    return x",
    ],
  },
];
