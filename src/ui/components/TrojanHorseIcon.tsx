import { motion } from "framer-motion";

const TrojanHorse = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
      <motion.svg
        width="200"
        height="200"
        viewBox="0 0 100 100"
        initial="hidden"
        animate="visible"
        whileHover="hover"
      >
        {/* 台車（ベース） */}
        <motion.rect
          x="15"
          y="80"
          width="70"
          height="5"
          fill="#5D4037"
          variants={{
            hidden: { scaleX: 0 },
            visible: { scaleX: 1, transition: { duration: 0.5 } },
          }}
        />

        {/* 車輪 */}
        {[25, 75].map((cx, i) => (
          <motion.circle
            key={i}
            cx={cx}
            cy="88"
            r="4"
            fill="#3E2723"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { delay: 0.5 + i * 0.2 } },
              hover: {
                rotate: 360,
                transition: { repeat: Infinity, duration: 2, ease: "linear" },
              },
            }}
          />
        ))}

        {/* 木馬の本体（パス描画） */}
        <motion.path
          d="M 25 80 L 35 45 L 30 35 L 35 15 L 50 15 L 55 30 L 75 45 L 75 80 Z"
          fill="transparent"
          stroke="#8D6E63"
          strokeWidth="2"
          variants={{
            hidden: { pathLength: 0, fill: "rgba(141, 110, 99, 0)" },
            visible: {
              pathLength: 1,
              fill: "rgba(141, 110, 99, 1)",
              transition: {
                pathLength: { duration: 1.5, ease: "easeInOut" },
                fill: { delay: 1.2, duration: 0.8 },
              },
            },
            hover: {
              y: -2,
              transition: {
                repeat: Infinity,
                repeatType: "mirror",
                duration: 0.5,
              },
            },
          }}
        />

        {/* 目 */}
        <motion.circle
          cx="42"
          cy="22"
          r="1.5"
          fill="#FFF"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { delay: 2 } },
          }}
        />
      </motion.svg>
    </div>
  );
};

export default TrojanHorse;
