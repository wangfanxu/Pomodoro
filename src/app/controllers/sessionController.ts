import { IncomingMessage, ServerResponse } from "http";
import { HTTP_CODES } from "../model/serverModel";
import { Request, Response, NextFunction } from "express";
import { createSessionSchema } from "../schema/Session";
import { ZodError } from "zod";

export const createSession = (req: Request, res: Response) => {
  let parsedRequestBody;
  console.log("incoming request obdy", req.body);
  try {
    parsedRequestBody = createSessionSchema.parse(req.body);
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
  console.log("parsed request body", parsedRequestBody);

  res.status(HTTP_CODES.CREATED).send();
};
