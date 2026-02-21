import type { Card } from "../cards";

type Props = {
    cards: Card[];
    selectedCardId: string;
    onSelectCard: (id: string) => void;
};

export default function CardList({ cards, selectedCardId, onSelectCard }: Props) {
    return (
        <div className="list">
            {cards.map((c) => (
                <button
                    key={c.id}
                    className={`cardbtn ${c.id === selectedCardId ? "selected" : ""}`}
                    onClick={() => onSelectCard(c.id)}
                >
                    ({c.cost}) {c.name}
                </button>
            ))}
        </div>
    );
}