import express, { Router } from "express";

const assetPath = "dist/client/player-room"
const router = Router();

router.use("/room", express.static(assetPath));

export default router;
