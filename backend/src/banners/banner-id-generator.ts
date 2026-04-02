export function* sequentialBannerIds(start: number): Generator<number, never, void> {
  let n = start;
  while (true) {
    yield n;
    n += 1;
  }
}
