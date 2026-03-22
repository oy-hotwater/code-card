import { CardView } from "@/features/battle/components/CardView";
import { useBattleStore } from "@/features/battle/stores/useBattleStore";

function fanTransform(index: number, count: number) {
  const mid = (count - 1) / 2;
  const dx = (index - mid) * 90;
  const rot = (index - mid) * 6;
  const lift = Math.abs(index - mid) * -2;
  return { x: dx, y: lift, rotate: rot };
}

export function Hand() {
  const store = useBattleStore();
  const { hand, deck, discard } = store.cards;

  // ここでフェーズから状態を算出する
  const isPlayerTurn = store.phase === "PLAYER_IDLE";
  const isExecuting = [
    "PLAYER_EXECUTING",
    "ENEMY_TURN_START",
    "ENEMY_ATTACKING",
    "TURN_END",
  ].includes(store.phase);

  return (
    <div className="bottomArea">
      {/* 山札 */}
      <div className="deckPile">
        <div className="pileIcon">📦</div>
        <div className="pileCount">{deck.length}</div>
        <div className="pileLabel">Deck</div>
      </div>

      {/* 手札 */}
      <div className="handWrap">
        <div className="hand">
          {hand.map((card, i) => {
            const t = fanTransform(i, hand.length);
            const isDragging = store.draggingId === card.uid;
            const isPlayable = isPlayerTurn && store.energy >= card.cost;

            return (
              <CardView
                key={card.uid}
                card={card}
                baseX={t.x}
                baseY={t.y}
                baseRotate={t.rotate}
                isPlayable={isPlayable}
                isDragging={isDragging}
                setDragging={(v) => store.setDraggingId(v ? card.uid : null)}
                onDropToPlayZone={() => store.playCard(card.uid)}
                selected={store.selectedId === card.uid}
                onHoverSelect={store.setSelectedId}
                isExecuting={isExecuting}
              />
            );
          })}
        </div>
        <div className="playHint">
          {isPlayerTurn
            ? "Drag up to play / Hover to inspect"
            : "Enemy is acting..."}
        </div>
      </div>

      {/* 捨て札 */}
      <div className="discardPile">
        <div className="pileIcon">🗑️</div>
        <div className="pileCount">{discard.length}</div>
        <div className="pileLabel">Discard</div>
      </div>
    </div>
  );
}
