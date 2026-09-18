import { authMiddleware } from "@/middlewares/auth";
import express, { Router } from "express";

const assetPath = "dist/client/admin-room";
const router = Router();

router.use("/admin-room", authMiddleware, express.static(assetPath));

export default router;
