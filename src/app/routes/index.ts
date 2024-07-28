import { Router } from "express";
import {
  createSession,
  getSession,
  updateSessionStatus,
} from "../controllers/sessionController";
import { setUserConfiguration } from "../controllers/configController";

const router = Router();

router.post("/sessions", createSession);
router.get("/sessions/:id", getSession);
//handle stop or resume
router.patch(
  "/users/:userId/cycles/:cycleId/sessions/:sessionId/status",
  updateSessionStatus
);
router.patch("/users/:userId/configurations", setUserConfiguration);
export default router;
