import express, { RequestHandler, Router } from "express";
import { authMiddleware } from "./auth";

interface Route {
  route: string;
  assetPath: string;
  middlewares?: RequestHandler[];
}

const routes: Route[] = [
  {
    route: "/",
    assetPath: "dist/client/player-lobby",
  },
  {
    route: "/lobby",
    assetPath: "dist/client/player-lobby",
  },
  {
    route: "/admin-lobby",
    assetPath: "dist/client/admin-lobby",
  },
  {
    route: "/room",
    assetPath: "dist/client/player-room",
  },
  {
    route: "/admin-room",
    assetPath: "dist/client/admin-room",
    middlewares: [authMiddleware],
  },
  {
    route: "/401",
    assetPath: "dist/client/401",
  },
  {
    route: "/404",
    assetPath: "dist/client/404",
  },
] as const;

export const staticRouters = routes.map(({ route, assetPath, middlewares = [] }) => {
  const router = Router();
  router.use(route, ...middlewares, express.static(assetPath));
  return router;
});
