import type { Card } from "../game/types";

type Props = {
  enemyHp: number;
  playerHp: number;
  lastLog: string;
  onEndTurn: () => void;

  selectedCard: Card | null;
};

export function BattleBoard({ enemyHp, playerHp, lastLog, onEndTurn, selectedCard }: Props) {
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
        <div className="enemyDummy">ENEMY</div>
      </div>

      <div className="codePanel">
        <div className="codeTitle">
          {selectedCard ? `Code: ${selectedCard.name}` : "Code"}
        </div>
        <pre className="codeBox">
          <code>
            {selectedCard?.code ?? "カードをクリックしてコードを表示"}
          </code>
        </pre>
      </div>
    </div>
  );
}
