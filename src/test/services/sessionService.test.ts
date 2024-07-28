import {
  afterEach,
  describe,
  it,
  expect,
  jest,
  beforeEach,
} from "@jest/globals";
import {
  handleCreateSession,
  handleUpdateSession,
  startNextSession,
} from "../../app/services/sessionService";
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
  let getSessionByIdSpy: any;
  let stopJobSpy: any;
  let updateSessionSpy: any;
  let getCycleByIdSpy: any;
  let getSessionsByCycleSpy: any;

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
    getSessionByIdSpy = jest
      .spyOn(sessionRepository, "getSessionById")
      .mockImplementation(() => Promise.resolve(sessionEntityStub));
    stopJobSpy = jest
      .spyOn(scheduler, "stopJob")
      .mockImplementation(() => Promise.resolve());
    updateSessionSpy = jest
      .spyOn(sessionRepository, "updateSession")
      .mockImplementation(() => Promise.resolve({} as any));
    getCycleByIdSpy = jest
      .spyOn(cycleRepository, "getCycleById")
      .mockImplementation(() => Promise.resolve(cycleStub));
    getSessionsByCycleSpy = jest
      .spyOn(sessionRepository, "getSessionsByCycle")
      .mockImplementation(() => Promise.resolve([sessionEntityStub]));
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

  describe("update session handler test suite", () => {
    it("should stop session", async () => {
      getSessionByIdSpy.mockResolvedValueOnce(sessionEntityStub);

      await handleUpdateSession(123, 123, 123, "paused");

      expect(stopJobSpy).toHaveBeenCalled();
      expect(stopJobSpy).toHaveBeenCalledWith(123);
    });

    it("should resume session", async () => {
      sessionEntityStub = {
        id: 123,
        endTime: new Date(),
        stopTime: new Date(),
        status: "paused",
      } as any;
      getSessionByIdSpy.mockResolvedValueOnce(sessionEntityStub);
      getCycleByIdSpy.mockResolvedValueOnce(cycleStub);
      getUserWithConfigurationSpy.mockResolvedValueOnce(userStub);

      await handleUpdateSession(123, 123, 123, "resume");

      expect(updateSessionSpy).toHaveBeenCalled();
      expect(updateSessionSpy).toHaveBeenCalledWith(123, {
        endTime: expect.any(Date),
        status: "in_progress",
        stopTime: null,
      });
      expect(countDownSchedulerSpy).toHaveBeenCalled();
    });
  });

  describe("start next session handler test suite", () => {
    it("should not start a new session if the cycle is completed", async () => {
      cycleStub.completed = true;

      await startNextSession(userStub, cycleStub, sessionEntityStub);

      expect(createSessionBySessionTypeSpy).not.toHaveBeenCalled();
    });

    it("should start a long break if enough work sessions are completed", async () => {
      cycleStub.completed = false;
      userStub.configuration.longBreakInterval = 1;
      sessionEntityStub.type = "work";
      getSessionsByCycleSpy.mockResolvedValueOnce([
        { type: "work" },
      ] as Session[]);

      await startNextSession(userStub, cycleStub, sessionEntityStub);

      expect(createSessionBySessionTypeSpy).toHaveBeenCalledWith(
        userStub,
        "longBreak",
        cycleStub
      );
      expect(countDownSchedulerSpy).toHaveBeenCalled();
    });

    it("should start a short break after a work session", async () => {
      userStub.configuration.longBreakInterval = 2;
      sessionEntityStub.type = "work";
      getSessionsByCycleSpy.mockResolvedValueOnce([
        { type: "work" },
      ] as Session[]);

      await startNextSession(userStub, cycleStub, sessionEntityStub);

      expect(createSessionBySessionTypeSpy).toHaveBeenCalledWith(
        userStub,
        "shortBreak",
        cycleStub
      );
      expect(countDownSchedulerSpy).toHaveBeenCalled();
    });

    it("should start a work session after a short break", async () => {
      sessionEntityStub.type = "shortBreak";

      await startNextSession(userStub, cycleStub, sessionEntityStub);

      expect(createSessionBySessionTypeSpy).toHaveBeenCalledWith(
        userStub,
        "work",
        cycleStub
      );
      expect(countDownSchedulerSpy).toHaveBeenCalled();
    });

    // it("should mark the cycle as completed after a long break", async () => {
    //   sessionEntityStub.type = "longBreak";

    //   await startNextSession(userStub, cycleStub, sessionEntityStub);

    //   expect(updateCycleSpy).toHaveBeenCalledWith(cycleStub.id, {
    //     completed: true,
    //   });
    // });
  });
});
