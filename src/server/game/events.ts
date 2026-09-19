import { GameStateData } from "@shared/types";
import { Server } from "socket.io";
import { config } from "./config";
import { GameState } from "./state";

export function registerGameEvents(io: Server) {
  const state = new GameState();
  const game = io.of("/game");
  const lobby = io.of("/lobby");

  game.on("connection", socket => {
    const playerId = state.createPlayer();
    socket.emit("data:player-id", playerId);
    socket.on("disconnect", () => {
      state.removePlayer(playerId);
    });

    socket.on("input:swap-left", () => {
      state.swapPlayerLeft(playerId);
    });

    socket.on("input:swap-right", () => {
      state.swapPlayerRight(playerId);
    });

    socket.on("input:pause", () => {
      if (!socket.request.session.authorized) return;
      state.pause();
    });

    socket.on("input:resume", () => {
      if (!socket.request.session.authorized) return;
      state.resume();
    });

    socket.on("input:shuffle", () => {
      if (!socket.request.session.authorized) return;
      state.shuffleTeams();
    });

    socket.on("input:balance", () => {
      if (!socket.request.session.authorized) return;
      state.balanceTeams();
    });
  });
  
  lobby.on("connection", socket => {
    const playerCount = state.getPlayerCount();
    socket.emit("data:player-count", playerCount);
  });

  state.on("player:change", playerCount => {
    lobby.emit("data:player-count", playerCount);
  });

  state.on("paused:on", () => {
    game.emit("data:paused-on");
  });

  state.on("paused:off", () => {
    game.emit("data:paused-off");
  });

  const delay = 1000 / config.FRAME_RATE;
  const broadcastState = () => {
    const data = {
      playerCount: state.getPlayerCount(),
      teamOne: { bars: state.getTeamOneBars() },
      teamTwo: { bars: state.getTeamTwoBars() },
    } satisfies GameStateData;
    game.emit("data:state", data);
  };

  setInterval(broadcastState, delay);
}
