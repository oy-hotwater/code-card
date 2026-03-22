import TrojanHorseIcon from "@/components/TrojanHorseIcon";
import { motion } from "framer-motion";
import { useBattleStore } from "@/features/battle/stores/useBattleStore";

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

// Zustandにより、Propsの型定義を削除し、引数を空にできる
export function BattleBoard() {
  // Storeから必要な状態だけを抽出して購読する
  const store = useBattleStore();

  // ここでフェーズから状態を算出する
  //UI表示用（実行中もプレイヤーのターンとして扱う）
  const isPlayerPhase = ["PLAYER_IDLE", "PLAYER_EXECUTING"].includes(
    store.phase,
  );
  // ボタン制御用（操作できるのはIDLE時のみ）
  const canPlayerAct = store.phase === "PLAYER_IDLE";

  const isExecuting = [
    "PLAYER_EXECUTING",
    "ENEMY_TURN_START",
    "ENEMY_ATTACKING",
    "TURN_END",
  ].includes(store.phase);

  // 選択中のカードを特定
  const selectedCard =
    store.cards.hand.find((c) => c.uid === store.selectedId) ?? null;

  // HPバーの割合を計算 (0% ~ 100%)
  const playerHpPercent = Math.max(
    0,
    Math.min(100, (store.playerHp / store.maxPlayerHp) * 100),
  );
  const enemyHpPercent = Math.max(
    0,
    Math.min(100, (store.enemyHp / store.maxEnemyHp) * 100),
  );

  return (
    <div className="board">
      <div className="hud">
        <div
          className="turnIndicator"
          style={{ color: isPlayerPhase ? "var(--py-accent)" : "#ff4a4a" }}
        >
          {isPlayerPhase ? "▶ Player Turn" : "▶ Enemy Turn"}
        </div>

        <div className="hpRow">
          {/* Player HP */}
          <div className="hpBox">
            <div className="hpHeader">
              <div className="hpLabel">
                Player (Energy: {store.energy}/{store.maxEnergy})
              </div>
              <div
                className="hpValue"
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span>
                  {store.playerHp} / {store.maxPlayerHp} HP
                </span>
                {store.playerBlock > 0 && (
                  <span className="blockBadge">🛡️ {store.playerBlock}</span>
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

          {/* Enemy HPaaa */}
          <div className="hpBox">
            <div className="hpHeader">
              <div className="hpLabel">Enemy</div>
              <div className="hpValue">
                {store.enemyHp} / {store.maxEnemyHp} HP
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

        <div className="log">{store.lastLog}</div>

        <button
          className="endTurnBtn"
          onClick={store.endTurn}
          disabled={!canPlayerAct}
        >
          End Turn
        </button>
      </div>

      <div className="arena">
        <div className="enemyWrap">
          <div className="enemyName">TROJAN</div>
          <div
            className="enemySprite"
            style={{ cursor: isExecuting ? "default" : "pointer" }}
          >
            <TrojanHorseIcon
              state={store.enemyAnimState}
              onAnimationComplete={(completedState) => {
                if (["attack", "damage", "enter"].includes(completedState)) {
                  store.setEnemyAnimState("idle");
                } else if (completedState === "exit") {
                  setTimeout(() => store.setEnemyAnimState("enter"), 1000);
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="sidePanel">
        {/* Variables Panel */}
        <div className="panelSection watchSection">
          <div className="sectionTitle">Variables</div>
          <div className="sectionBox">
            <VarRow name="enemy_hp" value={store.enemyHp} />
            <VarRow name="player_hp" value={store.playerHp} />
            <VarRow name="player_block" value={store.playerBlock} />
            <VarRow name="energy" value={store.energy} />
            <div style={{ height: "8px" }} /> {/* 区切り */}
            <VarRow name="len(deck)" value={store.cards.deck.length} />
            <VarRow name="len(hand)" value={store.cards.hand.length} />
            <VarRow name="len(discard)" value={store.cards.discard.length} />
          </div>
        </div>

        {/* Code Panel */}
        <div className="panelSection codeSection">
          <div className="sectionTitle">
            {store.executingCard
              ? `Executing: ${store.executingCard.name}`
              : selectedCard
                ? `Code: ${selectedCard.name}`
                : "Code Explorer"}
          </div>

          <div className="sectionBox codeBox">
            {(() => {
              const cardToDisplay = store.executingCard || selectedCard;
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
                  store.executingCard != null && i === store.currentLineIndex;
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
