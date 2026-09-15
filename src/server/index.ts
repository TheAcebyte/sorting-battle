import express, { Response } from "express";

const app = express();
const port = process.env.PORT || 3000;

app.get("/ping", (_, response: Response) => {
  response.send("Pong!");
});

app.use(express.static("dist/client/player-lobby"))

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
