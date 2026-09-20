import { io } from "socket.io-client";

const label = document.getElementById("label-player-count")!;
const button = document.getElementById("button-join")!;
const socket = io("/player-lobby");

function capitalize(word: string, count: number) {
  const s = count === 1 ? "" : "s";
  return word + s;
}

socket.on("data:player-count", playerCount => {
  label.textContent = `${playerCount} ${capitalize("player", playerCount)} online`;
});

socket.on("data:room-lock", () => {
  button.setAttribute("data-disabled", "");
});

socket.on("data:room-unlock", () => {
  button.removeAttribute("data-disabled");
});
