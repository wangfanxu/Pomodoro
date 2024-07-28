import { CreateSession } from "../../app/schema/sessionSchema";
import { handleCreateSession } from "../../app/services/sessionService";

describe("session service test suites", () => {
  let sessionStub = {
    userId: 99999,
    sessionType: "work",
  };
  it("if the provided id is unable find, return unable find error", async () => {
    expect(
      await handleCreateSession(sessionStub as any as CreateSession)
    ).toThrow();
  });
});
