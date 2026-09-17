import express, { Router } from "express";

const assetPath = "dist/client/player-lobby";
const router = Router();

router.use(express.static(assetPath));
router.use("/lobby", express.static(assetPath));

export default router;
