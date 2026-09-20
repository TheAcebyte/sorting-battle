import { Easing, easeLinear } from "./easings";

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

  public set(target: number, duration: number = 0) {
    if (target === this.target) return;
    this.source = this.get();
    this.target = target;
    this.startTime = performance.now();
    this.endTime = this.startTime + duration;
  }
}

type ColorFormat = "rgb" | "hex";
interface Color {
  r: number;
  g: number;
  b: number;
}

export class ColorInterpolator {
  private r: Interpolator;
  private g: Interpolator;
  private b: Interpolator;
  private easing: Easing;

  public constructor(color: string, easing: Easing = easeLinear) {
    const { r, g, b } = this.colorToRgb(color);
    this.r = new Interpolator(r, easing);
    this.g = new Interpolator(g, easing);
    this.b = new Interpolator(b, easing);
    this.easing = easing;
  }

  private RGB_PATTERN =
    /^rgb\(\s*(?<r>\d+)\s*,\s*(?<g>\d+)\s*,\s*(?<b>\d+)\s*\)$/;

  private HEX_PATTERN =
    /^#(?<r>[0-9a-f]{2})(?<g>[0-9a-f]{2})(?<b>[0-9a-f]{2})$/i;

  private colorToRgb(color: string): Color {
    const rgbMatch = this.RGB_PATTERN.exec(color);
    if (rgbMatch) {
      return {
        r: parseInt(rgbMatch.groups!.r),
        g: parseInt(rgbMatch.groups!.g),
        b: parseInt(rgbMatch.groups!.b),
      };
    }

    const hexMatch = this.HEX_PATTERN.exec(color);
    if (hexMatch) {
      return {
        r: parseInt(hexMatch.groups!.r, 16),
        g: parseInt(hexMatch.groups!.g, 16),
        b: parseInt(hexMatch.groups!.b, 16),
      };
    }

    throw new Error("Invalid color format");
  }

  private rgbToColor(rgb: Color, format: ColorFormat): string {
    if (format === "rgb") {
      const r = rgb.r;
      const g = rgb.g;
      const b = rgb.b;
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      const r = rgb.r.toString(16).padStart(2, "0");
      const g = rgb.g.toString(16).padStart(2, "0");
      const b = rgb.b.toString(16).padStart(2, "0");
      return `#${r}${g}${b}`;
    }
  }

  public getEasing() {
    return this.easing;
  }

  public setEasing(easing: Easing) {
    this.easing = easing;
    this.r.setEasing(easing);
    this.g.setEasing(easing);
    this.b.setEasing(easing);
  }

  public get(format: ColorFormat = "rgb") {
    const color = {
      r: Math.round(this.r.get()),
      g: Math.round(this.g.get()),
      b: Math.round(this.b.get()),
    };

    return this.rgbToColor(color, format);
  }

  public set(color: string, duration: number = 0) {
    const { r, g, b } = this.colorToRgb(color);
    this.r.set(r, duration);
    this.g.set(g, duration);
    this.b.set(b, duration);
  }
}
