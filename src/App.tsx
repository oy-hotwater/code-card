import { useEffect, useMemo, useRef, useState } from "react";
import { CARDS, type Card } from "./cards";
import HandPanel from "./components/HandPanel";
import CodePanel from "./components/CodePanel";

type Ctx = {
  tempValue: number;
  flash: () => void;
  setTemp: (v: number) => void;
};

type Step = {
  kind: "noop" | "assign" | "if" | "return";
  exec: (ctx: Ctx) => void;
};

const TURN_INITIAL_VALUE = 1;
const STEP_MS = 600;

function compilePythonLines(lines: string[]): Step[] {
  const steps: Step[] = [];
  const indentOf = (s: string) => s.match(/^\s*/)?.[0].length ?? 0;
  let skipUntilIndent: number | null = null;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trimEnd();
    const trimmed = line.trim();
    const ind = indentOf(raw);

    if (skipUntilIndent !== null) {
      if (ind > skipUntilIndent) {
        steps.push({ kind: "noop", exec: () => {} });
        continue;
      } else {
        skipUntilIndent = null;
      }
    }

    if (trimmed.startsWith("def ") || trimmed === "") {
      steps.push({ kind: "noop", exec: () => {} });
      continue;
    }

    if (/^return\s+x\s*$/.test(trimmed)) {
      steps.push({ kind: "return", exec: () => {} });
      continue;
    }

    const ifm = trimmed.match(/^if\s+x\s*(<|>|==)\s*(-?\d+)\s*:\s*$/);
    if (ifm) {
      const op = ifm[1] as "<" | ">" | "==";
      const n = Number(ifm[2]);
      const thisIndent = ind;

      steps.push({
        kind: "if",
        exec: (ctx) => {
          const x = ctx.tempValue;
          const ok = op === "<" ? x < n : op === ">" ? x > n : x === n;
          if (!ok) skipUntilIndent = thisIndent;
        },
      });
      continue;
    }

    const asm = trimmed.match(/^x\s*=\s*x\s*(\+|-|\*|\/\/)\s*(-?\d+)\s*$/);
    if (asm) {
      const op = asm[1] as "+" | "-" | "*" | "//";
      const n = Number(asm[2]);

      steps.push({
        kind: "assign",
        exec: (ctx) => {
          const before = ctx.tempValue;
          let after = before;
          if (op === "+") after = before + n;
          if (op === "-") after = before - n;
          if (op === "*") after = before * n;
          if (op === "//") after = Math.trunc(before / n);

          if (after !== before) {
            ctx.setTemp(after);
            ctx.flash();
          }
        },
      });
      continue;
    }

    steps.push({ kind: "noop", exec: () => {} });
  }

  return steps;
}

export default function App() {
  const [selectedCardId, setSelectedCardId] = useState(CARDS[0].id);
  const [turnValue, setTurnValue] = useState(TURN_INITIAL_VALUE);
  const [tempValue, setTempValue] = useState(TURN_INITIAL_VALUE);
  const [activeLineIndex, setActiveLineIndex] = useState(-1);
  const [tempFlash, setTempFlash] = useState(false);

  // derived
  const selectedCard: Card = useMemo(
    () => CARDS.find((c) => c.id === selectedCardId)!,
    [selectedCardId],
  );

  // ✅ steps は state じゃなく useMemo（カードが変わった時だけ作り直す）
  const steps: Step[] = useMemo(() => {
    return compilePythonLines(selectedCard.pythonLines);
  }, [selectedCard.pythonLines]);

  // refs（タイマーや「最新値」参照用）
  const timerRef = useRef<number | null>(null);
  const tempRef = useRef(tempValue);
  const stepsRef = useRef(steps);
  const activeRef = useRef(activeLineIndex);

  // ref同期
  useEffect(() => {
    tempRef.current = tempValue;
  }, [tempValue]);

  useEffect(() => {
    stepsRef.current = steps;
  }, [steps]);

  useEffect(() => {
    activeRef.current = activeLineIndex;
  }, [activeLineIndex]);

  function stopRun() {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  // フラッシュは短時間で戻す
  useEffect(() => {
    if (!tempFlash) return;
    const t = window.setTimeout(() => setTempFlash(false), 50);
    return () => window.clearTimeout(t);
  }, [tempFlash]);

  // アンマウント時
  useEffect(() => stopRun, []);

  function startTurn() {
    stopRun();
    setActiveLineIndex(-1);
    setTurnValue(TURN_INITIAL_VALUE);
    setTempValue(TURN_INITIAL_VALUE);
  }

  function endTurn() {
    console.log("endTurn (placeholder): damage =", turnValue);
  }

  function flashTemp() {
    setTempFlash(false);
    requestAnimationFrame(() => setTempFlash(true));
  }

  function run() {
    stopRun();

    // 開始時にリセット
    activeRef.current = -1;
    setActiveLineIndex(-1);

    // 実行開始時にコピー
    setTempValue(turnValue);

    const ctx: Ctx = {
      tempValue: tempRef.current,
      setTemp: setTempValue,
      flash: flashTemp,
    };

    timerRef.current = window.setInterval(() => {
      const next = activeRef.current + 1;
      setActiveLineIndex(next);

      const step = stepsRef.current[next];
      if (step) {
        ctx.tempValue = tempRef.current;
        step.exec(ctx);
      }

      if (next >= selectedCard.pythonLines.length) {
        stopRun();
        setTurnValue(tempRef.current);
      }
    }, STEP_MS);
  }

  function handleSelectCard(id: string) {
    stopRun();
    setSelectedCardId(id);
    setActiveLineIndex(-1);
  }

  const statusText =
    activeLineIndex < 0
      ? "未実行"
      : activeLineIndex >= selectedCard.pythonLines.length
        ? "完了"
        : `実行中… 行 ${activeLineIndex + 1}/${selectedCard.pythonLines.length}`;

  return (
    <div className="appRoot">
      <div className="leftColumn">
        <div className="battleArea">
          <div className="panel battle">
            <div className="badge">バトルエリア</div>
          </div>
        </div>

        <div className="handArea">
          <HandPanel
            cards={CARDS}
            selectedCardId={selectedCardId}
            onSelectCard={handleSelectCard}
            turnValue={turnValue}
            tempValue={tempValue}
            tempFlash={tempFlash}
            onStartTurn={startTurn}
            onRun={run}
            onEndTurn={endTurn}
          />
        </div>
      </div>

      <CodePanel
        card={selectedCard}
        activeLineIndex={activeLineIndex}
        statusText={statusText}
        stepMs={STEP_MS}
      />
    </div>
  );
}
