import { easeLinear, Easing } from "./easings";

export class Interpolator {
  private source: number;
  private target: number;
  private startTime: number;
  private endTime: number;
  private easing: Easing;

  public constructor(initialValue: number, easing: Easing = easeLinear) {
    this.source = this.target = initialValue;
    this.startTime = this.endTime = 0;
    this.easing = easing;
  }

  public getEasing() {
    return this.easing;
  }

  public setEasing(easing: Easing) {
    this.easing = easing;
  }

  public set(target: number, duration: number = 0) {
    if (target === this.target) return;
    this.source = this.get();
    this.target = target;
    this.startTime = performance.now();
    this.endTime = this.startTime + duration;
  }

  public get() {
    if (this.startTime == this.endTime) {
      return this.target;
    }

    const elapsedTime = performance.now() - this.startTime;
    const duration = this.endTime - this.startTime;
    const timeProgress = Math.min(elapsedTime / duration, 1);
    const valueProgress = this.easing(timeProgress);
    return this.source + (this.target - this.source) * valueProgress;
  }
};
