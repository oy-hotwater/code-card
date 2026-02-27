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
          turn={game.turn}
          energy={game.energy}
          maxEnergy={game.maxEnergy}
          playerBlock={game.playerBlock}
          lastLog={game.lastLog}
          onEndTurn={game.endTurn}
          selectedCard={game.selectedCard}
          executingCard={game.executingCard}
          currentLineIndex={game.currentLineIndex}
          enemyAnimState={game.enemyAnimState}
          setEnemyAnimState={game.setEnemyAnimState}
        />

        <Hand
          cards={game.cards.hand}
          deckCount={game.cards.deck.length}
          discardCount={game.cards.discard.length}
          turn={game.turn}
          energy={game.energy}
          draggingId={game.draggingId}
          setDraggingId={game.setDraggingId}
          onPlayCard={game.playCard}
          selectedId={game.selectedId}
          onSelectCard={game.setSelectedId}
          isExecuting={game.isExecuting}
        />
      </div>
    </div>
  );
}
