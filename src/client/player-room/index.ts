import { GameStateData } from "@shared/types";
import io from "socket.io-client";
import { Renderer } from "./renderer";

const socket = io("/game");

const teamOneCanvas = document.querySelector(
  "#container-team-1 .canvas-game",
) as HTMLCanvasElement;

const teamTwoCanvas = document.querySelector(
  "#container-team-2 .canvas-game",
) as HTMLCanvasElement;

const leftArrowButton = document.getElementById("button-left-arrow")!;
const rightArrowButton = document.getElementById("button-right-arrow")!;

const teamOneRenderer = new Renderer(teamOneCanvas, {
  color: "#662929",
  playerColor: "#B94A4A",
});

const teamTwoRenderer = new Renderer(teamTwoCanvas, {
  color: "#213D60",
  playerColor: "#3C6FAE",
});

socket.on("data:player-id", (playerId: string) => {
  teamOneRenderer.setPlayerId(playerId);
  teamTwoRenderer.setPlayerId(playerId);
});

socket.on("data:state", (state: GameStateData) => {
  teamOneRenderer.updateBars(state.teamOne.bars);
  teamTwoRenderer.updateBars(state.teamTwo.bars);
});

leftArrowButton.addEventListener("click", () => {
  socket.emit("input:swap-left");
});

rightArrowButton.addEventListener("click", () => {
  socket.emit("input:swap-right");
});

function render() {
  teamOneRenderer.renderBars();
  teamTwoRenderer.renderBars();
  requestAnimationFrame(render);
}

requestAnimationFrame(render);
