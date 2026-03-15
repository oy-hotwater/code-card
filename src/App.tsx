import { useState } from "react";
import { useGame } from "@/game/useGame";
import { BattleBoard } from "@/ui/BattleBoard";
import { Hand } from "@/ui/Hand";
import { BootScreen } from "@/ui/screens/BootScreen";
import { DashboardScreen } from "@/ui/screens/DashboardScreen";

export type ScreenType = "boot" | "dashboard" | "battle";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("boot");
  const game = useGame();

  return (
    <div className="appRoot">
      {/* 1. タイトル画面 */}
      {currentScreen === "boot" && (
        <BootScreen onComplete={() => setCurrentScreen("dashboard")} />
      )}

      {/* 2. メインメニュー画面 */}
      {currentScreen === "dashboard" && (
        <DashboardScreen onNavigate={(screen) => setCurrentScreen(screen)} />
      )}

      {/* 3. バトル画面 */}
      {currentScreen === "battle" && (
        <div className="stage relative">
          {/* ダッシュボードに戻るための中断ボタン */}
          <button
            className="abortBtn"
            onClick={() => setCurrentScreen("dashboard")}
          >
            &lt; abort()
          </button>

          <BattleBoard
            enemyHp={game.enemyHp}
            maxEnemyHp={game.maxEnemyHp}
            playerHp={game.playerHp}
            maxPlayerHp={game.maxPlayerHp}
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
            deckCount={game.cards.deck.length}
            handCount={game.cards.hand.length}
            discardCount={game.cards.discard.length}
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
      )}
    </div>
  );
}
