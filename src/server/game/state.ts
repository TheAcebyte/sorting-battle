import { Deque } from "@shared/deque";
import { Bar } from "@shared/types";
import { keyedMax, keyedMin, shuffleArray, swap } from "@shared/utils";
import { randomUUID } from "crypto";
import { config } from "./config";

class Team {
  private bars: Bar[];
  private sortedBars: Bar[];
  private availableHeights: Deque<number>;
  private score: number;

  public constructor() {
    this.bars = [];
    this.sortedBars = [];
    this.availableHeights = this.generateAvailableHeights();
    this.score = 0;
  }

  private generateAvailableHeights() {
    const length = config.MAX_BAR_HEIGHT - config.MIN_BAR_HEIGHT + 1;
    const heights = Array.from({ length }, (_, i) => config.MIN_BAR_HEIGHT + i);
    shuffleArray(heights);
    return new Deque<number>(heights);
  }

  public getBars() {
    return this.bars;
  }

  public getSize() {
    return this.bars.length;
  }

  private getPlayerIndex(playerId: string) {
    const i = this.bars.findIndex(bar => bar.playerId === playerId);
    if (i === -1) {
      throw new Error(`Could not find player with ID ${playerId}`);
    }

    return i;
  }

  public hasPlayer(playerId: string) {
    return this.bars.some(bar => bar.playerId === playerId);
  }

  private getHeightRank(height: number) {
    const n = this.sortedBars.length;
    let l = 0;
    let r = n;
    while (l < r) {
      const m = l + Math.floor((r - l) / 2);
      const bar = this.sortedBars[m];
      if (bar.height < height) {
        l = m + 1;
      } else {
        r = m;
      }
    }

    return l;
  }

  public addPlayer(playerId: string) {
    if (this.availableHeights.isEmpty()) {
      throw new Error("List of available heights is empty");
    }

    const barId = randomUUID();
    const height = this.availableHeights.popLeft();
    const bar = { barId, playerId, height };
    this.bars.push(bar);

    const i = this.getHeightRank(height);
    this.sortedBars = [
      ...this.sortedBars.slice(0, i),
      bar,
      ...this.sortedBars.slice(i),
    ];
    this.calculateScore();
  }

  public removePlayer(playerId: string) {
    const i = this.getPlayerIndex(playerId);
    const { height } = this.bars[i];
    this.bars.splice(i, 1);
    this.availableHeights.pushRight(height);

    const j = this.getHeightRank(height);
    this.sortedBars.splice(j, 1);
    this.calculateScore();
  }

  public popPlayer() {
    if (this.bars.length === 0) {
      throw new Error("Team is empty");
    }

    const { playerId, height } = this.bars.pop()!;
    this.availableHeights.pushRight(height);
    const i = this.getHeightRank(height);
    this.sortedBars.splice(i, 1);
    this.calculateScore();

    return playerId;
  }

  public swapPlayerLeft(playerId: string) {
    const i = this.getPlayerIndex(playerId);
    if (i === 0) return;

    this.decreaseScoreIfMatch(i - 1);
    this.decreaseScoreIfMatch(i);
    swap(this.bars, i - 1, i);
    this.increaseScoreIfMatch(i - 1);
    this.increaseScoreIfMatch(i);
  }

  public swapPlayerRight(playerId: string) {
    const n = this.bars.length;
    const i = this.getPlayerIndex(playerId);
    if (i === n - 1) return;

    this.decreaseScoreIfMatch(i);
    this.decreaseScoreIfMatch(i + 1);
    swap(this.bars, i, i + 1);
    this.increaseScoreIfMatch(i);
    this.increaseScoreIfMatch(i + 1);
  }

  public shuffle() {
    this.bars = [...this.sortedBars];
    shuffleArray(this.bars, true);
    this.calculateScore();
  }

  public getScore() {
    return this.score;
  }

  public hasPerfectScore() {
    const n = this.bars.length;
    return this.score === n;
  }

  public calculateScore() {
    const n = this.bars.length;
    this.score = 0;
    for (let i = 0; i < n; ++i) {
      this.increaseScoreIfMatch(i);
    }
  }

  public decreaseScoreIfMatch(i: number) {
    if (this.bars[i].height === this.sortedBars[i].height) {
      --this.score;
    }
  }

  public increaseScoreIfMatch(i: number) {
    if (this.bars[i].height === this.sortedBars[i].height) {
      ++this.score;
    }
  }
}

type GameEventHandlers = {
  "player:change": (playerCount: number) => void;
  "paused:on": () => void;
  "paused:off": () => void;
};

