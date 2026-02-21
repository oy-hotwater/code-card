type Props = {
  hp: number;
  enemyHp: number;
  damageText?: string; // 今は仮でOK
};

export default function BattlePanel({ hp, enemyHp, damageText }: Props) {
  return (
    <div className="panel battle">
      <div className="battleTop">
        <div className="statusBox">
          <div className="badge">自分HP</div>
          <div className="hp">{hp}</div>
        </div>
        <div className="statusBox">
          <div className="badge">敵HP</div>
          <div className="hp">{enemyHp}</div>
        </div>
      </div>

      <div className="battleStage">
        {/* ここにキャラ画像、揺れ、ダメージ数字などを描画していく */}
        {damageText ? <div className="damageFloat">{damageText}</div> : null}
      </div>
    </div>
  );
}
