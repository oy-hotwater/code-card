import { motion, useMotionValue } from "framer-motion";
import type { Card } from "../game/types";
import { useMemo, useState } from "react";

type Props = {
  card: Card;
  baseX: number;
  baseY: number;
  baseRotate: number;
  isPlayable: boolean; // 新規追加
  isDragging: boolean;
  setDragging: (v: boolean) => void;
  onDropToPlayZone: () => void;

  selected: boolean;
  onHoverSelect: (cardId: string) => void;
  isExecuting: boolean;
};

function rarityClass(r: Card["rarity"]) {
  if (r === "rare") return "rarityRare";
  if (r === "uncommon") return "rarityUncommon";
  return "rarityCommon";
}

export function CardView({
  card,
  baseX,
  baseY,
  baseRotate,
  isPlayable,
  isDragging,
  setDragging,
  onDropToPlayZone,
  selected,
  onHoverSelect,
  isExecuting,
}: Props) {
  const [hovered, setHovered] = useState(false);

  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  const liftY = useMemo(() => {
    if (isDragging) return 0;
    // プレイ不可な状態でもホバーはできるようにするが、少し控えめに上げる
    return hovered && !isExecuting ? -120 : 0;
  }, [hovered, isDragging, isExecuting]);

  const scale = isDragging ? 1.08 : hovered && !isExecuting ? 1.18 : 1.0;
  const rotate = isDragging ? 0 : baseRotate;

  function handleDragStart() {
    if (isExecuting || !isPlayable) return;
    setDragging(true);
    setHovered(false);
  }

  function handleDragEnd() {
    if (!isPlayable) return;

    const y = dragY.get();
    const x = dragX.get();
    const played = y < -140 && Math.abs(x) < 260;

    if (played && !isExecuting) onDropToPlayZone();

    dragX.set(0);
    dragY.set(0);
    setDragging(false);
  }

  return (
    <motion.div
      className={`card ${rarityClass(card.rarity)} ${isDragging ? "dragging" : ""} ${selected ? "selected" : ""} ${!isPlayable ? "disabled" : ""}`}
      style={{
        x: baseX,
        y: baseY,
        rotate,
        zIndex: isDragging ? 50 : hovered ? 20 : 1,
      }}
      animate={{ y: baseY + liftY, scale }}
      transition={{ type: "spring", stiffness: 500, damping: 35 }}
      onMouseEnter={() => {
        if (!isExecuting) {
          setHovered(true);
          onHoverSelect(card.id);
        }
      }}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        className="cardInner"
        drag={!isExecuting && isPlayable} // 実行中またはコスト不足・敵ターンならドラッグ無効
        dragMomentum={false}
        dragElastic={0.15}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        style={{ x: dragX, y: dragY }}
      >
        <div className="cardTop">
          <div className="cost">{card.cost}</div>
          <div className="name">{card.name}</div>
        </div>

        <div className="art">
          <div className="artDummy">{card.kind.toUpperCase()}</div>
        </div>

        <div className="text">{card.text}</div>

        <div className="cardBottom">
          <span className="pill">{card.rarity}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
