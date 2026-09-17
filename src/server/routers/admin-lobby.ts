import express, { Router } from "express";

const assetPath = "dist/client/admin-lobby";
const router = Router();

router.use("/admin-lobby", express.static(assetPath));

export default router;
