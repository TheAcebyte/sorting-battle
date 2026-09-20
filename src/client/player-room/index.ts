import { GameStateData } from "@shared/types";
import io from "socket.io-client";
import { Renderer } from "./renderer";

const socket = io("/player-room");

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

  if (state.paused) {
    leftArrowButton.setAttribute("data-disabled", "");
    rightArrowButton.setAttribute("data-disabled", "");
  } else {
    leftArrowButton.removeAttribute("data-disabled");
    rightArrowButton.removeAttribute("data-disabled");
  }
});

leftArrowButton.addEventListener("click", () => {
  const isDisabled = leftArrowButton.hasAttribute("data-disabled");
  if (isDisabled) return;
  socket.emit("input:swap-left");
});

rightArrowButton.addEventListener("click", () => {
  const isDisabled = rightArrowButton.hasAttribute("data-disabled");
  if (isDisabled) return;
  socket.emit("input:swap-right");
});

function render() {
  teamOneRenderer.renderBars();
  teamTwoRenderer.renderBars();
  requestAnimationFrame(render);
}

requestAnimationFrame(render);
