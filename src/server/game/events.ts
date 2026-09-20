import { GameStateData } from "@shared/types";
import { Server } from "socket.io";
import { config } from "./config";
import { GameState } from "./state";

export function registerGameEvents(io: Server) {
  const state = new GameState();
  const playerLobby = io.of("/player-lobby");
  const playerRoom = io.of("/player-room");
  const adminRoom = io.of("admin-room");

  playerLobby.on("connection", socket => {
    const playerCount = state.getPlayerCount();
    socket.emit("data:player-count", playerCount);
  });

  playerRoom.on("connection", socket => {
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
  });

  adminRoom.on("connection", socket => {
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

  state.on("player:change", playerCount => {
    playerLobby.emit("data:player-count", playerCount);
  });

  const delay = 1000 / config.TICK_RATE;
  const broadcastState = () => {
    const data = {
      paused: state.isPaused(),
      playerCount: state.getPlayerCount(),
      teamOne: {
        bars: state.getTeamOneBars(),
        score: state.getTeamOneScore(),
      },
      teamTwo: {
        bars: state.getTeamTwoBars(),
        score: state.getTeamTwoScore(),
      },
    } satisfies GameStateData;
    playerRoom.emit("data:state", data);
    adminRoom.emit("data:state", data);
  };

  setInterval(broadcastState, delay);
}
