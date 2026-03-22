import { useDeckStore } from "@/features/editor/stores/useDeckStore";

type Props = {
  onBack: () => void;
};

export function ScriptEditorScreen({ onBack }: Props) {
  const { collection, deck, addCardToDeck, removeCardFromDeck } =
    useDeckStore();

  return (
    <div className="dashboardScreen">
      <header className="dashboardHeader">
        <div className="headerTitle">/home/user/script_editor</div>
        <button
          className="abortBtn"
          style={{ position: "static" }}
          onClick={onBack}
        >
          &lt; back()
        </button>
      </header>

      <div
        style={{
          display: "flex",
          gap: "24px",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {/* 所持カード一覧 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <h2 className="sectionTitle">Collection</h2>
          <div
            className="sectionBox"
            style={{
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              alignContent: "flex-start",
            }}
          >
            {collection.map((card, i) => (
              <div
                key={`${card.uid}-${i}`}
                onClick={() => addCardToDeck(card)}
                style={{
                  padding: "8px",
                  border: "1px solid var(--py-border)",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                [{card.cost}] {card.name}
              </div>
            ))}
          </div>
        </div>

        {/* 現在のデッキ */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <h2 className="sectionTitle">Current Deck ({deck.length} cards)</h2>
          <div
            className="sectionBox"
            style={{
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              alignContent: "flex-start",
            }}
          >
            {deck.map((card, i) => (
              <div
                key={`${card.uid}-${i}`}
                onClick={() => removeCardFromDeck(card.uid)}
                style={{
                  padding: "8px",
                  border: "1px solid var(--py-accent)",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                [{card.cost}] {card.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
