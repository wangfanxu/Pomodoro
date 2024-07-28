import { getSessionById } from "./../repositories/sessionRepository";
import { HTTP_CODES } from "../const/serverModel";
import { Request, Response } from "express";
import {
  createSessionSchema,
  updateSessionParamSchema,
  updateSessionSchema,
} from "../schema/sessionSchema";
import { ZodError } from "zod";
import {
  handleCreateSession,
  handleUpdateSession,
} from "../services/sessionService";

export const createSession = async (req: Request, res: Response) => {
  try {
    const parsedRequestBody = createSessionSchema.parse(req.body);
    await handleCreateSession(parsedRequestBody);
    res.status(HTTP_CODES.CREATED).send();
    return;
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(HTTP_CODES.BAD_REQUEST).json({
        status: "error",
        message: "Validation error",
        errors: error.errors,
      });
      return;
    } else {
      res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send();
      return;
    }
  }
};

export const getSession = async (req: Request, res: Response) => {
  if (!req.params.sessionId) {
    res.status(400).json({
      status: "error",
      message: "id is required",
    });
  }
  try {
    const session = await getSessionById(Number(req.params.sessionId));
    res.status(HTTP_CODES.OK).json({
      status: "success",
      ...session,
    });
  } catch (e) {
    res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send();
    return;
  }
};

export const updateSessionStatus = async (req: Request, res: Response) => {
  try {
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
    res.status(HTTP_CODES.OK).json({
      status: "success",
    });
    return;
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(HTTP_CODES.BAD_REQUEST).json({
        status: "error",
        message: "Validation error",
        errors: error.errors,
      });
      return;
    } else {
      res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send();
      return;
    }
  }
};
