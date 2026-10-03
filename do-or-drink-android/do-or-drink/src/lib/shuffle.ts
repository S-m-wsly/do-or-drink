export function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function pickUnused(pool: readonly string[], used: Set<number>): { text: string; index: number } {
  let available = pool.map((_, i) => i).filter((i) => !used.has(i));
  if (available.length === 0) {
    used.clear();
    available = pool.map((_, i) => i);
  }
  const index = available[Math.floor(Math.random() * available.length)]!;
  used.add(index);
  return { text: pool[index]!, index };
}
