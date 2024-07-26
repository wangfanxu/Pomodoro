import { IncomingMessage, ServerResponse } from "http";
import { createSession } from "../../app/controllers/sessionController";
import { HTTP_CODES } from "../../app/model/serverModel";
import { Request, Response } from "express";
describe("session controller test suite", () => {
  let sut: typeof createSession;
  let requestStub = {};
  let responseStub = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };

  beforeEach(() => {
    sut = createSession;
  });

  afterEach(() => {
    jest.clearAllMocks();
    requestStub = {};
  });
  it("should successfully create session with http ok status code", () => {
    requestStub = {
      body: {
        userId: "testId",
      },
    };
    sut(requestStub as any as Request, responseStub as any as Response);
    expect(responseStub.status).toHaveBeenCalledWith(HTTP_CODES.CREATED);
  });

  it("if request without userId, should return status code 400", () => {
    requestStub = { requestBody: {} };
    sut(requestStub as any as Request, responseStub as any as Response);

    expect(responseStub.status).toHaveBeenCalledWith(HTTP_CODES.BAD_REQUEST);
  });
});
