export type Easing = (x: number) => number;

export function easeLinear(x: number) {
  return x;
}

export function easeOutExpo(x: number) {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}
