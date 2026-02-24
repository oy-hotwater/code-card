import { motion, useMotionValue } from "framer-motion";
import type { Card } from "../game/types";
import { useMemo, useState } from "react";

type Props = {
  card: Card;
  baseX: number;
  baseY: number;
  baseRotate: number;
  isDragging: boolean;
  setDragging: (v: boolean) => void;
  onDropToPlayZone: () => void;

  selected: boolean;
  onHoverSelect: (cardId: string) => void;
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
  isDragging,
  setDragging,
  onDropToPlayZone,
  selected,
  onHoverSelect,
}: Props) {
  const [hovered, setHovered] = useState(false);

  // drag中の位置（手札の扇形レイアウトとは別に「掴んで動かす」値）
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  const liftY = useMemo(() => {
    // hovered時は持ち上げる。drag中はもっと自由に（ここでは固定値にしない）
    if (isDragging) return 0;
    return hovered ? -120 : 0;
  }, [hovered, isDragging]);

  const scale = isDragging ? 1.08 : hovered ? 1.18 : 1.0;
  const rotate = isDragging ? 0 : baseRotate;

  function handleDragStart() {
    setDragging(true);
    setHovered(false);
  }

  function handleDragEnd() {
    // ざっくり判定：「上に持っていったらプレイ」
    // StSっぽくしたいなら、ここを「プレイゾーンの当たり判定」へ置換する
    const y = dragY.get();
    const x = dragX.get();
    const played = y < -140 && Math.abs(x) < 260;

    if (played) onDropToPlayZone();

    // 位置を戻す（手札位置へスナップ）
    dragX.set(0);
    dragY.set(0);
    setDragging(false);
  }

  return (
    <motion.div
      className={`card ${rarityClass(card.rarity)} ${isDragging ? "dragging" : ""} ${selected ? "selected" : ""}`}
      style={{
        x: baseX,
        y: baseY,
        rotate,
        zIndex: isDragging ? 50 : hovered ? 20 : 1,
      }}
      animate={{ y: baseY + liftY, scale }}
      transition={{ type: "spring", stiffness: 500, damping: 35 }}
      onMouseEnter={() => {
        setHovered(true);
        onHoverSelect(card.id);
      }}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        className="cardInner"
        drag
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
