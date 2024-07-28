import { updateConfiguration } from "../../app/repositories/configurationRepository";
import ConnectionManager from "../../app/utils/connection";

jest.mock("../../app/utils/connection");

describe("updateConfiguration", () => {
  let mockConnection: any;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      findOneBy: jest.fn(),
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

  it("should update configuration when existing configuration is found", async () => {
    const userId = 1;
    const updateData = { someField: "newValue" } as any;
    const existingConfig = { user: { id: userId }, someField: "oldValue" };

    mockRepository.findOneBy.mockResolvedValue(existingConfig);
    mockRepository.save.mockResolvedValue({ ...existingConfig, ...updateData });

    const result = await updateConfiguration(userId, updateData);

    expect(mockRepository.findOneBy).toHaveBeenCalledWith({
      user: { id: userId },
    });
    expect(mockRepository.save).toHaveBeenCalledWith({
      ...existingConfig,
      ...updateData,
    });
    expect(result).toEqual({ ...existingConfig, ...updateData });
  });

  it("should throw an error when configuration is not found", async () => {
    const userId = 1;
    const updateData = { someField: "newValue" } as any;

    mockRepository.findOneBy.mockResolvedValue(null);

    await expect(updateConfiguration(userId, updateData)).rejects.toThrow(
      "Configuration not found"
    );
    expect(mockRepository.findOneBy).toHaveBeenCalledWith({
      user: { id: userId },
    });
    expect(mockRepository.save).not.toHaveBeenCalled();
  });
});
