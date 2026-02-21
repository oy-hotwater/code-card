import type { Card } from "../cards";
import CodeViewer from "./CodeViewer";

type Props = {
  card: Card;
  activeLineIndex: number;
  statusText: string;
  stepMs: number;
};

export default function CodePanel({ card, activeLineIndex, statusText, stepMs }: Props) {
  return (
    <div className="panel right">
      <div className="header">
        <h2>Pythonコード：{card.name}</h2>
        <div className="badge">{statusText}</div>
      </div>

      <CodeViewer lines={card.pythonLines} activeLineIndex={activeLineIndex} />

      <div className="footer">
        <div className="badge">現在行をハイライト（{stepMs}ms/行）</div>
      </div>
    </div>
  );
}
