import { Cycle } from "../../app/entities/Cycle";
import { User } from "../../app/entities/User";
import {
  createCycle,
  getCycleById,
  getUserUncompletedCycles,
  updateCycle,
} from "../../app/repositories/cycleRepository";
import ConnectionManager from "../../app/utils/connection";

jest.mock("../../app/utils/connection");

describe("Cycle Repository Functions", () => {
  let mockConnection: any;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      findOneBy: jest.fn(),
      update: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
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

  describe("getCycleById", () => {
    it("should return a cycle when found by ID", async () => {
      const cycleId = 1;
      const cycle = new Cycle();
      mockRepository.findOneBy.mockResolvedValue(cycle);

      const result = await getCycleById(cycleId);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: cycleId });
      expect(result).toBe(cycle);
    });

    it("should return null when no cycle is found by ID", async () => {
      const cycleId = 1;
      mockRepository.findOneBy.mockResolvedValue(null);

      const result = await getCycleById(cycleId);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: cycleId });
      expect(result).toBeNull();
    });
  });

  describe("updateCycle", () => {
    it("should update the cycle with given fields", async () => {
      const cycleId = 1;
      const updatedFields = { completed: true };
      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await updateCycle(cycleId, updatedFields);

      expect(mockRepository.update).toHaveBeenCalledWith(
        cycleId,
        updatedFields
      );
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe("getUserUncompletedCycles", () => {
    it("should return the most recent uncompleted cycle for a user", async () => {
      const userId = 1;
      const cycle = new Cycle();
      mockRepository.getOne.mockResolvedValue(cycle);

      const result = await getUserUncompletedCycles(userId);

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith("cycle");
      expect(mockRepository.where).toHaveBeenCalledWith(
        "cycle.userId = :userId",
        { userId }
      );
      expect(mockRepository.orderBy).toHaveBeenCalledWith(
        "cycle.created_at",
        "DESC"
      );
      expect(mockRepository.limit).toHaveBeenCalledWith(1);
      expect(mockRepository.getOne).toHaveBeenCalled();
      expect(result).toBe(cycle);
    });
  });

  describe("createCycle", () => {
    it("should create and save a new cycle for a user", async () => {
      const user = new User();
      const cycle = new Cycle();
      mockRepository.save.mockResolvedValue(cycle);

      const result = await createCycle(user);

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          completed: false,
          user,
        })
      );
      expect(result).toBe(cycle);
    });
  });
});
