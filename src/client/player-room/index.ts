import { GameStateData } from "@shared/types";
import io from "socket.io-client";
import { colors } from "./colors";
import { onDoubleClick } from "./on-double-click";
import { onPan } from "./on-pan";
import { Renderer } from "./renderer";

const socket = io("/player-room");
const leftArrowButton = document.getElementById("button-left-arrow")!;
const rightArrowButton = document.getElementById("button-right-arrow")!;

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

socket.on("data:player-id", (playerId: string) => {
  teamOneRenderer.setPlayerId(playerId);
  teamTwoRenderer.setPlayerId(playerId);
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
  if (!isDisabled) {
    socket.emit("input:swap-left");
  }
});

rightArrowButton.addEventListener("click", () => {
  const isDisabled = rightArrowButton.hasAttribute("data-disabled");
  if (!isDisabled) {
    socket.emit("input:swap-right");
  }
});

function render() {
  teamOneRenderer.renderBars();
  teamTwoRenderer.renderBars();
  requestAnimationFrame(render);
}

requestAnimationFrame(render);
