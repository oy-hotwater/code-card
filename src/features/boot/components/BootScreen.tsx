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
          <div className="editorTitleBlock">
            {/* メインタイトル (関数定義) */}
            <div className="titleMain">
              <span className="keyword">def</span>{" "}
              <span className="functionName">virus_defender</span>():
            </div>

            {/* 関数内部 (インデントブロック) */}
            <div className="indentBlock">
              {/* サブタイトル (コメント) */}
              <div className="titleSub">
                <span className="comment"># Coding Card Game</span>
              </div>

              {/* 指示 (キャレットとプレースホルダー) */}
              <div className="titleInstruction">
                <motion.span
                  className="caret"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  |
                </motion.span>
                <span className="instruction">click and write code here</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
