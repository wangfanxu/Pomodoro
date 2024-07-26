import { Session } from "../entities/Session";
import { user } from "../entities/User";
import ConnectionManager from "../utils/connection";

export const getSession = async (sessionId: number) => {
  const connection = await ConnectionManager.getInstance();
  const sessionRepo = connection.getRepository(Session);
  return sessionRepo.findOneBy({
    id: sessionId,
  });
};

export const createSession = async (
  userWithConfiguration: user,
  sessionType: "work" | "shortBreak" | "longBreak"
) => {
  let duration;

  switch (sessionType) {
    case "work":
      duration = userWithConfiguration.configuration.workInterval;
      break;
    case "shortBreak":
      duration = userWithConfiguration.configuration.shortBreak;
    case "longBreak":
      duration = userWithConfiguration.configuration.longBreak;
  }

  const session = new Session();
  const connection = await ConnectionManager.getInstance();
  const sessionRepo = connection.getRepository(Session);

  session.startTime = new Date();
  session.duration = duration;
  session.status = "in_progress";
  session.user = userWithConfiguration;

  return sessionRepo.save(session);
};
