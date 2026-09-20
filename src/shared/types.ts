export interface Bar {
  barId: string;
  playerId: string;
  height: number;
};

interface Team {
  bars: Bar[];
  score: number;
};

export interface GameStateData {
  paused: boolean;
  playerCount: number;
  teamOne: Team;
  teamTwo: Team;
};
