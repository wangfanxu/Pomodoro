import { createConnection, Connection, ConnectionOptions } from "typeorm";

class ConnectionManager {
  private static instance: Connection | null = null;

  public static async getInstance(): Promise<Connection> {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = await createConnection();
    }
    return ConnectionManager.instance;
  }

  public static async closeConnection(): Promise<void> {
    if (ConnectionManager.instance) {
      await ConnectionManager.instance.close();
      ConnectionManager.instance = null;
    }
  }

  public static async reconnect(): Promise<Connection> {
    await ConnectionManager.closeConnection();
    return await ConnectionManager.getInstance();
  }
}

export default ConnectionManager;
