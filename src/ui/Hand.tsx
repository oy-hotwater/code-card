import type { Card, CardId } from "../game/types";
import { CardView } from "./CardView";

type Props = {
  cards: Card[];
  draggingId: CardId | null;
  setDraggingId: (id: CardId | null) => void;
  onPlayCard: (cardId: CardId) => void;
};

// ざっくり「中央に扇形」
// index → 角度/位置を決める
function fanTransform(index: number, count: number) {
  const mid = (count - 1) / 2;
  const dx = (index - mid) * 90; // 横の広がり
  const rot = (index - mid) * 6; // 扇の角度
  const lift = Math.abs(index - mid) * -2; // 端がちょい下がる
  return { x: dx, y: lift, rotate: rot };
}

export function Hand({ cards, draggingId, setDraggingId, onPlayCard }: Props) {
  return (
    <div className="handWrap">
      <div className="hand">
        {cards.map((card, i) => {
          const t = fanTransform(i, cards.length);
          const isDragging = draggingId === card.id;

          return (
            <CardView
              key={card.id}
              card={card}
              baseX={t.x}
              baseY={t.y}
              baseRotate={t.rotate}
              isDragging={isDragging}
              setDragging={(v) => setDraggingId(v ? card.id : null)}
              onDropToPlayZone={() => onPlayCard(card.id)}
            />
          );
        })}
      </div>

      <div className="playHint">Drag up to play</div>
    </div>
  );
}
