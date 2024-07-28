import { User } from "../../app/entities/User";
import {
  getUser,
  getUserWithConfiguration,
} from "../../app/repositories/userRepository";
import ConnectionManager from "../../app/utils/connection";

jest.mock("../../app/utils/connection");

describe("User Repository Functions", () => {
  let mockConnection: any;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      findOneBy: jest.fn(),
      findOne: jest.fn(),
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

  describe("getUser", () => {
    it("should return a user when found by ID", async () => {
      const userId = 1;
      const user = new User();
      mockRepository.findOneBy.mockResolvedValue(user);

      const result = await getUser(userId);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
      expect(result).toBe(user);
    });

    it("should return null when no user is found by ID", async () => {
      const userId = 1;
      mockRepository.findOneBy.mockResolvedValue(null);

      const result = await getUser(userId);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
      expect(result).toBeNull();
    });
  });

  describe("getUserWithConfiguration", () => {
    it("should return a user with configuration when found by ID", async () => {
      const userId = 1;
      const user = new User();
      user.configuration = {} as any; // Mock configuration
      mockRepository.findOne.mockResolvedValue(user);

      const result = await getUserWithConfiguration(userId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        relations: ["configuration"],
      });
      expect(result).toBe(user);
    });

    it("should throw an error when no user is found by ID", async () => {
      const userId = 1;
      mockRepository.findOne.mockResolvedValue(null);

      await expect(getUserWithConfiguration(userId)).rejects.toThrow(
        `User with ID ${userId} not found`
      );

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        relations: ["configuration"],
      });
    });
  });
});
