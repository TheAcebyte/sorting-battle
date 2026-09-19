import io from "socket.io-client";

const socket = io("/game");
let playerId: string;

socket.on("data:player-id", (playerId: string) => {
});
