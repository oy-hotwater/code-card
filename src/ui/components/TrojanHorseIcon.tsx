import { motion, type Variants } from "framer-motion";

export type TrojanHorseState = "enter" | "idle" | "attack" | "damage" | "exit";

type Props = {
  state?: TrojanHorseState;
  size?: number;
  onAnimationComplete?: (state: TrojanHorseState) => void;
};

// 状態ごとのアニメーション定義（サイバーパンク風の光と動き）
const horseVariants: Variants = {
  enter: {
    x: 200,
    opacity: 0,
    scale: 0.8,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
  idle: {
    x: 0,
    y: [0, -6, 0], // ホバーエンジンのような浮遊感
    rotate: [0, -1, 0, 1, 0],
    opacity: 1,
    scale: 1,
    // シアンブルーのネオンシャドウ
    filter: "drop-shadow(0px 15px 25px rgba(0, 243, 255, 0.2)) brightness(1)",
    transition: {
      y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
      rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" },
      x: { type: "spring", stiffness: 300, damping: 25 },
    },
  },
  attack: {
    x: [0, 50, -180, 0], // チャージしてからの高速突進
    y: [0, -10, 5, 0],
    rotate: [0, 12, -8, 0],
    scale: [1, 0.95, 1.15, 1],
    transition: {
      duration: 0.7,
      times: [0, 0.3, 0.7, 1],
      ease: "anticipate", // よりメカニカルで鋭い動き
    },
  },
  damage: {
    // グリッチ風に細かく激しくブレる
    x: [0, 15, -15, 10, -10, 5, 0],
    y: [0, -5, 5, -5, 5, 0],
    rotate: [0, 3, -4, 5, -2, 0],
    filter: [
      "drop-shadow(0px 15px 25px rgba(0, 243, 255, 0.2)) brightness(1)",
      // エラーを表現する赤いフラッシュと色相の乱れ
      "drop-shadow(0px 0px 40px rgba(255, 0, 60, 1)) brightness(2) saturate(3) hue-rotate(45deg)",
      "drop-shadow(0px 15px 25px rgba(0, 243, 255, 0.2)) brightness(1)",
    ],
    transition: {
      duration: 0.4,
      ease: "linear",
    },
  },
  exit: {
    opacity: 0,
    x: 100,
    y: 80,
    rotate: 45,
    scale: 0.8,
    filter: "brightness(0) blur(10px)", // シャットダウンするように消える
    transition: {
      duration: 0.6,
      ease: "easeIn",
    },
  },
};

export default function TrojanHorseIcon({
  size = 350,
  state = "idle",
  onAnimationComplete,
}: Props) {
  return (
    <motion.div
      variants={horseVariants}
      initial="enter"
      animate={state}
      onAnimationComplete={(definition) => {
        if (onAnimationComplete) {
          onAnimationComplete(definition as TrojanHorseState);
        }
      }}
      style={{
        width: size,
        height: size,
        transformOrigin: "center bottom",
        display: "inline-block",
      }}
    >
      {/* 近未来サイバーパンク風 トロイの木馬 */}
      <svg
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%" }}
      >
        <defs>
          <linearGradient id="cyberArmorMain" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="cyberArmorLight" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <radialGradient id="neonGlowCyan" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#00f3ff" />
            <stop offset="100%" stopColor="#00f3ff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* --- 奥のパーツ --- */}
        {/* 奥のホバーホイール */}
        <circle
          cx="80"
          cy="250"
          r="24"
          fill="#0f172a"
          stroke="#00f3ff"
          strokeWidth="2"
          opacity="0.8"
        />
        <circle
          cx="80"
          cy="250"
          r="10"
          fill="url(#neonGlowCyan)"
          opacity="0.6"
        />

        <circle
          cx="220"
          cy="250"
          r="24"
          fill="#0f172a"
          stroke="#00f3ff"
          strokeWidth="2"
          opacity="0.8"
        />
        <circle
          cx="220"
          cy="250"
          r="10"
          fill="url(#neonGlowCyan)"
          opacity="0.6"
        />

        {/* 奥の足（油圧シリンダー） */}
        <rect x="73" y="180" width="14" height="70" fill="#334155" />
        <rect x="76" y="210" width="8" height="40" fill="#cbd5e1" />
        <rect x="213" y="180" width="14" height="70" fill="#334155" />
        <rect x="216" y="210" width="8" height="40" fill="#cbd5e1" />

        {/* --- 尻尾（データケーブル/排気エフェクト） --- */}
        <path
          d="M245,100 Q280,100 270,160"
          fill="none"
          stroke="#00f3ff"
          strokeWidth="3"
          style={{ filter: "drop-shadow(0 0 4px #00f3ff)" }}
        />
        <path
          d="M245,110 Q290,120 280,170"
          fill="none"
          stroke="#ff003c"
          strokeWidth="2"
          style={{ filter: "drop-shadow(0 0 4px #ff003c)" }}
        />
        <path
          d="M245,120 Q300,130 275,180"
          fill="none"
          stroke="#00f3ff"
          strokeWidth="3"
          style={{ filter: "drop-shadow(0 0 4px #00f3ff)" }}
        />

        {/* --- 胴体（ステルス装甲） --- */}
        <path
          d="M40,100 L80,70 L190,70 L250,100 L240,160 L50,160 Z"
          fill="url(#cyberArmorMain)"
          stroke="#0ea5e9"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* 装甲のパネルライン */}
        <path d="M80,70 L80,160" stroke="#0ea5e9" strokeWidth="1.5" />
        <path d="M190,70 L190,160" stroke="#0ea5e9" strokeWidth="1.5" />
        <path d="M50,145 L243,145" stroke="#1e293b" strokeWidth="4" />

        {/* 発光するエネルギーライン */}
        <path
          d="M45,130 L245,130"
          stroke="#00f3ff"
          strokeWidth="2"
          style={{ filter: "drop-shadow(0 0 3px #00f3ff)" }}
        />

        {/* ハッチ（サーバーラック風エアロック） */}
        <rect
          x="110"
          y="90"
          width="60"
          height="35"
          rx="2"
          fill="#020617"
          stroke="#00f3ff"
          strokeWidth="2"
        />
        <line
          x1="120"
          y1="100"
          x2="160"
          y2="100"
          stroke="#ff003c"
          strokeWidth="2"
          style={{ filter: "drop-shadow(0 0 3px #ff003c)" }}
        />
        <line
          x1="120"
          y1="108"
          x2="160"
          y2="108"
          stroke="#00f3ff"
          strokeWidth="2"
          opacity="0.6"
        />
        <line
          x1="120"
          y1="116"
          x2="160"
          y2="116"
          stroke="#00f3ff"
          strokeWidth="2"
          opacity="0.6"
        />

        {/* ナンバリング / デカール */}
        <text
          x="198"
          y="95"
          fill="#334155"
          fontSize="16"
          fontWeight="bold"
          fontFamily="monospace"
          transform="rotate(10, 198, 95)"
        >
          TR-01
        </text>

        {/* --- 首・頭部 --- */}
        {/* 首 */}
        <path
          d="M50,100 L80,100 L100,30 L60,10 Z"
          fill="url(#cyberArmorLight)"
          stroke="#0ea5e9"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* 頭部コア */}
        <path
          d="M60,10 L100,30 L80,60 L20,40 Z"
          fill="url(#cyberArmorMain)"
          stroke="#0ea5e9"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* 顎・メカニカルパーツ */}
        <path
          d="M20,40 L40,60 L70,55"
          fill="none"
          stroke="#64748b"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* 目（サイクロプス型バイザー） */}
        <polygon
          points="30,30 80,18 80,24 30,35"
          fill="#ff003c"
          style={{ filter: "drop-shadow(0 0 6px #ff003c)" }}
        />
        <polygon
          points="32,31 78,20 78,22 32,33"
          fill="#ffffff"
          opacity="0.9"
        />

        {/* たてがみ（ホログラムエッジ/プラズマブレード） */}
        <path
          d="M60,10 L40,-10 L80,5 L70,-15 L95,15 L100,-5 L110,25"
          fill="none"
          stroke="#00f3ff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: "drop-shadow(0 0 5px #00f3ff)" }}
          opacity="0.8"
        />

        {/* --- 手前のパーツ --- */}
        {/* 手前の足（シリンダー機構） */}
        <rect
          x="93"
          y="160"
          width="14"
          height="90"
          fill="#1e293b"
          stroke="#00f3ff"
          strokeWidth="1"
        />
        <rect x="95" y="200" width="10" height="50" fill="#94a3b8" />
        <circle cx="100" cy="165" r="5" fill="#00f3ff" />

        <rect
          x="193"
          y="160"
          width="14"
          height="90"
          fill="#1e293b"
          stroke="#00f3ff"
          strokeWidth="1"
        />
        <rect x="195" y="200" width="10" height="50" fill="#94a3b8" />
        <circle cx="200" cy="165" r="5" fill="#00f3ff" />

        {/* 手前のホイール（マグネティック・ホバーリング） */}
        <circle
          cx="100"
          cy="260"
          r="30"
          fill="#0f172a"
          stroke="#00f3ff"
          strokeWidth="3"
          style={{ filter: "drop-shadow(0 0 8px rgba(0,243,255,0.4))" }}
        />
        <circle
          cx="100"
          cy="260"
          r="16"
          fill="#1e293b"
          stroke="#ff003c"
          strokeWidth="2"
        />
        <circle
          cx="100"
          cy="260"
          r="6"
          fill="#00f3ff"
          style={{ filter: "drop-shadow(0 0 5px #00f3ff)" }}
        />
        {/* スポーク十字 */}
        <line
          x1="70"
          y1="260"
          x2="130"
          y2="260"
          stroke="#0ea5e9"
          strokeWidth="3"
        />
        <line
          x1="100"
          y1="230"
          x2="100"
          y2="290"
          stroke="#0ea5e9"
          strokeWidth="3"
        />

        <circle
          cx="200"
          cy="260"
          r="30"
          fill="#0f172a"
          stroke="#00f3ff"
          strokeWidth="3"
          style={{ filter: "drop-shadow(0 0 8px rgba(0,243,255,0.4))" }}
        />
        <circle
          cx="200"
          cy="260"
          r="16"
          fill="#1e293b"
          stroke="#ff003c"
          strokeWidth="2"
        />
        <circle
          cx="200"
          cy="260"
          r="6"
          fill="#00f3ff"
          style={{ filter: "drop-shadow(0 0 5px #00f3ff)" }}
        />
        {/* スポーク十字 */}
        <line
          x1="170"
          y1="260"
          x2="230"
          y2="260"
          stroke="#0ea5e9"
          strokeWidth="3"
        />
        <line
          x1="200"
          y1="230"
          x2="200"
          y2="290"
          stroke="#0ea5e9"
          strokeWidth="3"
        />
      </svg>
    </motion.div>
  );
}
