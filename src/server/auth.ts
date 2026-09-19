import { Router } from "express";
import { NextFunction, Request, Response } from "express";
import session, { SessionData } from "express-session";
import { env } from "./env";

declare module "express-session" {
  interface SessionData {
    authorized?: boolean;
  }
}

declare module "http" {
  interface IncomingMessage {
    session: SessionData;
  }
}

export const sessionMiddleware = session({
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true },
});

export const authMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (!request.session.authorized) {
    return response.status(401).redirect("/401");
  }

  next();
};

const authRouter = Router();

authRouter.post("/auth", (request, response) => {
  const password = request.body.password as string;
  if (password !== env.PASSWORD) {
    return response.status(401).json({ authenticated: false });
  }

  request.session.authorized = true;
  response.status(200).json({ authenticated: true });
});

export { authRouter };
