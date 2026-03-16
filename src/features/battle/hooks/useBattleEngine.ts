import { useEffect } from "react";
import { useBattleStore } from "@/features/battle/stores/useBattleStore";
import type { TrojanHorseState } from "@/components/TrojanHorseIcon";

export function useBattleEngine() {
  const store = useBattleStore();

  // 1. 初期化
  useEffect(() => {
    store.initGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. ステップ実行ロジック (カードのコードを1行ずつ実行)
  useEffect(() => {
    if (!store.executingCard) return;

    if (store.currentLineIndex >= store.executingCard.codeLines.length) {
      const timer = setTimeout(() => {
        store.setExecutingCard(null);
        store.setCurrentLineIndex(-1);
        store.setEnemyAnimState("idle");
      }, 1000);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      const line = store.executingCard!.codeLines[store.currentLineIndex];

      if (line.log) store.setLastLog(line.log);

      if (line.enemyHpDelta) {
        store.setEnemyHp((hp) =>
          Math.min(store.maxEnemyHp, Math.max(0, hp + line.enemyHpDelta!)),
        );
      }
      if (line.playerHpDelta) {
        store.setPlayerHp((hp) =>
          Math.min(store.maxPlayerHp, Math.max(0, hp + line.playerHpDelta!)),
        );
      }
      if (line.playerBlockDelta) {
        store.setPlayerBlock((block) => block + line.playerBlockDelta!);
      }
      if (line.playerDrawDelta) {
        store.drawCards(line.playerDrawDelta);
      }
      if (line.animTrigger) {
        store.setEnemyAnimState(line.animTrigger as TrojanHorseState);
      }

      store.setCurrentLineIndex((prev) => prev + 1);
    }, 800);

    return () => clearTimeout(timer);
  }, [store.executingCard, store.currentLineIndex]);

  // 3. 敵のターン制御
  useEffect(() => {
    if (store.turn !== "enemy") return;

    const timer1 = setTimeout(() => {
      store.setEnemyAnimState("attack");
      store.setLastLog("TrojanHorse.execute('attack')");
    }, 1000);

    const timer2 = setTimeout(() => {
      const damage = 8;
      store.setPlayerBlock((currentBlock) => {
        let remainingDamage = damage;
        let newBlock = currentBlock;

        if (currentBlock > 0) {
          if (currentBlock >= damage) {
            newBlock -= damage;
            remainingDamage = 0;
            store.setLastLog(`Block absorbed ${damage} damage!`);
          } else {
            remainingDamage -= currentBlock;
            store.setLastLog(`Block absorbed ${currentBlock} damage!`);
            newBlock = 0;
          }
        }

        if (remainingDamage > 0) {
          store.setPlayerHp((hp) => Math.max(0, hp - remainingDamage));
          if (currentBlock === 0)
            store.setLastLog(`Enemy dealt ${damage} damage!`);
        }
        return newBlock;
      });
    }, 1700);

    const timer3 = setTimeout(() => {
      store.setEnemyAnimState("idle");
      store.setTurn("player");
      store.setEnergy(store.maxEnergy);
      store.setPlayerBlock(0);
      store.setLastLog("Your turn. Draw 4 cards.");
      store.drawCards(4);
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [store.turn]);
}
