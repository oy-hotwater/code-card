import type { Card } from "../game/types";
import TrojanHorseIcon, {
  type TrojanHorseState,
} from "./components/TrojanHorseIcon";

type Props = {
  enemyHp: number;
  playerHp: number;
  turn: "player" | "enemy";
  energy: number;
  maxEnergy: number;
  playerBlock: number;
  lastLog: string;
  onEndTurn: () => void;
  selectedCard: Card | null;
  executingCard: Card | null;
  currentLineIndex: number;
  enemyAnimState: TrojanHorseState;
  setEnemyAnimState: (state: TrojanHorseState) => void;
};

export function BattleBoard({
  enemyHp,
  playerHp,
  turn,
  energy,
  maxEnergy,
  playerBlock,
  lastLog,
  onEndTurn,
  selectedCard,
  executingCard,
  currentLineIndex,
  enemyAnimState,
  setEnemyAnimState,
}: Props) {
  const isPlayerTurn = turn === "player";

  const handleEnemyClick = () => {
    if (executingCard) return;
    if (enemyAnimState !== "idle") return;
    const actions: TrojanHorseState[] = ["attack", "damage", "exit"];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    setEnemyAnimState(randomAction);
  };

  return (
    <div className="board">
      <div className="hud">
        <div
          className="turnIndicator"
          style={{ color: isPlayerTurn ? "var(--py-accent)" : "#ff4a4a" }}
        >
          {isPlayerTurn ? "▶ Player Turn" : "▶ Enemy Turn"}
        </div>

        <div className="hpRow">
          <div className="hpBox">
            <div className="hpLabel">
              Player (Energy: {energy}/{maxEnergy})
            </div>
            <div
              className="hpValue"
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <span>{playerHp} HP</span>
              {playerBlock > 0 && (
                <span className="blockBadge">🛡️ {playerBlock}</span>
              )}
            </div>
          </div>
          <div className="hpBox">
            <div className="hpLabel">Enemy</div>
            <div className="hpValue">{enemyHp} HP</div>
          </div>
        </div>

        <div className="log">{lastLog}</div>

        <button
          className="endTurnBtn"
          onClick={onEndTurn}
          disabled={!isPlayerTurn || executingCard !== null}
        >
          End Turn
        </button>
      </div>

      <div className="arena">
        <div className="enemyWrap">
          <div className="enemyName">TROJAN</div>
          <div
            className="enemySprite"
            onClick={handleEnemyClick}
            style={{ cursor: executingCard ? "default" : "pointer" }}
          >
            <TrojanHorseIcon
              state={enemyAnimState}
              onAnimationComplete={(completedState) => {
                if (
                  completedState === "attack" ||
                  completedState === "damage" ||
                  completedState === "enter"
                ) {
                  setEnemyAnimState("idle");
                } else if (completedState === "exit") {
                  setTimeout(() => setEnemyAnimState("enter"), 1000);
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="codePanel">
        <div className="codeTitle">
          {executingCard
            ? `Executing: ${executingCard.name}`
            : selectedCard
              ? `Code: ${selectedCard.name}`
              : "Code Explorer"}
        </div>

        <div className="codeBox">
          {(() => {
            const cardToDisplay = executingCard || selectedCard;
            if (!cardToDisplay) {
              return (
                <div
                  className="codeLine"
                  style={{ color: "var(--py-text-muted)" }}
                >
                  カードにホバーしてコードを表示
                </div>
              );
            }

            return cardToDisplay.codeLines.map((line, i) => {
              const isActive = executingCard != null && i === currentLineIndex;
              return (
                <div key={i} className={`codeLine ${isActive ? "active" : ""}`}>
                  {line.text === "" ? " " : line.text}
                </div>
              );
            });
          })()}
        </div>
      </div>
    </div>
  );
}
