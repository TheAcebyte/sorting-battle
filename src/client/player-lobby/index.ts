import { io } from "socket.io-client";

const label = document.getElementById("label-player-count")!;
const socket = io();

function capitalize(word: string, count: number) {
  const s = count === 1 ? "" : "s";
  return word + s;
}

socket.emit("player-count:request");
socket.on("player-count:update", playerCount => {
  label.textContent = `${playerCount} ${capitalize("player", playerCount)} online`;
});
