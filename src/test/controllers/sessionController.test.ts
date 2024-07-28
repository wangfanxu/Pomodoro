// import { IncomingMessage, ServerResponse } from "http";
// import { createSession } from "../../app/controllers/sessionController";
// import { HTTP_CODES } from "../../app/const/serverModel";
// import { Request, Response } from "express";
// describe.skip("session controller test suite", () => {
//   let sut: typeof createSession;
//   let requestStub = {};
//   let responseStub = {
//     status: jest.fn().mockReturnThis(),
//     send: jest.fn().mockReturnThis(),
//     json: jest.fn().mockReturnThis(),
//   };

//   beforeEach(() => {
//     sut = createSession;
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//     requestStub = {};
//   });
//   it("should successfully create session with http ok status code", () => {
//     requestStub = {
//       body: {
//         userId: "testId",
//         sessionType: "work",
//       },
//     };
//     sut(requestStub as any as Request, responseStub as any as Response);
//     expect(responseStub.status).toHaveBeenCalledWith(HTTP_CODES.CREATED);
//   });

//   it("if request without userId, should return status code 400", () => {
//     requestStub = { requestBody: {} };
//     sut(requestStub as any as Request, responseStub as any as Response);

//     expect(responseStub.status).toHaveBeenCalledWith(HTTP_CODES.BAD_REQUEST);
//   });
// });