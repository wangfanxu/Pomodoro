import { Configuration } from "../entities/Configuration";
import { User } from "../entities/User";
import { createSession } from "../repositories/sessionRepository";
import {
  getUser,
  getUserWithConfiguration,
} from "../repositories/userRepository";
import { CreateSession } from "../schema/Session";
import ConnectionManager from "../utils/connection";

const defaultConfiguration = {
  workInterval: 4,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
} as Configuration;

export const handleCreateSession = async (session: CreateSession) => {
  const user = await getUserWithConfiguration(session.userId);
  console.log("user", user);

  if (!user) {
    console.log("cannot find user");
    throw Error(`unable find user with userId ${session.userId}`);
  }

  if (!user.configuration) {
    //use default configuration
    console.log("setting default configuration", defaultConfiguration);
    user.configuration = defaultConfiguration;
  }

  console.log("before create session");
  const createdSession = await createSession(user, session.sessionType);
  console.log("createdSession", createdSession);

  //create session
  //start new job to count down
};