type GameEventHandler = (...args: any[]) => void;
type GameEvent = keyof GameEventHandlers;

export class GameState {
  private paused: boolean;
  private teamOne: Team;
  private teamTwo: Team;
  private eventHandlerMap: Map<GameEvent, GameEventHandler[]>;

  public constructor() {
    this.paused = false;
    this.teamOne = new Team();
    this.teamTwo = new Team();
    this.eventHandlerMap = new Map();
  }

  public getPlayerCount() {
    return this.teamOne.getSize() + this.teamTwo.getSize();
  }

  public getTeamOneBars() {
    return this.teamOne.getBars();
  }

  public getTeamTwoBars() {
    return this.teamTwo.getBars();
  }

  public getTeamOneScore() {
    return this.teamOne.getScore();
  }

  public getTeamTwoScore() {
    return this.teamTwo.getScore();
  }

  public createPlayer() {
    const playerId = randomUUID();
    const team = keyedMin(this.teamOne, this.teamTwo, team => team.getSize());
    team.addPlayer(playerId);
    this.fireEvent("player:change", this.getPlayerCount());
    return playerId;
  }

  public removePlayer(playerId: string) {
    if (this.teamOne.hasPlayer(playerId)) {
      this.teamOne.removePlayer(playerId);
      this.fireEvent("player:change", this.getPlayerCount());
    } else if (this.teamTwo.hasPlayer(playerId)) {
      this.teamTwo.removePlayer(playerId);
      this.fireEvent("player:change", this.getPlayerCount());
    } else {
      throw new Error(
        `Could not find player with ID ${playerId} in either team`,
      );
    }
  }

  public swapPlayerLeft(playerId: string) {
    if (this.paused) return;
    if (this.teamOne.hasPlayer(playerId)) {
      this.teamOne.swapPlayerLeft(playerId);
      this.checkPerfectScore();
    } else if (this.teamTwo.hasPlayer(playerId)) {
      this.teamTwo.swapPlayerLeft(playerId);
      this.checkPerfectScore();
    } else {
      throw new Error(
        `Could not find player with ID ${playerId} in either team`,
      );
    }
  }

  public swapPlayerRight(playerId: string) {
    if (this.paused) return;
    if (this.teamOne.hasPlayer(playerId)) {
      this.teamOne.swapPlayerRight(playerId);
      this.checkPerfectScore();
    } else if (this.teamTwo.hasPlayer(playerId)) {
      this.teamTwo.swapPlayerRight(playerId);
      this.checkPerfectScore();
    } else {
      throw new Error(
        `Could not find player with ID ${playerId} in either team`,
      );
    }
  }

  public shuffleTeams() {
    this.teamOne.shuffle();
    this.teamTwo.shuffle();
  }

  public balanceTeams() {
    const maxTeam = keyedMax(this.teamOne, this.teamTwo, team =>
      team.getSize(),
    );

    const minTeam = keyedMin(this.teamOne, this.teamTwo, team =>
      team.getSize(),
    );

    const maxSize = maxTeam.getSize();
    const minSize = minTeam.getSize();
    const d = Math.ceil((maxSize - minSize - 1) / 2);
    for (let i = 0; i < d; ++i) {
      const playerId = maxTeam.popPlayer();
      minTeam.addPlayer(playerId);
    }
  }

  public on<E extends GameEvent>(event: E, handler: GameEventHandlers[E]) {
    if (!this.eventHandlerMap.has(event)) {
      this.eventHandlerMap.set(event, []);
    }

    const handlers = this.eventHandlerMap.get(event)!;
    handlers.push(handler);
    const removeHandler = () => {
      const i = handlers.indexOf(handler);
      handlers.splice(i, 1);
    };

    return removeHandler;
  }

  private fireEvent<
    E extends GameEvent,
    H extends GameEventHandler = GameEventHandlers[E],
  >(event: E, ...args: Parameters<H>) {
    if (!this.eventHandlerMap.has(event)) {
      return;
    }

    const handlers = this.eventHandlerMap.get(event)! as H[];
    for (const handler of handlers) {
      handler(...args);
    }
  }

  public isPaused() {
    return this.paused;
  }

  public pause() {
    if (this.paused) return;
    this.paused = true;
    this.fireEvent("paused:on");
  }

  public resume() {
    if (!this.paused) return;
    this.paused = false;
    this.fireEvent("paused:off");
  }

  public togglePause() {
    if (!this.paused) {
      this.pause();
    } else {
      this.resume();
    }
  }

  public checkPerfectScore() {
    if (this.teamOne.hasPerfectScore() || this.teamTwo.hasPerfectScore()) {
      this.pause();
    }
  }
}
