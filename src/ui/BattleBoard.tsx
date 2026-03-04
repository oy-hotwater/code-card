import type { Card } from "../game/types";
import TrojanHorseIcon, {
  type TrojanHorseState,
} from "./components/TrojanHorseIcon";
import { motion } from "framer-motion";

type Props = {
  enemyHp: number;
  maxEnemyHp: number;
  playerHp: number;
  maxPlayerHp: number;
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
  deckCount: number;
  handCount: number;
  discardCount: number;
};

// 変数ウォッチャー用コンポーネント（値が変化した時に光る）
function VarRow({
  name,
  value,
  type = "int",
}: {
  name: string;
  value: number | string;
  type?: string;
}) {
  return (
    <div className="varRow">
      <span className="varName">{name}</span>
      <span className="varType">: {type}</span>
      <span style={{ margin: "0 6px", color: "var(--py-text-main)" }}>=</span>
      <motion.span
        key={value}
        initial={{
          backgroundColor: "rgba(194, 201, 125, 0.8)",
          color: "#13171f",
        }}
        animate={{ backgroundColor: "rgba(0,0,0,0)", color: "#d19a66" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="varValue"
      >
        {value}
      </motion.span>
    </div>
  );
}

export function BattleBoard({
  enemyHp,
  maxEnemyHp,
  playerHp,
  maxPlayerHp,
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
  deckCount,
  handCount,
  discardCount,
}: Props) {
  const isPlayerTurn = turn === "player";

  // HPバーの割合を計算 (0% ~ 100%)
  const playerHpPercent = Math.max(
    0,
    Math.min(100, (playerHp / maxPlayerHp) * 100),
  );
  const enemyHpPercent = Math.max(
    0,
    Math.min(100, (enemyHp / maxEnemyHp) * 100),
  );

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
          {/* Player HP */}
          <div className="hpBox">
            <div className="hpHeader">
              <div className="hpLabel">
                Player (Energy: {energy}/{maxEnergy})
              </div>
              <div
                className="hpValue"
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span>
                  {playerHp} / {maxPlayerHp} HP
                </span>
                {playerBlock > 0 && (
                  <span className="blockBadge">🛡️ {playerBlock}</span>
                )}
              </div>
            </div>
            <div className="hpBarContainer">
              <div
                className="hpBarFill player"
                style={{ width: `${playerHpPercent}%` }}
              />
            </div>
          </div>

          {/* Enemy HP */}
          <div className="hpBox">
            <div className="hpHeader">
              <div className="hpLabel">Enemy</div>
              <div className="hpValue">
                {enemyHp} / {maxEnemyHp} HP
              </div>
            </div>
            <div className="hpBarContainer">
              <div
                className="hpBarFill enemy"
                style={{ width: `${enemyHpPercent}%` }}
              />
            </div>
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

      <div className="sidePanel">
        {/* Variables Panel (Watch) */}
        <div className="panelSection watchSection">
          <div className="sectionTitle">Variables</div>
          <div className="sectionBox">
            <VarRow name="enemy_hp" value={enemyHp} />
            <VarRow name="player_hp" value={playerHp} />
            <VarRow name="player_block" value={playerBlock} />
            <VarRow name="energy" value={energy} />
            <div style={{ height: "8px" }} /> {/* 区切り */}
            <VarRow name="len(deck)" value={deckCount} />
            <VarRow name="len(hand)" value={handCount} />
            <VarRow name="len(discard)" value={discardCount} />
          </div>
        </div>

        {/* Code Panel */}
        <div className="panelSection codeSection">
          <div className="sectionTitle">
            {executingCard
              ? `Executing: ${executingCard.name}`
              : selectedCard
                ? `Code: ${selectedCard.name}`
                : "Code Explorer"}
          </div>

          <div className="sectionBox codeBox">
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
                const isActive =
                  executingCard != null && i === currentLineIndex;
                return (
                  <div
                    key={i}
                    className={`codeLine ${isActive ? "active" : ""}`}
                  >
                    {line.text === "" ? " " : line.text}
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
