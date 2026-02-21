import type { Card } from "../cards";
import TurnValueBox from "./TurnValueBox";
import CardList from "./CardList";

type Props = {
  cards: Card[];
  selectedCardId: string;
  onSelectCard: (id: string) => void;

  turnValue: number;
  tempValue: number;
  tempFlash: boolean;

  onStartTurn: () => void;
  onRun: () => void;
  onEndTurn: () => void;
};

export default function HandPanel(props: Props) {
  const {
    cards,
    selectedCardId,
    onSelectCard,
    turnValue,
    tempValue,
    tempFlash,
    onStartTurn,
    onRun,
    onEndTurn,
  } = props;

  return (
    <div className="panel left">
      <div className="header">
        <div>
          <h2>手札（Card = 1関数）</h2>
          <div className="badge">このターンの数値</div>
        </div>

        <TurnValueBox turnValue={turnValue} tempValue={tempValue} tempFlash={tempFlash} />
      </div>

      <CardList cards={cards} selectedCardId={selectedCardId} onSelectCard={onSelectCard} />

      <div className="footer">
        <button onClick={onStartTurn}>自ターンの開始</button>
        <button onClick={onRun}>実行 ▶</button>
        <button className="ghost" onClick={onEndTurn}>
          自ターンの終了
        </button>
      </div>
    </div>
  );
}
