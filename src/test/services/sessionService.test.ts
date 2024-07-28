import { afterEach, describe, it, expect, jest } from "@jest/globals";
import { handleCreateSession } from "../../app/services/sessionService";
import { User } from "../../app/entities/User";
import { Cycle } from "../../app/entities/Cycle";
import { Session } from "../../app/entities/Session";
import * as userRepository from "../../app/repositories/userRepository";
import * as cycleRepository from "../../app/repositories/cycleRepository";
import * as sessionRepository from "../../app/repositories/sessionRepository";
import * as scheduler from "../../app/utils/scheduler";

describe("session service test suites", () => {
  let sessionStub: any = {
    userId: 9999999,
    sessionType: "work",
  };

  let userStub: User = {
    id: 123,
    configuration: {} as any,
    username: "test",
    passwordHash: "abc",
    createdAt: new Date(),
    updatedAt: new Date(),
    email: "abc",
    cycles: [] as any,
    sessions: [] as any,
  };

  let cycleStub: Cycle = {
    id: 123,
    completed: false,
    sessions: {} as any,
    user: {} as any,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  let sessionEntityStub: Session = {} as any;

  let getUserWithConfigurationSpy: any;
  let getUserUncompletedCyclesSpy: any;
  let createCycleSpy: any;
  let createSessionBySessionTypeSpy: any;
  let countDownSchedulerSpy: any;
  beforeEach(() => {
    getUserWithConfigurationSpy = jest
      .spyOn(userRepository, "getUserWithConfiguration")
      .mockImplementation(() => Promise.resolve(null as any));
    getUserUncompletedCyclesSpy = jest
      .spyOn(cycleRepository, "getUserUncompletedCycles")
      .mockImplementation(() => Promise.resolve(null));
    createCycleSpy = jest
      .spyOn(cycleRepository, "createCycle")
      .mockImplementation(() => Promise.resolve(cycleStub));
    createSessionBySessionTypeSpy = jest
      .spyOn(sessionRepository, "createSessionBySessionType")
      .mockImplementation(() => Promise.resolve(sessionEntityStub));
    countDownSchedulerSpy = jest
      .spyOn(scheduler, "scheduleCountdownJob")
      .mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create session handler test suite", () => {
    it("if the provided id is unable to find user, should throw error", async () => {
      getUserWithConfigurationSpy.mockResolvedValueOnce(null);
      await expect(handleCreateSession(sessionStub)).rejects.toThrow();
    });

    it("if the cycle does not exist, should create a cycle", async () => {
      getUserWithConfigurationSpy.mockResolvedValueOnce(userStub);
      getUserUncompletedCyclesSpy.mockResolvedValueOnce(null);

      await handleCreateSession(sessionStub);

      expect(createCycleSpy).toHaveBeenCalled();
      expect(createCycleSpy).toHaveBeenCalledWith(userStub);
    });

    it("should be able to create the session", async () => {
      getUserWithConfigurationSpy.mockResolvedValueOnce(userStub);
      getUserUncompletedCyclesSpy.mockResolvedValueOnce(cycleStub);

      await handleCreateSession(sessionStub);

      expect(createSessionBySessionTypeSpy).toHaveBeenCalled();
      expect(createSessionBySessionTypeSpy).toHaveBeenCalledWith(
        userStub,
        sessionStub.sessionType,
        cycleStub
      );
    });

    it("should be able to call schedule job", async () => {
      getUserWithConfigurationSpy.mockResolvedValueOnce(userStub);
      getUserUncompletedCyclesSpy.mockResolvedValueOnce(cycleStub);
      createSessionBySessionTypeSpy.mockResolvedValueOnce(sessionEntityStub);

      await handleCreateSession(sessionStub);

      expect(countDownSchedulerSpy).toHaveBeenCalled();
      expect(countDownSchedulerSpy).toHaveBeenCalledWith(
        userStub,
        cycleStub,
        sessionEntityStub
      );
    });
  });
});
