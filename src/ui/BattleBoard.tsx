type Props = {
  enemyHp: number;
  playerHp: number;
  lastLog: string;
  onEndTurn: () => void;
};

export function BattleBoard({ enemyHp, playerHp, lastLog, onEndTurn }: Props) {
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
    </div>
  );
}
