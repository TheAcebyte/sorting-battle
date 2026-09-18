import express, { Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { env } from "./env";
import { sessionMiddleware } from "./middlewares/auth";
import {
  adminLobbyRouter,
  adminRoomRouter,
  authRouter,
  playerLobbyRouter,
  playerRoomRouter,
} from "./routers";

const port = env.PORT || 3000;
const app = express();
const server = createServer(app);
const io = new Server(server);

app.get("/ping", (_, response: Response) => {
  response.send("Pong!");
});

app.use(express.json());
app.use(sessionMiddleware);
app.use(authRouter);
app.use(adminLobbyRouter);
app.use(adminRoomRouter);
app.use(playerLobbyRouter);
app.use(playerRoomRouter);

io.engine.use(sessionMiddleware);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
