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
  executingCard: Card | null;
  currentLineIndex: number;
  enemyAnimState: TrojanHorseState;
  setEnemyAnimState: (state: TrojanHorseState) => void;
};

export function BattleBoard({
  enemyHp,
  playerHp,
  lastLog,
  onEndTurn,
  selectedCard,
  executingCard,
  currentLineIndex,
  enemyAnimState,
  setEnemyAnimState,
}: Props) {
  const handleEnemyClick = () => {
    if (executingCard) return; // 実行中はお遊びモーションを無効化
    if (enemyAnimState !== "idle") return;
    const actions: TrojanHorseState[] = ["attack", "damage", "exit"];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    setEnemyAnimState(randomAction);
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
            style={{ cursor: executingCard ? "default" : "pointer" }}
            title={executingCard ? "" : "クリックでモーションをテスト"}
          >
            <TrojanHorseIcon
              state={enemyAnimState}
              onAnimationComplete={(completedState) => {
                // 自動でidle等に戻す処理
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
              : "Code"}
        </div>

        {/* コードを1行ずつレンダリングしてハイライトを当てる */}
        <div className="codeBox">
          {(() => {
            const cardToDisplay = executingCard || selectedCard;
            if (!cardToDisplay) {
              return <div className="codeLine">カードを選んでコードを表示</div>;
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
