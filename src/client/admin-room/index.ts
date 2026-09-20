import { GameStateData } from "@shared/types";
import io from "socket.io-client";
import { Renderer } from "./renderer";

const socket = io("/admin-room");
const shuffleButton = document.getElementById("button-shuffle")!;
const playButton = document.getElementById("button-play")!;
const balanceButton = document.getElementById("button-balance")!;

const teamOneCanvas = document.querySelector(
  "#container-team-1 .canvas-game",
) as HTMLCanvasElement;

const teamTwoCanvas = document.querySelector(
  "#container-team-2 .canvas-game",
) as HTMLCanvasElement;

const teamOneRenderer = new Renderer(teamOneCanvas, {
  color: "#B94A4A",
});

const teamTwoRenderer = new Renderer(teamTwoCanvas, {
  color: "#3C6FAE",
});

socket.on("data:state", (state: GameStateData) => {
  teamOneRenderer.updateBars(state.teamOne.bars);
  teamTwoRenderer.updateBars(state.teamTwo.bars);

  const playButtonState = state.paused ? "resume" : "pause";
  playButton.setAttribute("data-state", playButtonState);
});

shuffleButton.addEventListener("click", () => {
  socket.emit("input:shuffle");
});

playButton.addEventListener("click", () => {
  const input = playButton.getAttribute("data-state")!;
  const event = "input:" + input;
  socket.emit(event);
});

balanceButton.addEventListener("click", () => {
  socket.emit("input:balance");
});

function render() {
  teamOneRenderer.renderBars();
  teamTwoRenderer.renderBars();
  requestAnimationFrame(render);
}

requestAnimationFrame(render);
