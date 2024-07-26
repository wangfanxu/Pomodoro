import { z } from "zod";

const createSessionSchema = z.object({
  userId: z.string(),
  sessionType: z.enum(["work", "shortBreak", "longBreak"]),
});

type CreateSession = z.infer<typeof createSessionSchema>;

export { createSessionSchema, CreateSession };
