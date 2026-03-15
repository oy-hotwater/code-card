/**
 * 配列の要素をランダムに並び替える（フィッシャー–イェーツのシャッフル）
 * 元の配列は変更せず、新しい配列を返します。
 */
export function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
