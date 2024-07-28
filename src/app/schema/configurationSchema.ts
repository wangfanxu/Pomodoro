import { z } from "zod";

const baseConfigurationSchema = z.object({
  workInterval: z.number().positive(),
  shortBreak: z.number().positive(),
  longBreak: z.number().positive(),
  longBreakInterval: z.number().positive(),
});

export const configurationSchema = baseConfigurationSchema.partial();
