import { NextFunction, Request, Response } from "express";
import { Observable } from "@shared/observable";

export const roomLock = new Observable(false);
export const roomLockMiddleware = (
  _: Request,
  response: Response,
  next: NextFunction,
) => {
  if (roomLock.get()) {
    return response.status(401).redirect("/401");
  }

  next();
}
