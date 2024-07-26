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

export const updateSession = async (
  sessionId: number,
  updatedFields: Partial<Session>
) => {
  const connection = await ConnectionManager.getInstance();
  const sessionRepo = connection.getRepository(Session);
  return sessionRepo.update(sessionId, updatedFields);
};

export const createSessionBySessionType = async (
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

  console.log("duration", duration);

  const session = new Session();
  const connection = await ConnectionManager.getInstance();
  const sessionRepo = connection.getRepository(Session);
  const now = new Date();
  const endTime = new Date(now);
  endTime.setMinutes(now.getMinutes() + duration);

  session.startTime = now;
  session.duration = duration;
  session.status = "in_progress";
  session.user = userWithConfiguration;
  session.endTime = endTime;

  return sessionRepo.save(session);
};
