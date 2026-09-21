import { GameStateData } from "@shared/types";
import io from "socket.io-client";
import { colors } from "./colors";
import { onDoubleClick } from "./on-double-click";
import { onPan } from "./on-pan";
import { Renderer } from "./renderer";

const socket = io("/admin-room");
const playButton = document.getElementById("button-play")!;
const lockButton = document.getElementById("button-lock")!;
const shuffleButton = document.getElementById("button-shuffle")!;
const balanceButton = document.getElementById("button-balance")!;

const teamOneCanvas = document.querySelector(
  "#container-team-1 .canvas-game",
) as HTMLCanvasElement;

const teamTwoCanvas = document.querySelector(
  "#container-team-2 .canvas-game",
) as HTMLCanvasElement;

const teamOneScoreLabel = document.querySelector(
  "#container-team-1 .label-score",
)!;

const teamTwoScoreLabel = document.querySelector(
  "#container-team-2 .label-score",
)!;

const teamOneRenderer = new Renderer(teamOneCanvas, colors.white);
const teamTwoRenderer = new Renderer(teamTwoCanvas, colors.green);

onPan(teamOneCanvas, dx => {
  teamOneRenderer.translateX(dx);
});

onPan(teamTwoCanvas, dx => {
  teamTwoRenderer.translateX(dx);
});

onDoubleClick(teamOneCanvas, () => {
  teamOneRenderer.recenter();
});

onDoubleClick(teamTwoCanvas, () => {
  teamTwoRenderer.recenter();
});

socket.on("data:state", (state: GameStateData) => {
  teamOneRenderer.updateBars(state.teamOne.bars);
  teamTwoRenderer.updateBars(state.teamTwo.bars);

  const teamOneSize = state.teamOne.bars.length;
  const teamTwoSize = state.teamTwo.bars.length;
  const teamOneScore = state.teamOne.score;
  const teamTwoScore = state.teamTwo.score;
  teamOneScoreLabel.textContent = `${teamOneScore} / ${teamOneSize}`;
  teamTwoScoreLabel.textContent = `${teamTwoScore} / ${teamTwoSize}`;

  if (teamOneScore === teamOneSize) {
    teamOneScoreLabel.classList.add("perfect");
    teamOneRenderer.setOptions(colors.gold);
  } else {
    teamOneScoreLabel.classList.remove("perfect");
    teamOneRenderer.setOptions(colors.white);
  }

  if (teamTwoScore === teamTwoSize) {
    teamTwoScoreLabel.classList.add("perfect");
    teamTwoRenderer.setOptions(colors.gold);
  } else {
    teamTwoScoreLabel.classList.remove("perfect");
    teamTwoRenderer.setOptions(colors.green);
  }

  const playButtonState = state.paused ? "resume" : "pause";
  playButton.setAttribute("data-state", playButtonState);
});

socket.on("data:room-lock", () => {
  lockButton.setAttribute("data-state", "unlock");
});

socket.on("data:room-unlock", () => {
  lockButton.setAttribute("data-state", "lock");
});

playButton.addEventListener("click", () => {
  const input = playButton.getAttribute("data-state")!;
  const event = "input:" + input;
  socket.emit(event);
});

lockButton.addEventListener("click", () => {
  const input = lockButton.getAttribute("data-state");
  const event = "input:" + input;
  socket.emit(event);
});

shuffleButton.addEventListener("click", () => {
  socket.emit("input:shuffle");
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
