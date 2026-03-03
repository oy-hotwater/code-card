import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Props = {
  onComplete: () => void;
};

const bootLogs = [
  "Initializing system...",
  "Loading core modules...",
  "Mounting virtual environment...",
  "Checking dependencies...",
  "All systems GO.",
];

export function BootScreen({ onComplete }: Props) {
  const [logIndex, setLogIndex] = useState(0);

  // 起動ログを一定間隔で表示するアニメーション
  useEffect(() => {
    if (logIndex < bootLogs.length) {
      const timer = setTimeout(() => {
        setLogIndex((prev) => prev + 1);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [logIndex]);

  return (
    <div className="bootScreen" onClick={onComplete}>
      <div className="bootLogs">
        {bootLogs.slice(0, logIndex).map((log, i) => (
          <div key={i} className="bootLogLine">{`> ${log}`}</div>
        ))}
      </div>

      {/* ログ出力が完了したらタイトルを表示 */}
      {logIndex >= bootLogs.length && (
        <motion.div
          className="titleContainer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="gameTitle">
            <span className="keyword">def</span>{" "}
            <span className="functionName">virus_defender</span>():
          </h1>
          <motion.div
            className="pressAnyKey"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Click anywhere to continue_
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
