export function getRandomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shuffleArray<T>(a: T[]) {
  const n = a.length;
  for (let i = n - 1; i >= 0; --i) {
    const j = getRandomInteger(0, i);
    const temp = a[i];
    a[i] = a[j];
    a[j] = temp;
  }
}
