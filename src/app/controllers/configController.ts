import { Request, Response } from "express";
import { configurationSchema } from "../schema/configurationSchema";
import { updateConfiguration } from "../repositories/configurationRepository";
import { HTTP_CODES } from "../const/serverModel";
import { ZodError } from "zod";

export const setUserConfiguration = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  if (!userId) throw Error("user id is required");
  try {
    const parsedRequestBody = configurationSchema.parse(req.body);

    const configuration = await updateConfiguration(
      Number(userId),
      parsedRequestBody
    );
    res.status(HTTP_CODES.OK).json({
      ...configuration,
    });
  } catch (e) {
    if (e instanceof ZodError) {
      res.status(HTTP_CODES.BAD_REQUEST).json({
        status: "error",
        message: "Validation error",
        errors: e.errors,
      });
      return;
    } else {
      res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send();
      return;
    }
  }
};
