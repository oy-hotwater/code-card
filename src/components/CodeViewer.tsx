type Props = {
  lines: string[];
  activeLineIndex: number;
};

function escapeHtml(s: string) {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

export default function CodeViewer({ lines, activeLineIndex }: Props) {
  return (
    <div className="codewrap">
      <div className="code">
        {lines.map((line, idx) => (
          <div key={idx} className={`line ${idx === activeLineIndex ? "active" : ""}`}>
            <div className="ln">{idx + 1}</div>
            <div className="text" dangerouslySetInnerHTML={{ __html: escapeHtml(line) }} />
          </div>
        ))}
      </div>
    </div>
  );
}
