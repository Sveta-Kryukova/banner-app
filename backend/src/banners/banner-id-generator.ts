
export class BannerIdSequence {
  private n: number;

  constructor(start: number) {
    this.n = start;
  }

  nextId(): number {
    const value = this.n;
    this.n += 1;
    return value;
  }
}
