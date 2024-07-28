import cron, { ScheduledTask } from "node-cron";
import { User } from "../../app/entities/User";
import { Cycle } from "../../app/entities/Cycle";
import { Session } from "../../app/entities/Session";
import {
  resumeJob,
  scheduleCountdownJob,
  sendNotification,
  stopJob,
} from "../../app/utils/scheduler";
import { updateSession } from "../../app/repositories/sessionRepository";
import { userSockets } from "../../app/websocket";
import { startNextSession } from "../../app/services/sessionService";
// Mock dependencies
jest.mock("node-cron", () => ({
  schedule: jest.fn(),
}));
jest.mock("../../app/repositories/sessionRepository");
jest.mock("../../app/websocket");
jest.mock("../../app/services/sessionService");

describe("scheduler utils", () => {
  let user: User;
  let cycle: Cycle;
  let session: Session;

  beforeEach(() => {
    user = {
      id: 1,
      configuration: {},
      username: "test",
      passwordHash: "abc",
      createdAt: new Date(),
      updatedAt: new Date(),
      email: "abc",
      cycles: [],
      sessions: [],
    } as any as User;

    cycle = {
      id: 1,
      completed: false,
      sessions: {} as any,
      user: {} as any,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Cycle;

    session = {
      id: 1,
      user,
      cycle,
      status: "in_progress",
      endTime: new Date(Date.now() + 60000), // 1 minute from now
      stopTime: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any as Session;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should schedule a countdown job", () => {
    const mockCronJob = {
      stop: jest.fn(),
    } as unknown as ScheduledTask;
    (cron.schedule as jest.Mock).mockReturnValue(mockCronJob);

    scheduleCountdownJob(user, cycle, session);

    expect(cron.schedule).toHaveBeenCalled();
    expect(cron.schedule).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Function)
    );
  });

  test("should stop a job and update the session", async () => {
    const mockCronJob = {
      stop: jest.fn(),
    } as unknown as ScheduledTask;
    (cron.schedule as jest.Mock).mockReturnValue(mockCronJob);

    scheduleCountdownJob(user, cycle, session);
    await stopJob(session.id);

    expect(mockCronJob.stop).toHaveBeenCalled();
    expect(updateSession).toHaveBeenCalledWith(session.id, {
      status: "paused",
      stopTime: expect.any(Date),
    });
  });
  test("should throw error if end time or stop time is missing in resumeJob", async () => {
    await expect(
      resumeJob(user, { ...session, endTime: null }, cycle)
    ).rejects.toThrow(
      "end time and stopped time is required to resume session"
    );

    await expect(
      resumeJob(user, { ...session, stopTime: null }, cycle)
    ).rejects.toThrow(
      "end time and stopped time is required to resume session"
    );
  });
});
