import { IncomingMessage, ServerResponse } from "http";
import { HTTP_CODES } from "../model/serverModel";
import { Request, Response, NextFunction } from "express";
import { createSessionSchema } from "../schema/Session";

export const createSession = (req: Request, res: Response) => {
  //TODO:use zod
  const parsedRequestBody = createSessionSchema.parse(req.body);

  res.status(HTTP_CODES.CREATED).send();
};
