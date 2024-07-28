import { Request, Response } from "express";
import { configurationSchema } from "../schema/configurationSchema";
import { updateConfiguration } from "../repositories/configurationRepository";

export const setUserConfiguration = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  if (!userId) throw Error("user id is required");
  const parsedRequestBody = configurationSchema.parse(req.body);

  await updateConfiguration(Number(userId), parsedRequestBody);
};
