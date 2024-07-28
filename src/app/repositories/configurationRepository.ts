import { Configuration } from "../entities/Configuration";
import ConnectionManager from "../utils/connection";

export const updateConfiguration = async (
  userId: number,
  updateData: Partial<Configuration>
) => {
  const connection = await ConnectionManager.getInstance();
  const configurationRepo = connection.getRepository(Configuration);

  // Fetch the existing configuration for the user
  const existingConfig = await configurationRepo.findOneBy({
    user: {
      id: userId,
    },
  });

  if (!existingConfig) {
    throw new Error("Configuration not found");
  }

  // Merge the existing configuration with the update data
  const updatedConfig = { ...existingConfig, ...updateData };

  // Save the updated configuration back to the database
  return await configurationRepo.save(updatedConfig);
};
