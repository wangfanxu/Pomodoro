import { createConnection, Connection } from "typeorm";
import ConnectionManager from "../../app/utils/connection";

// Mocking the `createConnection` method from `typeorm`
jest.mock("typeorm", () => ({
  createConnection: jest.fn(),
}));

describe("ConnectionManager", () => {
  let mockConnection: Connection;

  beforeEach(() => {
    // Reset the mock before each test
    jest.resetAllMocks();

    // Create a mock Connection object
    mockConnection = {
      close: jest.fn().mockResolvedValue(undefined),
    } as unknown as Connection;

    // Mock `createConnection` to resolve with the mock Connection
    (createConnection as jest.Mock).mockResolvedValue(mockConnection);
  });

  afterEach(async () => {
    // Ensure the connection is closed after each test
    await ConnectionManager.closeConnection();
  });

  test("getInstance should create a new connection if none exists", async () => {
    const connection = await ConnectionManager.getInstance();

    expect(createConnection).toHaveBeenCalledTimes(1);
    expect(connection).toBe(mockConnection);
  });

  test("getInstance should return the existing connection if one exists", async () => {
    const connection1 = await ConnectionManager.getInstance();
    const connection2 = await ConnectionManager.getInstance();

    expect(createConnection).toHaveBeenCalledTimes(1);
    expect(connection1).toBe(connection2);
  });

  test("closeConnection should close the existing connection", async () => {
    await ConnectionManager.getInstance();
    await ConnectionManager.closeConnection();

    expect(mockConnection.close).toHaveBeenCalledTimes(1);
    expect(ConnectionManager["instance"]).toBeNull();
  });

  test("closeConnection should not throw if no connection exists", async () => {
    await expect(ConnectionManager.closeConnection()).resolves.toBeUndefined();
  });

  test("reconnect should close the existing connection and create a new one", async () => {
    await ConnectionManager.getInstance();
    await ConnectionManager.reconnect();

    expect(mockConnection.close).toHaveBeenCalledTimes(1);
    expect(createConnection).toHaveBeenCalledTimes(2);
  });
});
