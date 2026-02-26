import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

export type TrojanHorseState = "enter" | "idle" | "attack" | "damage" | "exit";

type Props = {
  state?: TrojanHorseState;
  size?: number;
  color?: string;
  onAnimationComplete?: (state: TrojanHorseState) => void;
};

// 状態ごとのアニメーション定義
const horseVariants: Variants = {
  enter: {
    x: 150,
    opacity: 0,
    scale: 0.8,
  },
  idle: {
    x: 0,
    y: [0, -8, 0], // 上下にゆっくり呼吸するように動く
    rotate: [0, -2, 0, 2, 0], // 前後にゆらゆら揺れる
    opacity: 1,
    scale: 1,
    // CSSのドロップシャドウを維持しつつ明るさを標準に
    filter: "brightness(1) drop-shadow(0px 10px 18px rgba(0,0,0,0.35))",
    transition: {
      y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
      rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" },
      // 他のアクション（攻撃など）からidleに戻る時の動き
      x: { type: "spring", stiffness: 300, damping: 25 },
      opacity: { duration: 0.4 },
      scale: { duration: 0.4 },
    },
  },
  attack: {
    // 後ろに少し引いてから、左(プレイヤー側)へ大きく突進する
    x: [0, 40, -150, 0],
    rotate: [0, 8, -15, 0],
    scale: [1, 0.95, 1.15, 1],
    transition: {
      duration: 0.7,
      times: [0, 0.3, 0.7, 1], // アニメーションの変化タイミング
      ease: "easeInOut",
    },
  },
  damage: {
    // ビクッと後ろに下がりながら激しく振動する
    x: [0, 15, -10, 15, -5, 0],
    rotate: [0, 5, -5, 3, -2, 0],
    // 赤くフラッシュさせる
    filter: [
      "brightness(1) drop-shadow(0px 10px 18px rgba(0,0,0,0.35))",
      "brightness(1.5) drop-shadow(0px 0px 30px rgba(255,0,0,0.9))",
      "brightness(1) drop-shadow(0px 10px 18px rgba(0,0,0,0.35))",
    ],
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
  exit: {
    opacity: 0,
    x: 100,
    y: 50,
    rotate: 45, // 倒れながら退場
    transition: {
      duration: 0.6,
      ease: "easeIn",
    },
  },
};

export default function TrojanHorseIcon({
  size = 350,
  color = "currentColor", // 親の文字色を継承
  state = "idle",
  onAnimationComplete,
}: Props) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 600 600"
      xmlns="http://www.w3.org/2000/svg"
      variants={horseVariants}
      initial="enter"
      animate={state}
      onAnimationComplete={(definition) => {
        // 単発アニメーション終了時にコールバックを呼ぶ
        if (onAnimationComplete) {
          onAnimationComplete(definition as TrojanHorseState);
        }
      }}
      style={{
        transformOrigin: "center bottom", // 足元を中心に揺れるように設定
        display: "block",
      }}
    >
      <g
        transform="translate(0,600) scale(0.1,-0.1)"
        fill={color}
        stroke="none"
        fillRule="evenodd"
      >
        <path d="M1640 4743 c-47 -8 -89 -18 -93 -23 -7 -6 31 -171 79 -347 5 -17 15 -23 43 -25 l38 -3 -229 -277 -229 -277 58 -153 58 -153 126 -3 126 -3 45 53 c36 42 61 60 122 86 69 29 81 31 116 22 22 -6 40 -14 40 -18 0 -4 -16 -113 -35 -242 -54 -357 -48 -498 30 -675 24 -56 21 -14 50 -772 l15 -393 -75 -150 -75 -150 370 0 370 0 5 23 c5 22 82 538 127 850 l23 157 135 0 c118 0 195 7 391 36 l45 6 13 -43 c33 -113 140 -286 230 -374 23 -21 41 -44 41 -50 0 -5 -49 -141 -110 -300 -60 -160 -110 -293 -110 -297 0 -5 92 -8 204 -8 l203 0 61 237 c34 131 69 270 78 310 17 71 17 71 41 56 22 -15 23 -20 23 -145 l0 -130 -56 -132 c-31 -72 -63 -146 -70 -164 l-14 -32 270 0 270 0 0 389 0 390 -42 48 c-102 118 -111 196 -42 371 26 64 55 144 65 177 l17 60 1 -262 1 -263 175 0 175 0 0 463 c0 527 1 521 -82 613 -79 86 -191 119 -322 94 l-66 -12 -52 47 c-69 62 -135 99 -233 132 l-80 27 -440 6 c-390 5 -446 8 -490 24 -67 24 -109 51 -141 89 l-26 31 93 31 c51 17 94 36 96 42 6 18 -46 212 -83 306 -144 375 -444 629 -827 702 -101 19 -333 18 -447 -2z m458 -99 c82 -17 228 -69 237 -85 9 -13 -77 -161 -90 -155 -5 3 -39 17 -75 32 -48 20 -73 37 -95 68 -42 57 -109 95 -189 108 -36 6 -68 9 -70 7 -2 -2 -6 -40 -8 -84 l-3 -80 -50 0 -50 0 -24 93 c-13 51 -22 95 -19 98 3 2 41 9 84 14 100 11 254 4 352 -16z" />
        <path d="M1777 4134 c-4 -4 -7 -27 -7 -51 l0 -43 51 0 50 0 -3 48 -3 47 -40 3 c-23 2 -44 0 -48 -4z" />
        <path d="M1435 3778 c-2 -7 -3 -29 -2 -48 2 -34 3 -35 50 -38 l47 -3 0 50 0 51 -45 0 c-28 0 -47 -5 -50 -12z" />
        <path d="M3160 3160 l0 -50 50 0 50 0 0 50 0 50 -50 0 -50 0 0 -50z" />
        <path d="M3400 3161 l0 -51 45 0 c39 0 45 3 51 24 3 13 4 35 2 47 -3 21 -9 24 -50 27 l-48 3 0 -50z" />
      </g>
    </motion.svg>
  );
}
