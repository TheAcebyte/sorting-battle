import { env } from "@/env";
import { NextFunction, Request, Response } from "express";
import session, { SessionData } from "express-session";

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
    return response.status(401).send("Unauthorized request");
  }

  next();
};
