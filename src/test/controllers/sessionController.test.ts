import { Request, Response } from "express";
import {
  createSession,
  getSession,
  updateSessionStatus,
} from "../../app/controllers/sessionController";
import { HTTP_CODES } from "../../app/const/serverModel";
import { ZodError } from "zod";
import { getSessionById } from "../../app/repositories/sessionRepository";
import {
  handleCreateSession,
  handleUpdateSession,
} from "../../app/services/sessionService";
import {
  createSessionSchema,
  updateSessionParamSchema,
  updateSessionSchema,
} from "../../app/schema/sessionSchema";

jest.mock("../../app/repositories/sessionRepository", () => ({
  getSessionById: jest.fn(),
}));

jest.mock("../../app/services/sessionService", () => ({
  handleCreateSession: jest.fn(),
  handleUpdateSession: jest.fn(),
}));

jest.mock("../../app/schema/sessionSchema", () => ({
  createSessionSchema: {
    parse: jest.fn(),
  },
  updateSessionParamSchema: {
    parse: jest.fn(),
  },
  updateSessionSchema: {
    parse: jest.fn(),
  },
}));

describe("session controller test suite", () => {
  let sut: typeof createSession;
  let requestStub: Partial<Request>;
  let responseStub: Partial<Response>;

  beforeEach(() => {
    sut = createSession;
    requestStub = {};
    responseStub = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    requestStub = {};
  });

  describe("create session test suite", () => {
    it("should successfully create session with http ok status code", async () => {
      (handleCreateSession as jest.Mock).mockResolvedValueOnce(undefined);
      (createSessionSchema.parse as jest.Mock).mockReturnValueOnce({
        userId: 123,
        sessionType: "work",
      });

      requestStub = {
        body: {
          userId: 123,
          sessionType: "work",
        },
      };

      await sut(requestStub as Request, responseStub as Response);
      expect(responseStub.status).toHaveBeenCalledWith(HTTP_CODES.CREATED);
    });

    it("should return status code 400 if validation error occurs", async () => {
      const validationError = new ZodError([]);
      (createSessionSchema.parse as jest.Mock).mockImplementation(() => {
        throw validationError;
      });

      requestStub = {
        body: {},
      };

      await sut(requestStub as Request, responseStub as Response);
      expect(responseStub.status).toHaveBeenCalledWith(HTTP_CODES.BAD_REQUEST);
    });

    it("should return status code 500 if an unexpected error occurs", async () => {
      (createSessionSchema.parse as jest.Mock).mockImplementation(() => {
        throw new Error("Unexpected error");
      });

      requestStub = {
        body: {},
      };

      await sut(requestStub as Request, responseStub as Response);
      expect(responseStub.status).toHaveBeenCalledWith(
        HTTP_CODES.INTERNAL_SERVER_ERROR
      );
    });
  });

  describe("get session test suite", () => {
    it("should return status code 400 if sessionId is not provided", async () => {
      requestStub = { params: {} };
      await getSession(requestStub as Request, responseStub as Response);

      expect(responseStub.status).toHaveBeenCalledWith(HTTP_CODES.BAD_REQUEST);
    });

    it("should return session data with http ok status code", async () => {
      const mockSession = { id: 1, userId: 123, sessionType: "work" };
      (getSessionById as jest.Mock).mockResolvedValueOnce(mockSession);

      requestStub = { params: { sessionId: "1" } };
      await getSession(requestStub as Request, responseStub as Response);

      expect(responseStub.status).toHaveBeenCalledWith(HTTP_CODES.OK);
      expect(responseStub.json).toHaveBeenCalledWith({
        status: "success",
        ...mockSession,
      });
    });

    it("should return status code 500 if an unexpected error occurs", async () => {
      (getSessionById as jest.Mock).mockImplementation(() => {
        throw new Error("Unexpected error");
      });

      requestStub = { params: { sessionId: "1" } };
      await getSession(requestStub as Request, responseStub as Response);

      expect(responseStub.status).toHaveBeenCalledWith(
        HTTP_CODES.INTERNAL_SERVER_ERROR
      );
    });
  });

  describe("update session status test suite", () => {
    it("should successfully update session status with http ok status code", async () => {
      (updateSessionParamSchema.parse as jest.Mock).mockReturnValueOnce({
        userId: 123,
        cycleId: 1,
        sessionId: 1,
      });
      (updateSessionSchema.parse as jest.Mock).mockReturnValueOnce({
        status: "completed",
      });
      (handleUpdateSession as jest.Mock).mockResolvedValueOnce(undefined);

      requestStub = {
        params: {
          userId: "123",
          cycleId: "1",
          sessionId: "1",
        },
        body: {
          status: "completed",
        },
      };

      await updateSessionStatus(
        requestStub as Request,
        responseStub as Response
      );

      expect(responseStub.status).toHaveBeenCalledWith(HTTP_CODES.OK);
      expect(responseStub.json).toHaveBeenCalledWith({ status: "success" });
    });

    it("should return status code 400 if validation error occurs", async () => {
      const validationError = new ZodError([]);
      (updateSessionParamSchema.parse as jest.Mock).mockImplementation(() => {
        throw validationError;
      });

      requestStub = {
        params: {
          userId: "invalid",
          cycleId: "invalid",
          sessionId: "invalid",
        },
        body: {
          status: "completed",
        },
      };

      await updateSessionStatus(
        requestStub as Request,
        responseStub as Response
      );

      expect(responseStub.status).toHaveBeenCalledWith(HTTP_CODES.BAD_REQUEST);
      expect(responseStub.json).toHaveBeenCalledWith({
        status: "error",
        message: "Validation error",
        errors: validationError.errors,
      });
    });

    it("should return status code 500 if an unexpected error occurs", async () => {
      (updateSessionParamSchema.parse as jest.Mock).mockImplementation(() => {
        throw new Error("Unexpected error");
      });

      requestStub = {
        params: {
          userId: "123",
          cycleId: "1",
          sessionId: "1",
        },
        body: {
          status: "completed",
        },
      };

      await updateSessionStatus(
        requestStub as Request,
        responseStub as Response
      );

      expect(responseStub.status).toHaveBeenCalledWith(
        HTTP_CODES.INTERNAL_SERVER_ERROR
      );
    });
  });
});
