import { User } from "../entities/User";
import { CreateSession } from "../schema/Session";
import ConnectionManager from "../utils/connection";

export const getUser = async (userId: number) => {
  const connection = await ConnectionManager.getInstance();
  const userRepository = connection.getRepository(User);
  return userRepository.findOneBy({
    id: userId,
  });
};

export const handleCreateSession = async (session: CreateSession) => {
  const user = await getUser(session.userId);
  console.log("retrieved user");

  if (!user) {
    throw Error(`unable find user with userId ${session.userId}`);
  }

  //retrieve user configuration
  //create session
  //start new job to count down
};
