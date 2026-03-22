import { useEffect } from "react";
import { useBattleStore } from "@/features/battle/stores/useBattleStore";
import { useDeckStore } from "@/features/editor/stores/useDeckStore";
import type { TrojanHorseState } from "@/components/TrojanHorseIcon";

export function useBattleEngine() {
  const store = useBattleStore();
  // デッキストアから現在のデッキを取得
  const currentDeck = useDeckStore((state) => state.deck);

  // 1. 初期化
  useEffect(() => {
    store.initGame(currentDeck);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ====================================================
  // 2. プレイヤーのカード（コード）実行フェーズ
  // ====================================================
  useEffect(() => {
    // 実行中フェーズでなければ何もしない
    if (store.phase !== "PLAYER_EXECUTING" || !store.executingCard) return;

    // 全ての行を実行し終えた場合 -> 実行終了処理
    if (store.currentLineIndex >= store.executingCard.codeLines.length) {
      const timer = setTimeout(() => {
        store.setExecutingCard(null);
        store.setCurrentLineIndex(-1);
        store.setEnemyAnimState("idle");
        // フェーズを待機状態に戻し、プレイヤーに操作権を返す
        store.setPhase("PLAYER_IDLE");
      }, 1000);
      return () => clearTimeout(timer);
    }

    // まだ実行する行が残っている場合 -> 1行実行して次の行へ
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

      // 次の行へ進める（これがトリガーとなり、再度このuseEffectが評価される）
      store.setCurrentLineIndex((prev) => prev + 1);
    }, 800);

    return () => clearTimeout(timer);
  }, [store.phase, store.executingCard, store.currentLineIndex]);

  // ====================================================
  // 3. 敵のターン開始フェーズ（モーションやログの提示）
  // ====================================================
  useEffect(() => {
    if (store.phase !== "ENEMY_TURN_START") return;

    const timer = setTimeout(() => {
      store.setEnemyAnimState("attack");
      store.setLastLog("TrojanHorse.execute('attack')");
      // 演出を見せた後、実際のダメージ計算フェーズへ移行
      store.setPhase("ENEMY_ATTACKING");
    }, 1000);

    return () => clearTimeout(timer);
  }, [store.phase]);

  // ====================================================
  // 4. 敵の攻撃実行フェーズ（ダメージ計算）
  // ====================================================
  useEffect(() => {
    if (store.phase !== "ENEMY_ATTACKING") return;

    const timer = setTimeout(() => {
      const damage = 8; // 敵の基礎攻撃力
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

      // ダメージ計算が終わったら、ターン終了フェーズへ移行
      store.setPhase("TURN_END");
    }, 700);

    return () => clearTimeout(timer);
  }, [store.phase]);

  // ====================================================
  // 5. ターン終了・次ターンの準備フェーズ
  // ====================================================
  useEffect(() => {
    if (store.phase !== "TURN_END") return;

    const timer = setTimeout(() => {
      store.setEnemyAnimState("idle");
      store.setEnergy(store.maxEnergy); // エネルギー回復
      store.setPlayerBlock(0); // ブロックリセット
      store.setLastLog("Your turn. Draw 4 cards.");
      store.drawCards(4); // ターン開始のドロー

      // 全ての準備が整ったら、プレイヤーに操作権を渡す
      store.setPhase("PLAYER_IDLE");
    }, 1300);

    return () => clearTimeout(timer);
  }, [store.phase]);
}
