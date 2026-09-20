export function swap<T>(a: T, i: keyof T, j: keyof T) {
  const temp = a[i];
  a[i] = a[j];
  a[j] = temp;
}

export function getRandomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shuffleArray<T>(a: T[], derangement: boolean = false) {
  const n = a.length;
  const offset = derangement ? 1 : 0;
  for (let i = n - 1; i > 0; --i) {
    const j = getRandomInteger(0, i - offset);
    swap(a, i, j);
  }
}

export function keyedMin<T>(a: T, b: T, key: (x: T) => number) {
  return key(a) <= key(b) ? a : b;
}

export function keyedMax<T>(a: T, b: T, key: (x: T) => number) {
  return key(a) >= key(b) ? a : b;
}
