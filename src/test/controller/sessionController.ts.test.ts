import { IncomingMessage, ServerResponse } from "http";
import { createSession } from "../../app/controllers/sessionController";
import { HTTP_CODES } from "../../app/model/serverModel";

describe("session controller test suite", () => {
  let sut: typeof createSession;
  const requestStub = {};
  const responseStub = {
    writeHead: jest.fn(),
  };

  beforeEach(() => {
    sut = createSession;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it("it should successfully create session with http ok status code", () => {
    sut(
      requestStub as any as IncomingMessage,
      responseStub as any as ServerResponse
    );
    expect(responseStub.writeHead).toHaveBeenCalledWith(HTTP_CODES.CREATED);
  });
});
