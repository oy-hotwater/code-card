import type { Card, CardId } from "../game/types";
import { CardView } from "./CardView";

type Props = {
  cards: Card[];
  turn: "player" | "enemy";
  energy: number;

  draggingId: CardId | null;
  setDraggingId: (id: CardId | null) => void;
  onPlayCard: (cardId: CardId) => void;

  selectedId: CardId | null;
  onSelectCard: (cardId: CardId) => void;
  isExecuting: boolean;
};

function fanTransform(index: number, count: number) {
  const mid = (count - 1) / 2;
  const dx = (index - mid) * 90;
  const rot = (index - mid) * 6;
  const lift = Math.abs(index - mid) * -2;
  return { x: dx, y: lift, rotate: rot };
}

export function Hand({
  cards,
  turn,
  energy,
  draggingId,
  setDraggingId,
  onPlayCard,
  selectedId,
  onSelectCard,
  isExecuting,
}: Props) {
  return (
    <div className="handWrap">
      <div className="hand">
        {cards.map((card, i) => {
          const t = fanTransform(i, cards.length);
          const isDragging = draggingId === card.id;

          // プレイヤーのターンかつ、エネルギーが足りている場合のみプレイ可能
          const isPlayable = turn === "player" && energy >= card.cost;

          return (
            <CardView
              key={card.id}
              card={card}
              baseX={t.x}
              baseY={t.y}
              baseRotate={t.rotate}
              isPlayable={isPlayable}
              isDragging={isDragging}
              setDragging={(v) => setDraggingId(v ? card.id : null)}
              onDropToPlayZone={() => onPlayCard(card.id)}
              selected={selectedId === card.id}
              onHoverSelect={onSelectCard}
              isExecuting={isExecuting}
            />
          );
        })}
      </div>

      <div className="playHint">
        {turn === "player"
          ? "Drag up to play / Hover to inspect"
          : "Enemy is acting..."}
      </div>
    </div>
  );
}
