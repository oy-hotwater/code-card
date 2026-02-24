import { useGame } from "./game/useGame";
import { BattleBoard } from "./ui/BattleBoard";
import { Hand } from "./ui/Hand";

export default function App() {
  const game = useGame();

  return (
    <div className="appRoot">
      <div className="stage">
        <BattleBoard
          enemyHp={game.enemyHp}
          playerHp={game.playerHp}
          lastLog={game.lastLog}
          onEndTurn={game.endTurn}
        />

        <Hand
          cards={game.hand}
          draggingId={game.draggingId}
          setDraggingId={game.setDraggingId}
          onPlayCard={game.playCard}
        />
      </div>
    </div>
  );
}
