import { z } from "zod";

const createSessionSchema = z.object({
  userId: z.number(),
  sessionType: z.enum(["work", "shortBreak", "longBreak"]),
});

export const updateSessionParamSchema = z.object({
  userId: z.string(),
  sessionId: z.string(),
  cycleId: z.string(),
});
const updateSessionSchema = z.object({
  status: z.enum(["paused", "resume"]),
});

type CreateSession = z.infer<typeof createSessionSchema>;

type UpdateSession = z.infer<typeof updateSessionSchema>;

export {
  createSessionSchema,
  CreateSession,
  UpdateSession,
  updateSessionSchema,
};
