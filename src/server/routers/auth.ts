import { env } from "@/env";
import { Router } from "express";

const router = Router();

router.post("/auth", (request, response) => {
  const password = request.body.password as string;
  if (password !== env.PASSWORD) {
    return response.status(401).send("Incorrect password");
  }

  request.session.authorized = true;
  response.redirect("/admin-room");
});

export default router;
