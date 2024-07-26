import { IncomingMessage, ServerResponse } from "http";
import { HTTP_CODES } from "../model/serverModel";
import { Request, Response, NextFunction } from "express";

export const createSession = (req: Request, res: Response) => {
  const requestBody = req.body;
  console.log("body", requestBody);

  if (!requestBody?.userId) {
    res.status(HTTP_CODES.BAD_REQUEST).send();
  }

  res.status(HTTP_CODES.CREATED).send();
};
