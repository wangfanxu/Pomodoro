import { Cycle } from "../../app/entities/Cycle";
import { Session } from "../../app/entities/Session";
import { User } from "../../app/entities/User";
import {
  createSessionBySessionType,
  getSessionById,
  getSessionsByCycle,
  updateSession,
} from "../../app/repositories/sessionRepository";
import ConnectionManager from "../../app/utils/connection";

jest.mock("../../app/utils/connection");

describe("Session Repository Functions", () => {
  let mockConnection: any;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      findOneBy: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      save: jest.fn(),
    };

    mockConnection = {
      getRepository: jest.fn().mockReturnValue(mockRepository),
    };

    (ConnectionManager.getInstance as jest.Mock).mockResolvedValue(
      mockConnection
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getSessionById", () => {
    it("should return a session when found by ID", async () => {
      const sessionId = 1;
      const session = new Session();
      mockRepository.findOneBy.mockResolvedValue(session);

      const result = await getSessionById(sessionId);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: sessionId });
      expect(result).toBe(session);
    });

    it("should return null when no session is found by ID", async () => {
      const sessionId = 1;
      mockRepository.findOneBy.mockResolvedValue(null);

      const result = await getSessionById(sessionId);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: sessionId });
      expect(result).toBeNull();
    });
  });

  describe("getSessionsByCycle", () => {
    it("should return sessions associated with a cycle", async () => {
      const cycle = new Cycle();
      cycle.id = 1;
      const sessions = [new Session(), new Session()];
      mockRepository.find.mockResolvedValue(sessions);

      const result = await getSessionsByCycle(cycle);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { cycle: { id: cycle.id } },
      });
      expect(result).toBe(sessions);
    });
  });

  describe("updateSession", () => {
    it("should update the session with given fields", async () => {
      const sessionId = 1;
      const updatedFields = { status: "completed" } as any;
      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await updateSession(sessionId, updatedFields);

      expect(mockRepository.update).toHaveBeenCalledWith(
        sessionId,
        updatedFields
      );
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe("createSessionBySessionType", () => {
    it("should create and save a new session", async () => {
      const user = new User();
      user.configuration = {
        workInterval: 25,
        shortBreak: 5,
        longBreak: 15,
      } as any;
      const cycle = new Cycle();
      const session = new Session();
      mockRepository.save.mockResolvedValue(session);

      const result = await createSessionBySessionType(user, "work", cycle);

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          user,
          cycle,
          type: "work",
          status: "in_progress",
          duration: 25,
        })
      );
      expect(result).toBe(session);
    });
  });
});
