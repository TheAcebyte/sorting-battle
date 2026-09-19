import express, { Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { authRouter } from "./auth";
import { sessionMiddleware } from "./auth";
import { env } from "./env";
import { registerGameEvents } from "./game/events";
import { staticRouters } from "./static-routers";

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
for (const router of staticRouters) {
  app.use(router);
}

app.use((_, response) => {
  response.status(404).redirect("/404");
});

io.engine.use(sessionMiddleware);
registerGameEvents(io);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
