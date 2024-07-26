import { IncomingMessage, ServerResponse } from "http";
import { HTTP_CODES } from "../model/serverModel";

export const createSession = (req: IncomingMessage, res: ServerResponse) => {
  res.writeHead(HTTP_CODES.CREATED);
};
