import { Router } from "express";

const router = Router();

router.post("/sessions", () => {
  console.log("create session request received");
});

export default router;
