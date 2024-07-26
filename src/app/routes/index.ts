import { Router } from "express";
import { createSession } from "../controllers/sessionController";

const router = Router();

router.post("/sessions", createSession);

export default router;
