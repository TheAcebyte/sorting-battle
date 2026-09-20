import { Easing, easeOutExpo } from "@shared/easings";
import { Interpolator } from "@shared/interpolator";
import { Bar } from "@shared/types";

type InterpolatedBar = Bar & { interpolatedX: Interpolator };

interface RendererOptions {
  color: string;
  playerColor: string;
  width: number;
  heightStep: number;
  gap: number;
  swapDuration: number;
  easing: Easing;
}

const defaultRendererOptions = {
  color: "white",
  playerColor: "black",
  width: 32,
  heightStep: 4,
  gap: 16,
  swapDuration: 500,
  easing: easeOutExpo,
} as const satisfies RendererOptions;

export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private barMap: Map<string, InterpolatedBar>;
  private playerId: string | null;
  private options: RendererOptions;

  public constructor(
    canvas: HTMLCanvasElement,
    options: Partial<RendererOptions> = {},
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.barMap = new Map();
    this.playerId = null;
    this.options = { ...defaultRendererOptions, ...options };
    this.fitCanvasSize();
  }

  private fitCanvasSize() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  private clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public setPlayerId(playerId: string) {
    this.playerId = playerId;
  }

  public updateBars(bars: Bar[]) {
    const n = bars.length;
    const calculateBarX = (index: number) => {
      const { width, gap } = this.options;
      const listWidth = n * width + (n - 1) * gap;
      const startX = (this.canvas.width - listWidth) / 2;
      const x = startX + index * (width + gap);
      return x;
    };

    const temp = new Map<string, InterpolatedBar>();
    for (let i = 0; i < n; ++i) {
      const bar = bars[i];
      const x = calculateBarX(i);
      if (this.barMap.has(bar.barId)) {
        const { interpolatedX } = this.barMap.get(bar.barId)!;
        interpolatedX.set(x, this.options.swapDuration);
        temp.set(bar.barId, { ...bar, interpolatedX });
      } else {
        const interpolatedX = new Interpolator(x, this.options.easing);
        temp.set(bar.barId, { ...bar, interpolatedX });
      }
    }

    this.barMap = temp;
  }

  private drawBar(bar: InterpolatedBar) {
    const { color, playerColor, width, heightStep } = this.options;
    const height = bar.height * heightStep;
    const x = bar.interpolatedX.get();
    const y = this.canvas.height - height;
    const isPlayerBar = this.playerId && bar.playerId === this.playerId;
    this.ctx.fillStyle = isPlayerBar ? playerColor : color;
    this.ctx.fillRect(x, y, width, height);
  }

  public renderBars() {
    this.clearCanvas();
    const bars = this.barMap.values();
    let playerBar: InterpolatedBar | null = null;
    for (const bar of bars) {
      const isPlayerBar = this.playerId && bar.playerId === this.playerId;
      if (isPlayerBar) {
        playerBar = bar;
        continue;
      }

      this.drawBar(bar);
    }

    // Drawing the player bar for last to sit above the others
    if (playerBar) {
      this.drawBar(playerBar);
    }
  }
}
