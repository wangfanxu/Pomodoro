import { IncomingMessage, ServerResponse } from "http";
import { HTTP_CODES } from "../model/serverModel";
import { Request, Response, NextFunction } from "express";
import { CreateSession, createSessionSchema } from "../schema/Session";
import { ZodError } from "zod";
import { handleCreateSession } from "../services/sessionService";

export const createSession = async (req: Request, res: Response) => {
  try {
    const parsedRequestBody = createSessionSchema.parse(req.body);
    await handleCreateSession(parsedRequestBody);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        status: "error",
        message: "Validation error",
        errors: error.errors,
      });
      return;
    }
  }

  res.status(HTTP_CODES.CREATED).send();
};
