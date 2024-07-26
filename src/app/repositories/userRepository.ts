import { User } from "../entities/User";
import ConnectionManager from "../utils/connection";

export const getUser = async (userId: number) => {
  const connection = await ConnectionManager.getInstance();
  const userRepository = connection.getRepository(User);
  return userRepository.findOneBy({
    id: userId,
  });
};

export const getUserWithConfiguration = async (userId: number) => {
  const connection = await ConnectionManager.getInstance();
  const userRepository = connection.getRepository(User);

  const user = await userRepository.findOne({
    where: { id: userId },
    relations: ["configuration"],
  });

  if (user) {
    return user;
  } else {
    throw new Error(`User with ID ${userId} not found`);
  }
};
