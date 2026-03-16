import { useBattleEngine } from "@/features/battle/hooks/useBattleEngine";
import { BattleBoard } from "./BattleBoard";
import { Hand } from "./Hand";

type Props = {
  onAbort: () => void;
};

export function BattleScreen({ onAbort }: Props) {
  // バトル画面がマウントされたら、エンジン（タイマーやAI制御）を起動する
  useBattleEngine();

  return (
    <div className="stage relative">
      <button className="abortBtn" onClick={onAbort}>
        &lt; abort()
      </button>

      {/* Propsのバケツリレーが不要になりました！ */}
      <BattleBoard />
      <Hand />
    </div>
  );
}
