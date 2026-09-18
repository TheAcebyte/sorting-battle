import { Deque } from "@shared/deque";
import { shuffleArray } from "@shared/utils";

const config = {
  MIN_BAR_HEIGHT: 1,
  MAX_BAR_HEIGHT: 50,
} as const;

interface Bar {
  playerId: string;
  height: number;
}

class Team {
  private bars: Bar[];
  private availableHeights: Deque<number>;

  public constructor() {
    this.bars = [];
    this.availableHeights = this.generateAvailableHeights();
  }

  private generateAvailableHeights() {
    const length = config.MAX_BAR_HEIGHT - config.MIN_BAR_HEIGHT + 1;
    const heights = Array.from({ length }, (_, i) => config.MIN_BAR_HEIGHT + i);
    shuffleArray(heights);
    return new Deque<number>(heights);
  }

  public getBars() { return this.bars; }
  public getSize() { return this.bars.length; }

  private findPlayerIndex(playerId: string) {
    const i = this.bars.findIndex(bar => bar.playerId === playerId);
    if (i === -1) {
      throw new Error(`Could not find player with ID ${playerId}`);
    }

    return i;
  }

  public addPlayer(playerId: string) {
    if (this.availableHeights.isEmpty()) {
      throw new Error("List of available heights is empty");
    }

    const height = this.availableHeights.popLeft();
    const bar = { playerId, height };
    this.bars.push(bar);
  }

  public removePlayer(playerId: string) {
    const i = this.findPlayerIndex(playerId);
    const { height } = this.bars[i];
    this.bars.splice(i, -1);
    this.availableHeights.pushRight(height);
  }

  public shuffle() {
    shuffleArray(this.bars);
  }
}

export class GameState {}
