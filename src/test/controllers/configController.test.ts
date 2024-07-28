import { Request, Response } from "express";
import { updateConfiguration } from "../../app/repositories/configurationRepository";
import { configurationSchema } from "../../app/schema/configurationSchema";
import { HTTP_CODES } from "../../app/const/serverModel";
import { ZodError } from "zod";
import { setUserConfiguration } from "../../app/controllers/configController";

jest.mock("../../app/repositories/configurationRepository", () => ({
  updateConfiguration: jest.fn(),
}));

jest.mock("../../app/schema/configurationSchema", () => ({
  configurationSchema: {
    parse: jest.fn(),
  },
}));

describe("configuration controller test suite", () => {
  let requestStub: Partial<Request>;
  let responseStub: Partial<Response>;

  beforeEach(() => {
    requestStub = {};
    responseStub = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("setUserConfiguration", () => {
    it("should update user configuration with http ok status code", async () => {
      const mockConfiguration = { someConfig: "value" };
      (updateConfiguration as jest.Mock).mockResolvedValueOnce(
        mockConfiguration
      );
      (configurationSchema.parse as jest.Mock).mockReturnValueOnce(
        mockConfiguration
      );

      requestStub = {
        params: { userId: "123" },
        body: mockConfiguration,
      };

      await setUserConfiguration(
        requestStub as Request,
        responseStub as Response
      );

      expect(responseStub.status).toHaveBeenCalledWith(HTTP_CODES.OK);
      expect(responseStub.json).toHaveBeenCalledWith(mockConfiguration);
    });

    it("should return status code 400 if validation error occurs", async () => {
      const validationError = new ZodError([]);
      (configurationSchema.parse as jest.Mock).mockImplementation(() => {
        throw validationError;
      });

      requestStub = {
        params: { userId: "123" },
        body: {},
      };

      await setUserConfiguration(
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
  });
});
