import { getSessionById } from "./../repositories/sessionRepository";
import { IncomingMessage, ServerResponse } from "http";
import { HTTP_CODES } from "../const/serverModel";
import { Request, Response, NextFunction } from "express";
import {
  CreateSession,
  createSessionSchema,
  updateSessionParamSchema,
  updateSessionSchema,
} from "../schema/Session";
import { ZodError } from "zod";
import {
  handleCreateSession,
  handleUpdateSession,
} from "../services/sessionService";

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

export const getSession = async (req: Request, res: Response) => {
  if (!req.params.sessionId) {
    res.status(400).json({
      status: "error",
      message: "id is required",
    });
  }
  const session = await getSessionById(Number(req.params.sessionId));
  res.status(HTTP_CODES.OK).json({
    status: "success",
    ...session,
  });
};

export const updateSessionStatus = async (req: Request, res: Response) => {
  try {
    console.log("request params", req.params);

    const parsedRequestParams = updateSessionParamSchema.parse(req.params);
    const parsedRequestBody = updateSessionSchema.parse(req.body);

    const userId = Number(parsedRequestParams.userId);
    const cycleId = Number(parsedRequestParams.cycleId);
    const sessionId = Number(parsedRequestParams.sessionId);

    if (isNaN(userId) || isNaN(cycleId) || isNaN(sessionId)) {
      throw new Error(
        "Invalid parameters: userId, cycleId, or sessionId is not a number."
      );
    }
    await handleUpdateSession(
      userId,
      cycleId,
      sessionId,
      parsedRequestBody.status
    );
    console.log("finished exuection", handleUpdateSession);
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
  res.status(HTTP_CODES.OK).json({
    status: "success",
  });
};
