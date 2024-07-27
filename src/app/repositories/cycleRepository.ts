import { Cycle } from "../entities/Cycle";
import { User } from "../entities/User";
import ConnectionManager from "../utils/connection";

export const updateCycle = async (
  cycleId: number,
  updatedFields: Partial<Cycle>
) => {
  const connection = await ConnectionManager.getInstance();
  const cycleRepo = connection.getRepository(Cycle);
  return cycleRepo.update(cycleId, updatedFields);
};

export const getUserUncompletedCycles = async (userId: number) => {
  const connection = await ConnectionManager.getInstance();

  const cycleRepo = connection.getRepository(Cycle);
  return await cycleRepo
    .createQueryBuilder("cycle")
    .where("cycle.userId = :userId", { userId }) // Adjust based on your actual column name for user ID
    .orderBy("cycle.created_at", "DESC") // Order by time in descending order
    .limit(1) // Limit the results to 1
    .getOne(); // Use getOne() for a single result
};

export const createCycle = async (user: User) => {
  const cycle = new Cycle();
  const connection = await ConnectionManager.getInstance();
  const cycleRepo = connection.getRepository(Cycle);
  const userRepo = connection.getRepository(User);

  cycle.completed = false;
  cycle.user = user;
  return cycleRepo.save(cycle);
};
