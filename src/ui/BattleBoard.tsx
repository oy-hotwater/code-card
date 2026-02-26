import { useState } from "react";
import type { Card } from "../game/types";
import type { TrojanHorseState } from "./components/TrojanHorseIcon";
import TrojanHorseIcon from "./components/TrojanHorseIcon";

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
  // アニメーションの状態管理を追加
  const [enemyState, setEnemyState] = useState<TrojanHorseState>("enter");

  // デバッグ用：クリックでランダムにアニメーションを再生
  const handleEnemyClick = () => {
    if (enemyState !== "idle") return; // 実行中なら無視
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
          {/* クリックイベントを追加 */}
          <div
            className="enemySprite"
            onClick={handleEnemyClick}
            style={{ cursor: "pointer" }}
            title="クリックでモーションをテスト"
          >
            <TrojanHorseIcon
              state={enemyState}
              onAnimationComplete={(completedState) => {
                // アニメーションが完了したら待機状態（idle）に戻す
                if (
                  completedState === "attack" ||
                  completedState === "damage" ||
                  completedState === "enter"
                ) {
                  setEnemyState("idle");
                } else if (completedState === "exit") {
                  // 退場後は再登場させる（テスト用）
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
