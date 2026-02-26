import { useState } from "react";
import type { Card } from "../game/types";
import TrojanHorseIcon, {
  type TrojanHorseState,
} from "./components/TrojanHorseIcon";

type Props = {
  enemyHp: number;
  playerHp: number;
  lastLog: string;
  onEndTurn: () => void;
  selectedCard: Card | null;
};

export function BattleBoard({
  enemyHp,
  playerHp,
  lastLog,
  onEndTurn,
  selectedCard,
}: Props) {
  const [enemyState, setEnemyState] = useState<TrojanHorseState>("enter");

  const handleEnemyClick = () => {
    if (enemyState !== "idle") return;
    const actions: TrojanHorseState[] = ["attack", "damage", "exit"];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    setEnemyState(randomAction);
  };

  return (
    <div className="board">
      <div className="hud">
        <div className="hpRow">
          <div className="hpBox">
            <div className="hpLabel">Player</div>
            <div className="hpValue">{playerHp} HP</div>
          </div>
          <div className="hpBox">
            <div className="hpLabel">Enemy</div>
            <div className="hpValue">{enemyHp} HP</div>
          </div>
        </div>

        <div className="log">{lastLog}</div>

        <button className="endTurnBtn" onClick={onEndTurn}>
          End Turn
        </button>
      </div>

      <div className="arena">
        <div className="enemyWrap">
          <div className="enemyName">TROJAN</div>
          <div
            className="enemySprite"
            onClick={handleEnemyClick}
            style={{ cursor: "pointer" }}
            title="クリックでモーションをテスト"
          >
            <TrojanHorseIcon
              state={enemyState}
              onAnimationComplete={(completedState) => {
                if (
                  completedState === "attack" ||
                  completedState === "damage" ||
                  completedState === "enter"
                ) {
                  setEnemyState("idle");
                } else if (completedState === "exit") {
                  setTimeout(() => setEnemyState("enter"), 1000);
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="codePanel">
        <div className="codeTitle">
          {selectedCard ? `Code: ${selectedCard.name}` : "Code"}
        </div>
        <pre className="codeBox">
          <code>{selectedCard?.code ?? "カードを選んでコードを表示"}</code>
        </pre>
      </div>
    </div>
  );
}
