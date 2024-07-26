import { IncomingMessage, ServerResponse } from "http";
import { HTTP_CODES } from "../model/serverModel";
import { Request, Response, NextFunction } from "express";
import { CreateSession, createSessionSchema } from "../schema/Session";
import { ZodError } from "zod";
import { handleCreateSession } from "../services/sessionService";

export const createSession = async (req: Request, res: Response) => {
  console.log("incoming request obdy", req.body);
  try {
    const parsedRequestBody = createSessionSchema.parse(req.body);
    await handleCreateSession(parsedRequestBody);
  } catch (error) {
    console.log("error catched", req.body);
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
