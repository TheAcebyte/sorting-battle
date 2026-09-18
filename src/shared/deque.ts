const INITIAL_CAPACITY = 10;
const GROWTH_FACTOR = 2;

function mod(x: number, m: number) {
  const r = x % m;
  return r < 0 ? r + m : r;
}

export class Deque<T> {
  private data: T[];
  private size: number;
  private l: number;
  private r: number;

  public constructor();
  public constructor(iterable: Iterable<T>);

  public constructor(iterable?: Iterable<T>) {
    this.data = new Array(INITIAL_CAPACITY);
    this.size = 0;
    this.l = 0;
    this.r = -1;

    if (!iterable) return;
    for (const value of iterable) {
      this.pushRight(value);
    }
  }

  public getSize() { return this.size; }
  public isEmpty() { return this.size == 0; }

  private resize() {
    if (this.data.length !== this.size) return;
    const temp = new Array<T>(GROWTH_FACTOR * this.data.length);
    for (let i = 0; i < this.size; ++i) {
      const j = mod(this.l + i, this.data.length);
      temp[i] = this.data[j];
    }

    this.data = temp;
    this.l = 0;
    this.r = this.size - 1;
  }

  public peekLeft() {
    if (this.data.length == 0) {
      throw new Error("Deque is empty");
    }

    return this.data[this.l];
  }
  public peekRight() {
    if (this.data.length == 0) {
      throw new Error("Deque is empty");
    }

    return this.data[this.r];
  }

  public pushLeft(value: T) {
    if (this.size == this.data.length) {
      this.resize();
    }

    this.l = mod(this.l - 1, this.data.length);
    this.data[this.l] = value;
    ++this.size;
  }

  public pushRight(value: T) {
    if (this.size == this.data.length) {
      this.resize();
    }

    this.r = mod(this.r + 1, this.data.length);
    this.data[this.r] = value;
    ++this.size;
  }

  public popLeft() {
    if (this.size == 0) {
      throw new Error("Deque is empty");
    }

    const value = this.data[this.l];
    this.l = mod(this.l + 1, this.data.length);
    --this.size;
    return value;
  }

  public popRight() {
    if (this.size == 0) {
      throw new Error("Deque is empty");
    }

    const value = this.data[this.r];
    this.r = mod(this.r - 1, this.data.length);
    --this.size;
    return value;
  }

  *[Symbol.iterator]() {
    for (let i = 0; i < this.size; ++i) {
      const j = mod(this.l + i, this.data.length);
      yield this.data[j];
    }
  }
}
